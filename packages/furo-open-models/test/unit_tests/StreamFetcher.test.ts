import { expect, vi, afterEach } from "vitest";

import { StreamFetcher } from "@furo/open-models/dist/StreamFetcher";
import { StreamHttpError } from "@furo/open-models/dist/StreamErrors";
import { CubeEvent } from "../protoc-gen-open-models/furo/cube/CubeEvent";
import { CubeServiceWatchRequest } from "../protoc-gen-open-models/furo/cube/CubeServiceWatchRequest";
import type { ICubeEvent } from "../protoc-gen-open-models/furo/cube/CubeEvent";

const API_OPTIONS = {
  serverAddr: "",
  ApiBaseURL: "/api",
  headers: new Headers({ "Content-Type": "application/json" }),
  // short, so a reconnect test does not sit for three seconds
  timeout: 1000,
  UseProtoNames: true,
  UseProtoNamesForQueryParams: true,
};

/**
 * A response whose body delivers `chunks` and then ends, like a stream the server closed.
 */
function streamResponse(chunks: string[], contentType: string, status = 200): Response {
  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      chunks.forEach(chunk => {
        controller.enqueue(encoder.encode(chunk));
      });
      controller.close();
    },
  });
  return new Response(body, { status, headers: { "content-type": contentType } });
}

/**
 * Stub fetch with one response per call. Extra calls - the reconnects - reuse the last one.
 */
function stubFetch(responses: (() => Response)[]): { calls: Request[] } {
  const calls: Request[] = [];
  let n = 0;
  vi.stubGlobal("fetch", (request: Request) => {
    calls.push(request);
    const make = responses[Math.min(n, responses.length - 1)];
    n += 1;
    return Promise.resolve(make());
  });
  return { calls };
}

/** Drain an iterable, stopping after `max` messages so a reconnecting stream terminates. */
async function take(iterable: AsyncIterable<ICubeEvent>, max: number): Promise<ICubeEvent[]> {
  const out: ICubeEvent[] = [];
  for await (const message of iterable) {
    out.push(message);
    if (out.length >= max) {
      break;
    }
  }
  return out;
}

function newFetcher(): StreamFetcher<Record<string, never>, ICubeEvent> {
  return new StreamFetcher(API_OPTIONS, "GET", "/v1/cubes:watch", CubeServiceWatchRequest, CubeEvent);
}

