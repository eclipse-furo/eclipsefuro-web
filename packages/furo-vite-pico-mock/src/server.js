/**
 * pico-mock - a fixture server for vite projects.
 *
 * A fixture is a typed `.ts` module carrying optional middleware, which is what keeps the file
 * names honest: the querystring is not part of the file name and an id does not need a directory
 * of its own.
 *
 *   GET  /api/v1/cubes?query=foo   -> data/v1/cubes/GET.ts          + middleware reads req.query
 *   GET  /api/v1/cubes/1           -> data/v1/cubes/{cube_id}/GET.ts + middleware reads req.params
 *   POST /api/v1/cubes:search      -> data/v1/cubes/search.POST.ts
 *
 * What is left here is the koa wiring and the fixture envelope. The halves with rules worth pinning
 * down live next door and are covered by `specs/`: `Router.js` maps a path onto a file, `Request.js`
 * reads the body and the query string, `Auth.js` keeps the sessions of the mock gateway.
 *
 * `createPicoMock` builds the koa app, `startPicoMock` binds it to a port of its own, and `vite.js`
 * mounts it into a vite dev or preview server.
 */

import { existsSync } from "fs";
import Koa from "koa";
import path from "path";
import { runnerImport } from "vite";
import { createRouter } from "./Router.js";
import { readJsonBody, parseQuery } from "./Request.js";
import { DEFAULT_AUTH_OPTIONS, canSignIn, clearedCookie, createSessions, renderPicker, returnFromReferer, safeReturn, sessionCookie } from "./Auth.js";
import { createApiKeys } from "./ApiKeys.js";
import { configureInbox, createInbox, inboxEvent, matches, mintConfigured, senderName } from "./Notify.js";
import { openStream, publish } from "./Stream.js";

/** @typedef {import('./types.js').MockData<unknown[]>} MockData */
/** @typedef {import('./types.js').MockRequest} MockRequest */
/** @typedef {import('./types.js').MockResponse<unknown>} MockResponse */
/** @typedef {import('./types.js').MockUser} MockUser */
/** @typedef {import('./types.js').MockAuthOptions} MockAuthOptions */
/** @typedef {import('./types.js').MockSession} MockSession */
/** @typedef {import('./types.js').MockApiKey} MockApiKey */
/** @typedef {import('./types.js').NotifyTarget} NotifyTarget */
/** @typedef {import('./types.js').MockInboxEntry} MockInboxEntry */
/** @typedef {import('./types.js').MockError} MockError */
/** @typedef {import('./types.js').PicoMockOptions} PicoMockOptions */

/**
 * @param {number} ms - The number of milliseconds to wait before resolving the promise.
 * @return {Promise<void>} A promise that resolves after the specified time in milliseconds.
 */
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/** The one content type a streaming fixture may answer with, see `MockCase.stream`. */
const NDJSON = "application/x-ndjson";

/** google.rpc.Code for the http statuses the mock can answer with. 13 is INTERNAL. */
const RPC_CODE = { 400: 3, 401: 16, 403: 7, 404: 5, 409: 6, 422: 3, 500: 13 };

/**
 * The default error body, a google.rpc.Status - the shape a gRPC transcoding gateway answers with.
 *
 * @param {MockError} error
 * @return {unknown}
 */
export function rpcStatus({ status, error, message }) {
  return { error, message, code: RPC_CODE[status] ?? 13, details: [] };
}

/**
 * @param {string} value
 * @return {string}
 */
const withSlash = (value) => (value.endsWith("/") ? value : `${value}/`);

/**
 * @param {string | string[] | undefined} v
 * @return {string | undefined}
 */
const one = (v) => (Array.isArray(v) ? v[0] : v);

/**
 * Fill in the defaults of the options. Exported for the vite plugin, which needs the same prefixes
 * to decide what to hand over.
 *
 * @param {PicoMockOptions} [options]
 */
