import { afterEach, describe, expect, it, vi } from "vitest";

import { openStream, publish } from "../src/Stream.js";

type Frame = (name: string | undefined, data: string) => string | undefined;

/**
 * `Stream.js` is plain js, so its parameters are as wide as JSDoc makes them. Narrowing the call
 * here keeps the fake context and the fake principal out of the assertions below.
 */
const openTyped = openStream as unknown as (ctx: unknown, revalidate: unknown, options: { contentType: string; preamble?: string; frame: Frame }) => void;

/**
 * Stands in for a koa context around a long-lived response, so a test can read what was written
 * without standing up a server. Only the parts `openStream` touches are here.
 */
function fakeCtx() {
  const writes: string[] = [];
  const listeners: Record<string, () => void> = {};
  let flushed = false;

  const res = {
    writableEnded: false,
    flushHeaders: () => {
      flushed = true;
    },
    write: (text: string) => writes.push(text),
    end: () => {
      res.writableEnded = true;
    },
    on: (event: string, fn: () => void) => {
      listeners[event] = fn;
    },
  };

  const ctx = {
    request: { socket: { setTimeout: () => undefined } },
    req: { socket: { setNoDelay: () => undefined, setKeepAlive: () => undefined } },
    res,
    headers: {} as Record<string, string>,
    status: 0,
    respond: true,
    set(fields: Record<string, string>) {
      Object.assign(this.headers, fields);
    },
  };

  return {
    ctx,
    writes,
    flushed: () => flushed,
    ended: () => res.writableEnded,
    /** What node fires when the client goes away. */
    disconnect: () => listeners.close?.(),
  };
}

const alice = () => ({ key: "alice", claims: { roles: ["user"] } });

/** ndjson framing: one whole envelope per line, the way the notification fixture frames it. */
const asNdjson = (name: string | undefined, data: string) => `${JSON.stringify({ [name ?? "message"]: JSON.parse(data) })}\n`;

/** SSE framing, the way /api/_pico-mock/sse frames the same bus. */
const asSse = (name: string | undefined, data: string) => (name ? `event: ${name}\ndata: ${data}\n\n` : `data: ${data}\n\n`);

describe("openStream", () => {
  // Every stream registers a listener on the shared bus, so a test that leaves one open would
  // receive the next test's messages.
  const started: (() => void)[] = [];
  afterEach(() => {
    started.forEach((disconnect) => {
      disconnect();
    });
    started.length = 0;
    vi.restoreAllMocks();
  });

  const start = (frame: Frame, revalidate: () => unknown = alice, preamble?: string) => {
    const f = fakeCtx();
    openTyped(f.ctx, revalidate, { contentType: "application/x-ndjson", preamble, frame });
    started.push(f.disconnect);
    return f;
  };

  it("flushes the headers before there is anything to send", () => {
    const f = start(asNdjson);

    // Without this a quiet stream would not reach a client that bounds its time to headers - a
    // StreamFetcher gives up after 3s and reconnects into the same wait.
    expect(f.flushed()).toBe(true);
    expect(f.ctx.status).toBe(200);
    expect(f.ctx.headers["Content-Type"]).toBe("application/x-ndjson");
    expect(f.ctx.respond).toBe(false);
  });

  it("writes a preamble when one is given, and nothing when there is none", () => {
    expect(start(asNdjson).writes).toEqual([]);
    expect(start(asSse, alice, ": connected\n\n").writes).toEqual([": connected\n\n"]);
  });

  it("frames a named event and the unnamed heartbeat", () => {
    const f = start(asNdjson);

    publish("cube_created", JSON.stringify({ cube_id: "c-1" }));
    // The heartbeat carries no name, which is why the envelope member is called `message`.
    publish(undefined as unknown as string, JSON.stringify({ count: 7 }));

    expect(f.writes).toEqual(['{"cube_created":{"cube_id":"c-1"}}\n', '{"message":{"count":7}}\n']);
  });

  it("keeps the name out of band for sse and folds it in for ndjson", () => {
    const nd = start(asNdjson);
    const sse = start(asSse);

    publish("notifications_read", JSON.stringify({ unread_count: 3 }));

    expect(nd.writes).toEqual(['{"notifications_read":{"unread_count":3}}\n']);
    expect(sse.writes).toEqual(['event: notifications_read\ndata: {"unread_count":3}\n\n']);
  });

  it("skips a message the frame drops", () => {
    const f = start(() => undefined);

    publish("cube_created", JSON.stringify({ cube_id: "c-1" }));

    expect(f.writes).toEqual([]);
  });

  it("honours the target, so a push aimed elsewhere is not written", () => {
    const f = start(asNdjson);

    publish("cube_created", JSON.stringify({ cube_id: "c-1" }), { users: ["bob"] });
    expect(f.writes).toEqual([]);

    publish("cube_created", JSON.stringify({ cube_id: "c-2" }), { users: ["alice"] });
    expect(f.writes).toHaveLength(1);
  });

  it("ends the stream once the credential is gone", () => {
    let live = true;
    const f = start(asNdjson, () => (live ? alice() : undefined));

    publish("cube_created", JSON.stringify({ cube_id: "c-1" }));
    expect(f.ended()).toBe(false);

    // A logout or an expiry. The 20s heartbeat is what guarantees this is noticed.
    live = false;
    publish("cube_created", JSON.stringify({ cube_id: "c-2" }));

    expect(f.ended()).toBe(true);
    expect(f.writes).toHaveLength(1);
  });

  it("stops listening once the client disconnects", () => {
    const f = start(asNdjson);

    f.disconnect();
    publish("cube_created", JSON.stringify({ cube_id: "c-1" }));

    expect(f.writes).toEqual([]);
  });
});
