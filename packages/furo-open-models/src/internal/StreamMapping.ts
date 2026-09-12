import type { FieldNodeConstructor } from "./HttpPath";
import type { SseFrame } from "../SseParser";

/**
 * Mapping one streamed unit onto the generated response type.
 *
 * The two framings carry the same message differently, and this is where that difference ends -
 * everything downstream sees one literal shape:
 *
 * - **ndjson** puts a whole response message on each line, which is plain proto3 json.
 * - **SSE** splits it: the `event:` name is the name of a oneof member on the response message and
 *   the `data:` line is that member's value on its own. A response type without a oneof falls back
 *   to parsing `data:` straight into it, so a single type stream needs no envelope.
 */
export interface StreamMapper<RES> {
  /** Map one SSE frame, or undefined when the frame names no member and is skipped. */
  fromSseFrame(frame: SseFrame): RES | undefined;
  /** Map one ndjson line. */
  fromNdjsonLine(line: string): RES;
}

export function createStreamMapper<RES>(ResType: FieldNodeConstructor, useProtoNames: boolean): StreamMapper<RES> {
  // protoName → the oneof member it names, read once.
  const oneofMembers = new Map<string, string>();
  const probe = new ResType();
  probe.__meta.nodeFields.forEach(field => {
    if (field.oneofGroup) {
      oneofMembers.set(field.protoName, field.protoName);
    }
  });

  const toLiteral = (json: unknown): RES => {
    if (!useProtoNames) {
      return json as RES;
    }
    const node = new ResType();
    node.__fromProtoNameJson(json);
    return node.__toLiteral() as RES;
  };

  return {
    fromSseFrame(frame: SseFrame): RES | undefined {
      let payload: unknown;
      try {
        payload = JSON.parse(frame.data);
      } catch {
        throw new Error(`Failed to parse SSE data of event '${frame.event}': ${frame.data}`);
      }

      // No oneof on the response type: the frame's data *is* the message, the ndjson rule.
      if (oneofMembers.size === 0) {
        return toLiteral(payload);
      }

      const member = oneofMembers.get(frame.event);
      if (member === undefined) {
        // A server that adds an event must not break a client that predates it.
        console.warn(`[open-models] no oneof member named '${frame.event}' on the response type, event skipped`);
        return undefined;
      }

      return toLiteral({ [member]: payload });
    },

    fromNdjsonLine(line: string): RES {
      let parsed: unknown;
      try {
        parsed = JSON.parse(line);
      } catch {
        throw new Error(`Failed to parse NDJSON line: ${line}`);
      }
      return toLiteral(parsed);
    },
  };
}