export function resolveOptions(options = {}) {
  const root = path.resolve(options.root ?? process.cwd());
  const dir = path.resolve(root, options.dir ?? "mock");
  const apiPrefix = withSlash(options.apiPrefix ?? "/api/");
  return {
    root,
    dataDir: path.resolve(root, options.dataDir ?? path.join(dir, "data")),
    usersFile: path.resolve(root, options.usersFile ?? path.join(dir, "auth", "users.ts")),
    apiKeysFile: path.resolve(root, options.apiKeysFile ?? path.join(dir, "auth", "apiKeys.ts")),
    apiPrefix,
    gatewayPrefix: withSlash(options.gatewayPrefix ?? `${apiPrefix}_pico-mock/`),
    loginPath: options.loginPath ?? "/auth.html",
    logoutPath: options.logoutPath ?? "/logout.html",
    aliases: options.aliases ?? {},
    formatError: options.formatError ?? rpcStatus,
    inbox: options.inbox ?? {},
  };
}

/**
 * Build the mock server: a koa app answering the fixtures under `apiPrefix` and the gateway routes
 * under `gatewayPrefix`. It does not listen; `startPicoMock` binds it to a port, the vite plugin
 * mounts `callback()` into the dev server.
 *
 * Every instance has its own fixture rotation. The sessions, the inboxes and the push bus are
 * process wide, on globalThis, so they survive a vite restart - and a fixture can reach them.
 *
 * @param {PicoMockOptions} [options]
 */
