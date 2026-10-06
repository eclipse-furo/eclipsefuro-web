/**
 * pico-mock's push transport - the long-lived half of a response, and the bus behind it.
 *
 * Two kinds of route stream, and they frame the same bus differently:
 *
 * - a fixture with a `stream` case, i.e. `data/v1/notifications/stream.GET.ts`. It answers
 *   `application/x-ndjson`, one whole message per line, which is what an app consumes.
 * - `GET /api/_pico-mock/sse` is the gateway's raw view, `text/event-stream`, for `curl`.
 *
 * So what is shared is everything *except* the framing: opening the response, keeping the socket
 * alive, subscribing to the bus, re-checking the credential per message, honouring `to`, and
 * unsubscribing when the client goes away. `frame()` is the seam.
 */

import { EventEmitter } from "events";

import { matches } from "./Notify.js";

// https://medium.com/trabe/server-sent-events-sse-streams-with-node-and-koa-d9330677f0bf
//
// The emitter lives on globalThis: a vite config that inlines this package is re-bundled on every
// dev-server restart, and a fixture may import it through vite's module runner - either way a module
// level emitter could be a different object than the one the open streams are listening on.
const BUS = Symbol.for("pico-mock.events");
const HEARTBEAT = Symbol.for("pico-mock.heartbeat");

/** @type {import('events').EventEmitter} */
export const events = globalThis[BUS] ?? (globalThis[BUS] = new EventEmitter());
events.setMaxListeners(0);

/**
 * Heartbeat, so an open stream proves itself without anyone having to POST something. It counts
 * *heartbeats only* - a fixture notification does not advance it.
 *
 * Started by the first stream rather than on import, and `unref`ed, so importing the package - a
 * `vite build` loads the config, and with it the plugin - never keeps a process alive.
 *
 * The counter lives inside the closure because the interval outlives the module: the guard means
 * the interval the *first* copy installed is the one that keeps running.
 */
function startHeartbeat() {
  if (globalThis[HEARTBEAT]) return;
  let n = 0;
  globalThis[HEARTBEAT] = setInterval(() => {
    events.emit("data", JSON.stringify({ count: n++ }));
  }, 20000);
  globalThis[HEARTBEAT].unref?.();
}

/**
 * Push one message to every open stream.
 *
 * The heartbeat is the only emit without a name; everything else carries the event name a consumer
 * frames on.
 *
 * @param {string} event - Event name, i.e. `cube_created`.
 * @param {string} data - Already serialized json payload.
 * @param {import('./types.js').NotifyTarget} [to] - Who hears it, everyone by default.
 * @param {string} [senderKey] - Whoever caused it, for `"self"` and `"others"`.
 */
export function publish(event, data, to, senderKey) {
  events.emit("data", data, event, to, senderKey);
}

/**
 * Turn the response into a long-lived stream fed by the bus.
 *
 * The caller has already authenticated: `revalidate` is the one from `principalOf`, and it is
 * called again per message so a session that was logged out or an api key that expired ends the
 * stream rather than keeping it open forever. The 20 s heartbeat is what makes sure that happens
 * within 20 s even on an otherwise silent stream.
 *
 * @param {import('koa').Context} ctx
 * @param {() => import('./types.js').MockSession | undefined} revalidate
 * @param {object} options
 * @param {string} options.contentType - What the stream answers with.
 * @param {string} [options.preamble] - Written immediately, to flush the headers.
 * @param {(name: string | undefined, data: string) => string | undefined} options.frame - Turn one
 *   bus message into the bytes to write, or undefined to skip it. `name` is undefined for the
 *   heartbeat, `data` is the serialized payload.
 * @return {{ write: (text: string) => void, end: () => void, ended: () => boolean }}
 */
export function openStream(ctx, revalidate, { contentType, preamble, frame }) {
  startHeartbeat();
  ctx.request.socket.setTimeout(0);
  ctx.req.socket.setNoDelay(true);
  ctx.req.socket.setKeepAlive(true);

  ctx.set({
    "Content-Type": contentType,
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  ctx.status = 200;

  // Written straight to the response instead of handing Koa a stream body. Koa pipes a body into
  // the response and logs ERR_STREAM_PREMATURE_CLOSE whenever the pipe breaks, and a push stream
  // only ever ends that way: the client goes away on every reload and every closed tab.
  ctx.respond = false;
  const stream = ctx.res;

  // Node holds the headers back until the first write, and the first write here is whenever
  // something happens to push - up to 20s away on a quiet stream, or never. A client that bounds
  // its time-to-headers would give up long before that: a generated `StreamFetcher` aborts after
  // `API_OPTIONS.timeout`, 3s, and reconnects into the same wait forever. Send them now, before
  // there is any content to send.
  stream.flushHeaders();

  // SSE carries a `retry:` to shorten the client's 3s reconnect default, which is worth it because
  // every dev server restart drops every stream. ndjson has no such field and needs no preamble.
  if (preamble) {
    stream.write(preamble);
  }

  // Every message re-checks the credential first, then whether `to` reaches this user, and only
  // then asks the caller how to frame it.
  const listener = (data, name, to, senderKey) => {
    if (stream.writableEnded) return;
    const live = revalidate();
    if (!live) {
      stream.end();
      return;
    }
    if (!matches(to, { key: live.key, roles: live.claims.roles }, senderKey)) return;
    const text = frame(name, data);
    if (text !== undefined) {
      stream.write(text);
    }
  };

  events.on("data", listener);

  stream.on("close", () => {
    events.off("data", listener);
  });

  return {
    write: (text) => {
      if (!stream.writableEnded) stream.write(text);
    },
    end: () => {
      stream.end();
    },
    ended: () => stream.writableEnded,
  };
}