describe("StreamFetcher", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe("SSE framing", () => {
    it("maps the event name onto the oneof member", async () => {
      stubFetch([() => streamResponse(['event: cube_deleted\ndata: {"cube_id":"c-1"}\n\n'], "text/event-stream")]);

      const fetcher = newFetcher();
      const messages = await take(await fetcher.invoke({}), 1);

      expect(messages).to.have.lengthOf(1);
      expect(messages[0].cubeDeleted?.cubeId).to.equal("c-1");
    });

    it("maps an unnamed frame onto the member called message", async () => {
      // No `event:` line, so the SSE default type `message` applies - which is why the heartbeat
      // member is named `message` in the proto.
      stubFetch([() => streamResponse(['data: {"count":7}\n\n'], "text/event-stream")]);

      const fetcher = newFetcher();
      const messages = await take(await fetcher.invoke({}), 1);

      expect(messages[0].message?.count).to.equal(7);
    });

    it("survives a frame split across chunk boundaries", async () => {
      stubFetch([() => streamResponse(["event: cube_del", 'eted\ndata: {"cube_', 'id":"split"}\n', "\n"], "text/event-stream")]);

      const fetcher = newFetcher();
      const messages = await take(await fetcher.invoke({}), 1);

      expect(messages[0].cubeDeleted?.cubeId).to.equal("split");
    });

    it("ignores comments and a lone retry, and skips an unknown event name", async () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
      stubFetch([
        () =>
          streamResponse(
            // pickomock opens exactly like this: a comment and a retry, neither of them an event.
            [": connected\n\nretry: 2000\n\n", 'event: not_a_member\ndata: {"x":1}\n\n', 'event: cube_deleted\ndata: {"cube_id":"after"}\n\n'],
            "text/event-stream"
          ),
      ]);

      const fetcher = newFetcher();
      const messages = await take(await fetcher.invoke({}), 1);

      // Only the known event came through; the comment, the retry and the unknown name did not.
      expect(messages).to.have.lengthOf(1);
      expect(messages[0].cubeDeleted?.cubeId).to.equal("after");
      expect(warn).toHaveBeenCalled();
    });
  });

  describe("framing equivalence", () => {
    it("yields deep equal messages whether the server sends SSE or ndjson", async () => {
      const asSse = [
        'event: cube_deleted\ndata: {"cube_id":"c-1"}\n\n',
        'data: {"count":3}\n\n',
        'event: cube_deleted\ndata: {"cube_id":"c-2"}\n\n',
      ];
      // The same three events, each as one whole CubeEvent per line.
      const asNdjson = ['{"cube_deleted":{"cube_id":"c-1"}}\n', '{"message":{"count":3}}\n', '{"cube_deleted":{"cube_id":"c-2"}}\n'];

      stubFetch([() => streamResponse(asSse, "text/event-stream")]);
      const fromSse = await take(await newFetcher().invoke({}), 3);

      vi.unstubAllGlobals();
      stubFetch([() => streamResponse(asNdjson, "application/x-ndjson")]);
      const fromNdjson = await take(await newFetcher().invoke({}), 3);

      expect(fromNdjson).to.deep.equal(fromSse);
      expect(fromSse[1].message?.count).to.equal(3);
    });

    it("names a Content-Type it cannot stream instead of guessing", async () => {
      stubFetch([() => streamResponse(['{"cube_deleted":{}}'], "application/json")]);

      const fetcher = newFetcher();
      let caught: unknown;
      try {
        await take(await fetcher.invoke({}), 1);
      } catch (error) {
        caught = error;
      }

      expect((caught as Error).message).to.contain("application/json");
    });
  });

  describe("failure handling", () => {
    it("throws with the status on a refusal and does not retry it", async () => {
      const { calls } = stubFetch([() => new Response("nope", { status: 401, statusText: "Unauthorized" })]);

      const fetcher = newFetcher();
      let caught: unknown;
      try {
        await take(await fetcher.invoke({}), 1);
      } catch (error) {
        caught = error;
      }

      expect(caught).to.be.instanceOf(StreamHttpError);
      expect((caught as StreamHttpError).status).to.equal(401);
      // The response is on the error and on the fetcher, so a caller can redirect on it.
      expect(fetcher.lastResponse?.status).to.equal(401);
      // One attempt only: retrying a 401 would spin.
      expect(calls).to.have.lengthOf(1);
    });

    it("reconnects when the body ends, and reports it", async () => {
      let call = 0;
      vi.stubGlobal("fetch", () => {
        call += 1;
        return Promise.resolve(streamResponse([`event: cube_deleted\ndata: {"cube_id":"c-${String(call)}"}\n\n`, "retry: 1\n\n"], "text/event-stream"));
      });

      const fetcher = newFetcher();
      const reconnects: number[] = [];
      fetcher.setHandlers({
        onReconnect: () => {
          reconnects.push(1);
        },
      });

      const messages = await take(await fetcher.invoke({}), 2);

      expect(messages[0].cubeDeleted?.cubeId).to.equal("c-1");
      // The second message could only come from a second connection.
      expect(messages[1].cubeDeleted?.cubeId).to.equal("c-2");
      expect(reconnects).to.have.lengthOf(1);
      fetcher.close();
    });

    it("stops reconnecting once close is called", async () => {
      const { calls } = stubFetch([() => streamResponse(['event: cube_deleted\ndata: {"cube_id":"only"}\n\nretry: 1\n\n'], "text/event-stream")]);

      const fetcher = newFetcher();
      const iterable = await fetcher.invoke({});

      const seen: ICubeEvent[] = [];
      for await (const message of iterable) {
        seen.push(message);
        fetcher.close();
      }

      expect(seen).to.have.lengthOf(1);
      expect(calls).to.have.lengthOf(1);
    });
  });

  describe("request building", () => {
    it("puts request fields on the query string, like a unary GET", async () => {
      const { calls } = stubFetch([() => streamResponse(['event: cube_deleted\ndata: {"cube_id":"x"}\n\n'], "text/event-stream")]);

      const fetcher = new StreamFetcher<{ cubeId?: string }, ICubeEvent>(API_OPTIONS, "GET", "/v1/cubes:watch", CubeServiceWatchRequest, CubeEvent);
      await take(await fetcher.invoke({ cubeId: "c-9" }), 1);

      // proto names, and the base url in front - this is what makes a resume cursor a proto field
      // rather than library work.
      expect(calls[0].url).to.contain("/api/v1/cubes:watch?cube_id=c-9");
    });
  });
});