export function createPicoMock(options = {}) {
  const config = resolveOptions(options);
  const { root, dataDir, usersFile, apiKeysFile, apiPrefix, gatewayPrefix, loginPath, logoutPath, formatError } = config;

  /** How a message names a file: relative to the project, the way the developer knows it. */
  const shown = (file) => path.relative(root, file) || file;
  const files = { usersFile: shown(usersFile), apiKeysFile: shown(apiKeysFile) };
  const signIn = loginPath ? `sign in at ${loginPath}` : `sign in at ${gatewayPrefix}login`;

  /** Where a login or a logout must never return to. */
  const notTheApp = [apiPrefix, ...(loginPath ? [loginPath] : []), ...(logoutPath ? [logoutPath] : [])];

  configureInbox(config.inbox);

  const app = new Koa();

  // The routing rules live in Router.js, so they are reachable from a spec without standing up koa.
  const { resolveRoute } = createRouter({ dataDir, baseDir: root, apiPrefix });

  /**
   * Rotation state of the `sequence` of each fixture, keyed by its resolved file path. Lives in
   * memory only, so it resets whenever the server is built again.
   *
   * @type {Record<string, number>}
   */
  const sequences = {};

  /**
   * Answer with the configured error body, a google.rpc.Status unless `formatError` says otherwise.
   *
   * @param {any} ctx - The koa context.
   * @param {number} status
   * @param {string} error
   * @param {string} message
   */
  function answerStatus(ctx, status, error, message) {
    ctx.status = status;
    ctx.set("Content-Type", "application/json; charset=utf-8");
    ctx.set("Cache-Control", "no-store");
    ctx.body = formatError({ status, error, message });
  }

  // Basic error handling middleware
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      console.error(err);

      const status = err.statusCode || 500;

      // An error body for everything under the api, so a client reads a failed request the same way
      // it reads the 404 the router produces. The test is the *path*: `ctx.is()` inspects the request
      // content type, and a failing GET carries none.
      if (ctx.path.startsWith(apiPrefix)) {
        answerStatus(ctx, status, "pico_mock_error", err.message);
      } else {
        ctx.status = status;
        if (err.message) ctx.body = err.message;
      }
    }
  });

  // -------------------------------------------------------------------------------------------
  // Loading a fixture
  // -------------------------------------------------------------------------------------------

  /**
   * What the fixtures are imported with. runnerImport builds its config with a hardcoded
   * `configFile: false` that wins the merge, so no config file is ever read - not even one passed
   * explicitly. The aliases a fixture imports through therefore have to be handed over: the vite
   * plugin passes the ones of the vite config. The `configFile: false` below is redundant, and kept
   * only to say so out loud.
   */
  const loaderConfig = {
    configFile: false,
    root,
    resolve: { alias: config.aliases },
  };

  /**
   * Import a fixture through vite, so its aliases resolve.
   *
   * There is deliberately no cache: a fresh import per request costs a few milliseconds and is what
   * makes an edited fixture show up on the next request without restarting the dev server.
   *
   * @param {string} file - Absolute path of the fixture.
   * @return {Promise<MockData>} The fixture's default export.
   */
  async function loadFixture(file) {
    const { module } = await runnerImport(file, loaderConfig);
    const data = module.default;
    if (!data) {
      throw new Error(`[pico-mock] ${shown(file)} has no default export`);
    }
    if (!Array.isArray(data.cases) || data.cases.length === 0) {
      throw new Error(`[pico-mock] ${shown(file)} has no cases`);
    }
    return data;
  }

  // -------------------------------------------------------------------------------------------
  // Users and sessions - the mock gateway
  // -------------------------------------------------------------------------------------------

  const sessions = createSessions();

  const inbox = createInbox();

  /**
   * Deliver an inbox entry: into the inbox of every user it names, signed in or not, and live to the
   * open streams of each of them.
   *
   * @param {MockInboxEntry} entry
   * @param {MockUser[]} users
   * @param {MockSession | undefined} sender
   */
  function deliverToInboxes(entry, users, sender) {
    users
      .filter((u) => matches(entry.to, { key: u.key, roles: u.claims.roles }, sender?.key))
      .forEach((u) => {
        const notification = mintConfigured(entry, senderName(sender));
        inbox.deliver(u.key, notification);
        publish(inboxEvent(), JSON.stringify(notification), { users: [u.key] }, sender?.key);
      });
  }

  /**
   * Import the users through vite, like a fixture, so an edited user shows up on the next request.
   * Without a users file there are none.
   *
   * @return {Promise<{ users: MockUser[], options: MockAuthOptions }>}
   */
  async function loadUsers() {
    if (!existsSync(usersFile)) {
      return { users: [], options: { ...DEFAULT_AUTH_OPTIONS } };
    }
    const { module } = await runnerImport(usersFile, loaderConfig);
    return { users: module.USERS ?? [], options: { ...DEFAULT_AUTH_OPTIONS, ...module.AUTH_OPTIONS } };
  }

  /**
   * The api keys, re-imported per request like the users, so an edited key is live on the next one.
   *
   * @return {Promise<MockApiKey[]>}
   */
  async function loadApiKeys() {
    if (!existsSync(apiKeysFile)) return [];
    const { module } = await runnerImport(apiKeysFile, loaderConfig);
    return module.API_KEYS ?? [];
  }

  /**
   * The principal of a request, whichever credential proves it - an `authorization: Bearer` api key
   * or the session cookie. Both resolve to the same `MockSession` shape, which is what lets every
   * fixture read `req.user` without caring which one it was.
   *
   * **An `authorization` header never falls back to the cookie.** A header that is present and
   * unusable comes back as an `error` to answer verbatim, because falling through would turn a typo
   * in a key into a request that quietly succeeds as whoever the browser happens to be.
   *
   * `revalidate` is for the streams: it re-checks the credential before each message, so a stream
   * ends when its session is logged out or its key runs out.
   *
   * @param {any} ctx - The koa context.
   * @return {Promise<{ principal?: MockSession, error?: MockError, revalidate: () => MockSession | undefined }>}
   */
  async function principalOf(ctx) {
    const header = ctx.get("authorization");
    if (header) {
      const [keys, { users, options }] = await Promise.all([loadApiKeys(), loadUsers()]);
      const apiKeys = createApiKeys(keys, users, options, files);
      const { principal, error } = apiKeys.resolve(header);
      return { principal, error, revalidate: () => apiKeys.resolve(header).principal };
    }

    const signedIn = sessions.resolve(ctx.get("cookie"));
    return {
      principal: signedIn?.session,
      revalidate: () => (signedIn ? sessions.get(signedIn.sid) : undefined),
    };
  }

  app.use(async (ctx, next) => {
    if (!ctx.path.startsWith(gatewayPrefix)) {
      return next();
    }

    const { users, options } = await loadUsers();
    const query = parseQuery(ctx.request.querystring);
    // Back to where the app was when the gateway took over: an explicit `?return=`, or the page the
    // browser came from.
    const returnTo = safeReturn(one(query.return) ?? returnFromReferer(ctx.get("referer")), notTheApp);
    // login, logout and the picker are browser flows, so they read the cookie and only the cookie -
    // a bearer request must never be answered with a `Set-Cookie` or a 303. `whoami` and `notify` go
    // through `principalOf` below, so an api key can probe itself and a bot can send a notification.
    const current = sessions.resolve(ctx.get("cookie"));

    // Everything in here is per session, so none of it may be cached.
    ctx.set("Cache-Control", "no-store");

    switch (ctx.path.slice(gatewayPrefix.length)) {
      case "login": {
        const key = one(query.user);
        if (!key) {
          ctx.type = "text/html; charset=utf-8";
          ctx.body = renderPicker(users, returnTo, current?.session.key, { gatewayPrefix, ...files });
          return;
        }
        const user = users.find((u) => u.key === key);
        if (!user) {
          ctx.throw(404, `[pico-mock] there is no user "${key}" in ${files.usersFile}`);
        }
        if (!canSignIn(user)) {
          const why = user.disabled ? "disabled" : "a service account";
          ctx.throw(403, `[pico-mock] "${key}" is ${why} and cannot be signed in as; reach it with an api key from ${files.apiKeysFile}`);
        }
        // Switching users without signing out first still ends the previous session.
        if (current) sessions.logout(current.sid);
        const ttl = user.sessionTtlSeconds ?? options.sessionTtlSeconds;
        const { sid } = sessions.login(user, ttl);
        ctx.set("Set-Cookie", sessionCookie(sid, ttl, options.secureCookie));
        // No `Clear-Site-Data: "cache"` here or on logout, even though the previous user's responses
        // share their urls: Chrome takes around 5 s to process it. A per user fixture sends
        // `private, no-cache` with an ETag instead, see "Caching a per user response" in the Readme.
        ctx.status = 303;
        ctx.redirect(returnTo);
        return;
      }

      case "logout": {
        if (current) sessions.logout(current.sid);
        ctx.set("Set-Cookie", clearedCookie(options.secureCookie));
        ctx.status = 303;
        ctx.redirect(`${gatewayPrefix}login?return=${encodeURIComponent(returnTo)}`);
        return;
      }

      case "whoami": {
        // An api key answers here too, which makes this the probe for "is my key any good" - and
        // `claims` is what shows that a narrowed key really did lose the roles it narrowed away.
        const { principal, error } = await principalOf(ctx);
        if (error) {
          answerStatus(ctx, error.status, error.error, error.message);
          return;
        }
        if (!principal) {
          answerStatus(ctx, 401, "unauthenticated", `[pico-mock] there is no session and no api key, ${signIn}`);
          return;
        }
        const { key, claims, token, expiresAt, via, kind, apiKey } = principal;
        ctx.body = { key, claims, token, via, kind, api_key: apiKey, expires_at: new Date(expiresAt).toISOString() };
        return;
      }

      case "sse": {
        // The raw bus as `text/event-stream`, for curl. An app streams through a fixture with a
        // `stream` case instead, framed the way its api frames it. Here the event name stays in
        // `event:` and the payload in `data:`, unwrapped, so what you see is exactly what a fixture
        // pushed.
        const { principal, error, revalidate } = await principalOf(ctx);
        if (error) {
          answerStatus(ctx, error.status, error.error, error.message);
          return;
        }
        if (!principal) {
          answerStatus(ctx, 401, "unauthenticated", `[pico-mock] the event stream needs a session or an api key, ${signIn}`);
          return;
        }

        openStream(ctx, revalidate, {
          contentType: "text/event-stream",
          // `retry` shortens the client's 3s reconnect default, worth it because every dev server
          // restart drops every stream. The `: connected` comment is a courtesy for whoever is
          // watching in a terminal; the headers are flushed by openStream either way.
          preamble: ": connected\n\nretry: 2000\n\n",
          // The heartbeat passes no name and stays on the default `message` event, so `es.onmessage`
          // keeps working.
          frame: (name, data) => (name ? `event: ${name}\ndata: ${data}\n\n` : `data: ${data}\n\n`),
        });
        return;
      }

      case "notify": {
        // Send a notification by hand, to act as another user without a second browser. The sender
        // is the principal of this request - a signed in browser, or an api key, so a script can
        // post as the machine it authenticates as.
        const { principal, error } = await principalOf(ctx);
        if (error) {
          answerStatus(ctx, error.status, error.error, error.message);
          return;
        }
        const body = /** @type {Partial<MockInboxEntry> | undefined} */ (await readJsonBody(ctx));
        if (ctx.method !== "POST" || !body?.to || !body.title) {
          answerStatus(
            ctx,
            400,
            "invalid_argument",
            '[pico-mock] POST { "to": …, "title": … } as json; "to" is "all", "others", "self", { "users": […] } or { "roles": […] }'
          );
          return;
        }
        /** @type {MockInboxEntry} */
        const entry = { to: body.to, title: body.title, text: body.text, event: body.event };
        const sender = principal;
        const recipients = users.filter((u) => matches(entry.to, { key: u.key, roles: u.claims.roles }, sender?.key)).map((u) => u.key);
        deliverToInboxes(entry, users, sender);
        ctx.body = { delivered_to: recipients };
        return;
      }

      default:
        answerStatus(
          ctx,
          404,
          "pico_mock_no_route",
          `[pico-mock] ${ctx.path} is not a gateway route, there are ${gatewayPrefix}login, logout, whoami, sse and notify`
        );
    }
  });

  // -------------------------------------------------------------------------------------------
  // Response assembly
  // -------------------------------------------------------------------------------------------

  app.use(async (ctx, next) => {
    if (!ctx.path.startsWith(apiPrefix)) {
      return next();
    }

    // HEAD is answered from the GET fixture, the way a real server would.
    const method = ctx.method === "HEAD" ? "GET" : ctx.method.toUpperCase();

    // Drain the request body first, so the socket stays healthy even when we answer 404 below.
    const requestBody = await readJsonBody(ctx);

    const route = resolveRoute(ctx.path, method);

    if ("notFound" in route) {
      const message = `[pico-mock] no fixture for ${ctx.method} ${ctx.path}. ${route.notFound}`;
      console.warn(message);
      answerStatus(ctx, 404, "pico_mock_no_fixture", message);
      return;
    }

    const mockData = await loadFixture(route.file);

    // The gateway's half of a non public fixture. It refuses before a case is picked, so a 401 or a
    // 403 does not advance the `sequence` and no middleware runs on a request it would not get.
    const { principal, error, revalidate } = await principalOf(ctx);
    // A credential that was offered and did not work is refused on every fixture, public ones
    // included: a request that says who it is and gets it wrong should hear about it, rather than be
    // quietly served as nobody.
    if (error) {
      answerStatus(ctx, error.status, error.error, error.message);
      return;
    }
    if (mockData.auth && !principal) {
      answerStatus(ctx, 401, "unauthenticated", `[pico-mock] ${ctx.method} ${ctx.path} needs a session or an api key, ${signIn}`);
      return;
    }
    if (principal && typeof mockData.auth === "object") {
      const { roles, via } = mockData.auth;
      // 403 rather than 401: the caller *is* authenticated, just not with the kind of credential
      // this endpoint takes. A 401 would invite a browser to re-run the login flow and land here
      // again.
      if (via && principal.via !== via) {
        answerStatus(
          ctx,
          403,
          "permission_denied",
          `[pico-mock] ${ctx.method} ${ctx.path} is ${via === "api-key" ? "machine only, it needs an api key" : "browser only, it needs a session"}`
        );
        return;
      }
      const held = principal.claims.roles ?? [];
      if (roles?.length && !roles.some((role) => held.includes(role))) {
        const wanted = roles.join(", ");
        answerStatus(
          ctx,
          403,
          "permission_denied",
          `[pico-mock] ${ctx.method} ${ctx.path} needs one of the roles ${wanted}, ${principal.key} has ${held.join(", ") || "none"}`
        );
        return;
      }
    }

    // Pick the case and rotate. The counter indexes into `sequence`, which indexes into `cases`.
    //
    // It is clamped because the counter outlives the fixture: an edit that *shortens* `sequence` -
    // the fixtures hot reload, so that happens mid-run - would otherwise leave the counter past the
    // end, and `sequence[current]` would be undefined for exactly one request.
    const sequence = mockData.sequence ?? [0];
    const current = (sequences[route.file] ?? 0) % sequence.length;
    const index = /** @type {number} */ (sequence[current]);
    const mockCase = mockData.cases[index];
    sequences[route.file] = (current + 1) % sequence.length;

    if (!mockCase) {
      throw new Error(`[pico-mock] ${shown(route.file)}: sequence points at case ${index}, which does not exist`);
    }

    // Filled by res.notify() and res.inbox(), drained once the response is actually on the wire, see
    // below.
    /** @type {({ kind: "event", event: string, data: string, to?: NotifyTarget } | { kind: "inbox", entry: MockInboxEntry })[]} */
    const notifications = [];

    // The resolved case, with the defaults filled in so middleware never sees an undefined status.
    // The body is cloned because middleware mutates it in place.
    /** @type {MockResponse} */
    const res = {
      status: mockCase.status ?? 200,
      contentType: mockCase.contentType ?? "application/json; charset=utf-8",
      delay: mockCase.delay ?? 0,
      headers: structuredClone(mockCase.headers ?? []),
      body: mockCase.body === undefined ? undefined : structuredClone(mockCase.body),
      /**
       * Swap in a differently shaped body, i.e. an error. Everything left out keeps its value,
       * except the body, which is cleared when omitted.
       *
       * @param {{ status: number, body?: unknown, contentType?: string, headers?: import('./types.js').MockHeader[], delay?: number }} next
       */
      replace(next) {
        this.status = next.status;
        this.body = next.body;
        if (next.contentType !== undefined) this.contentType = next.contentType;
        if (next.headers !== undefined) this.headers = next.headers;
        if (next.delay !== undefined) this.delay = next.delay;
      },
      /**
       * Announce what this request did to every open stream.
       *
       * Queued, not sent: koa flushes the response only after this handler returns
       * (`fnMiddleware(ctx).then(handleResponse)`), so emitting here would put the notification on
       * the wire *before* the response it is announcing - with `delay` on the case, by that much.
       * The queue is drained on the response's 'finish' event instead, so a client that refetches on
       * a notification cannot race its own response.
       *
       * @param {string} event - Event name, i.e. `cube_created`.
       * @param {unknown} payload - Serialized to json as the event's data.
       * @param {{ to?: NotifyTarget }} [options] - Who hears it, everyone by default.
       */
      notify(event, payload, options) {
        notifications.push({ kind: "event", event, data: JSON.stringify(payload), to: options?.to });
      },
      /**
       * Put a notification into the inbox of every user `entry.to` names and push it to their open
       * streams, see Notify.js. Queued like `notify`.
       *
       * @param {MockInboxEntry} entry
       */
      inbox(entry) {
        notifications.push({ kind: "inbox", entry });
      },
    };

    /** @type {MockRequest} */
    const req = {
      method,
      path: ctx.path,
      customMethod: route.customMethod,
      params: route.params,
      query: parseQuery(ctx.request.querystring),
      body: requestBody,
      headers: Object.fromEntries(Object.entries(ctx.request.headers).map(([k, v]) => [k, Array.isArray(v) ? v.join(", ") : (v ?? "")])),
      user: principal,
    };

    for (const middleware of mockCase.middleware ?? []) {
      await middleware(res, req);
    }

    // Content-Type first, so a custom header can still override it.
    ctx.response.set("Content-Type", res.contentType);
    ctx.status = res.status;
    // A `MockHeader` is typed as a Record, so it *can* carry more than one key even though the house
    // style is one entry per object. Apply all of them rather than silently dropping the rest.
    res.headers.forEach((h) => {
      Object.entries(h).forEach(([key, value]) => ctx.response.set(key, value));
    });

    // A streaming case answers with lines rather than a document, so it leaves here: no body, no
    // 'finish' drain (it only fires when a stream *ends*) and no `delay`, which stalls a whole
    // response and means nothing to one that never completes.
    if (mockCase.stream) {
      if (res.contentType !== NDJSON) {
        throw new Error(
          `[pico-mock] ${shown(route.file)} streams, so its contentType must be '${NDJSON}', not '${res.contentType}'. The SSE view of the same bus is ${gatewayPrefix}sse.`
        );
      }

      const stream = openStream(ctx, revalidate, {
        contentType: res.contentType,
        // A bare newline. Flushing the headers is not enough on its own: a proxy in between may
        // forward the head only once the first body byte arrives, so without this a quiet stream
        // stays invisible to the browser until the first event - and a client with a
        // time-to-headers limit gives up and reconnects into the same wait. A blank line is not a
        // record, and an ndjson reader skips it.
        preamble: "\n",
        // One line per message, so `frame` is where a fixture's `map` gets its say. An unmapped
        // message is dropped rather than written as null.
        frame: (name, data) => {
          const message = mockCase.stream.map(name, JSON.parse(data), req);
          return message === undefined ? undefined : `${JSON.stringify(message)}\n`;
        },
      });

      mockCase.stream.open?.((message) => stream.write(`${JSON.stringify(message)}\n`), req);
      return;
    }

    if (res.body !== undefined) {
      // koa serializes an object body as json on its own. The Content-Type set above survives it -
      // koa only guesses a type when the header is not already there.
      ctx.body = res.body;
    }

    // Drain the notifications once this response has actually gone out. 'finish' fires after the
    // last byte is handed to the socket, so the push always trails the response that caused it. A
    // client that disconnects mid-request never fires it, which is the right outcome: nothing to
    // announce to a request nobody received.
    if (notifications.length > 0) {
      // An inbox entry goes to users, signed in or not, so its recipients come from the users file.
      // Looked up here rather than in the 'finish' handler, where a failing import would go
      // unnoticed.
      const users = notifications.some((n) => n.kind === "inbox") ? (await loadUsers()).users : [];
      const sender = principal;
      ctx.res.once("finish", () => {
        notifications.forEach((n) => {
          // Outside koa's error handling by now, so a failure is logged rather than left to take
          // the whole dev server down with it.
          try {
            if (n.kind === "event") {
              publish(n.event, n.data, n.to, sender?.key);
            } else {
              deliverToInboxes(n.entry, users, sender);
            }
          } catch (err) {
            console.error("[pico-mock] delivering a notification failed:", err);
          }
        });
      });
    }

    // simulate slow requests
    if (res.delay) {
      await sleep(res.delay);
    }
  });

  /**
   * Whether a url is the mock's to answer: the api, the gateway, or one of the two gateway pages.
   *
   * @param {string} url - Path and query, i.e. `req.url` of a node request.
   * @return {boolean}
   */
  function handles(url) {
    const pathname = url.split("?")[0] ?? "";
    return pathname.startsWith(apiPrefix) || pathname.startsWith(gatewayPrefix) || pathname === loginPath || pathname === logoutPath;
  }

  /**
   * A node request handler for everything `handles` accepts. The two gateway pages are rewritten
   * onto the gateway routes here, so `/auth.html?return=/x` is `<gatewayPrefix>login?return=/x`.
   *
   * @return {(req: import('http').IncomingMessage, res: import('http').ServerResponse) => Promise<void>}
   */
  function callback() {
    const handle = app.callback();
    return (req, res) => {
      const url = req.url ?? "/";
      const [pathname, search] = [url.split("?")[0], url.includes("?") ? url.slice(url.indexOf("?")) : ""];
      if (loginPath && pathname === loginPath) req.url = `${gatewayPrefix}login${search}`;
      if (logoutPath && pathname === logoutPath) req.url = `${gatewayPrefix}logout${search}`;
      return handle(req, res);
    };
  }

  return { app, config, handles, callback };
}

