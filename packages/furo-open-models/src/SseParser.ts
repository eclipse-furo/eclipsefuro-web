/**
 * Server-Sent Events framing, and nothing else.
 *
 * Kept free of any message mapping so both the streaming fetcher and StrictFetcher's one pass
 * `text/event-stream` handler can share it. Follows the WHATWG event stream parsing rules:
 * https://html.spec.whatwg.org/multipage/server-sent-events.html
 */

/** One dispatched event. */
export interface SseFrame {
  /** The `event:` name, or `"message"` when the frame carried none. */
  event: string;
  /** The joined `data:` lines, without the trailing newline. */
  data: string;
  /** The `id:` in effect for this frame, if the stream ever sent one. */
  id: string | undefined;
}

/**
 * What the stream said about itself, as opposed to what it carried.
 *
 * A `retry:` or an `id:` may arrive on a frame that is never dispatched - pickomock opens with a
 * `: connected` comment and a lone `retry: 2000`, which sets the reconnect delay without
 * delivering an event - so these cannot be returned as part of a frame. The parser writes them
 * here as it goes and the caller reads them whenever it likes.
 */
export interface SseState {
  /** Milliseconds from the last `retry:` field, undefined until the stream sends one. */
  retry: number | undefined;
  /** The last `id:` seen. Parsed for completeness; this library does not resume a stream. */
  lastEventId: string | undefined;
}

/** A fresh state, for a caller that does not want to keep one across reconnects. */
export function newSseState(): SseState {
  return { retry: undefined, lastEventId: undefined };
}

/**
 * Turn a response body into the events it carries.
 *
 * @param body - The response body. Decoded as UTF-8, streaming, so a multi-byte character split
 *   across two chunks survives.
 * @param state - Written as `retry:` and `id:` fields go by.
 */
export async function* parseSse(body: ReadableStream<Uint8Array>, state: SseState): AsyncGenerator<SseFrame> {
  const reader = body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";
  let eventType = "";
  let data = "";
  let sawData = false;

  /**
   * Apply one line. Returns a frame when the line was the blank one that dispatches.
   */
  const consume = (line: string): SseFrame | undefined => {
    // A blank line dispatches whatever has been collected.
    if (line === "") {
      // "If the data buffer is an empty string, set the data buffer and the event type buffer to
      // the empty string and return." A comment or a lone `retry:` lands here.
      if (!sawData) {
        eventType = "";
        return undefined;
      }
      const frame: SseFrame = {
        event: eventType === "" ? "message" : eventType,
        // The spec appends a newline per data line, then strips the last one on dispatch.
        data: data.endsWith("\n") ? data.slice(0, -1) : data,
        id: state.lastEventId,
      };
      eventType = "";
      data = "";
      sawData = false;
      return frame;
    }

    // A line beginning with a colon is a comment.
    if (line.startsWith(":")) {
      return undefined;
    }

    const colon = line.indexOf(":");
    let field: string;
    let value: string;
    if (colon === -1) {
      // A line with no colon is a field with an empty value.
      field = line;
      value = "";
    } else {
      field = line.slice(0, colon);
      value = line.slice(colon + 1);
      // Exactly one leading space is stripped, not all of them.
      if (value.startsWith(" ")) {
        value = value.slice(1);
      }
    }

    switch (field) {
      case "event":
        eventType = value;
        break;
      case "data":
        data += `${value}\n`;
        sawData = true;
        break;
      case "id":
        // "If the field value does not contain U+0000 NULL, set the last event ID buffer."
        if (!value.includes("\u0000")) {
          state.lastEventId = value;
        }
        break;
      case "retry":
        if (/^\d+$/.test(value)) {
          state.retry = Number(value);
        }
        break;
      default:
        // An unknown field is ignored, so a server may add one without breaking older clients.
        break;
    }
    return undefined;
  };

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      // Lines end with CRLF, CR or LF. Normalise, then keep the trailing partial line in the
      // buffer - it is only complete once its terminator arrives.
      buffer = buffer.replace(/\r\n|\r/g, "\n");
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const frame = consume(line);
        if (frame) {
          yield frame;
        }
      }
    }

    // A stream that ends without a final blank line leaves an undispatched event behind. The spec
    // discards it, and so do we: half an event is not an event.
  } finally {
    reader.releaseLock();
  }
}
