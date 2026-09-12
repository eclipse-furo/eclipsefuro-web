/**
 * Newline delimited JSON framing, and nothing else.
 *
 * The counterpart to SseParser: both turn a response body into the units it carries and leave the
 * mapping onto a message type to the caller, so StreamFetcher and StrictFetcher share one
 * implementation per framing.
 */

/**
 * Yield one JSON document per line.
 *
 * Blank lines are skipped, and a final line without a trailing newline is still yielded - unlike
 * SSE, an ndjson document is complete the moment the stream ends.
 *
 * @param body - The response body. Decoded as UTF-8, streaming, so a multi-byte character split
 *   across two chunks survives.
 */
export async function* parseNdjson(body: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed !== "") {
          yield trimmed;
        }
      }
    }

    const trailing = buffer.trim();
    if (trailing !== "") {
      yield trailing;
    }
  } finally {
    reader.releaseLock();
  }
}