/**
 * Bind a single port.
 *
 * `listen` reports failures by emitting 'error', not by throwing, so an occupied port would take
 * the whole process down with an unhandled event. Wrap it in a promise instead, so the caller can
 * decide what to do.
 *
 * @param {import('http').RequestListener} handler
 * @param {number} port - Port to bind.
 * @param {string} host
 * @return {Promise<import('http').Server>} Resolves once the server accepts connections.
 */
async function listenOnce(handler, port, host) {
  const { createServer } = await import("http");
  return new Promise((resolve, reject) => {
    const server = createServer(handler);
    server.once("error", reject);
    server.once("listening", () => resolve(server));
    server.listen(port, host);
  });
}

// vite re-bundles a config that inlines this package on every dev-server restart, so a module level
// variable would not survive one. Park the handle on globalThis instead, so the next start can drop
// the previous listener - vite closes the old dev server only after the new one is up, too late to
// free the port for us.
const HANDLE = Symbol.for("pico-mock.server");

/**
 * Start the mock server on a port of its own. If the preferred port is taken the next ones are
 * tried, the way vite does it for its own dev port, so a second checkout still comes up.
 *
 * A previous server started by this function is closed first, so a restart takes the port back.
 *
 * @param {PicoMockOptions & { port?: number, host?: string, maxAttempts?: number }} [options] -
 *   `port` is the preferred one, 10000 by default. `host` defaults to `127.0.0.1`: a fixture
 *   server has no business being on the LAN.
 * @return {Promise<{ port: number, server: import('http').Server }>} The port the server actually
 *   bound to.
 */
export async function startPicoMock({ port = 10000, host = "127.0.0.1", maxAttempts = 10, ...options } = {}) {
  const previous = globalThis[HANDLE];
  if (previous) {
    previous.closeAllConnections(); // stream clients hold their socket open, close() alone would hang
    await new Promise((done) => {
      previous.close(done);
    });
    globalThis[HANDLE] = undefined;
  }

  const mock = createPicoMock(options);
  const handler = mock.callback();

  for (let candidate = port; candidate < port + maxAttempts; candidate++) {
    try {
      const server = await listenOnce(handler, candidate, host);
      globalThis[HANDLE] = server;
      console.log(`[pico-mock] serving ${path.relative(mock.config.root, mock.config.dataDir)} on http://localhost:${candidate}`);
      return { port: candidate, server };
    } catch (err) {
      if (err.code !== "EADDRINUSE") throw err;
      console.log(`[pico-mock] port ${candidate} is in use, trying another one...`);
    }
  }

  throw new Error(`[pico-mock] ports ${port}-${port + maxAttempts - 1} are all in use`);
}
