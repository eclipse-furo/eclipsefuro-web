/**
 * pico-mock's sessions - the part of a gateway / BFF the mock stands in for.
 *
 * The browser only ever holds an opaque, HttpOnly session cookie. The session behind it carries the
 * user's claims and a JWT minted from them, the way a BFF keeps the token on its side after an
 * OIDC / Entra ID flow. Fixtures see the session as `req.user`.
 */

import { createHmac, randomBytes } from "node:crypto";

/** @typedef {import('./types.js').MockUser} MockUser */
/** @typedef {import('./types.js').MockSession} MockSession */
/** @typedef {import('./types.js').MockAuthOptions} MockAuthOptions */

export const SESSION_COOKIE = "pico_mock_session";

/**
 * What the `AUTH_OPTIONS` of the users file does not override.
 *
 * `secureCookie` is off: the mock is served over plain http on localhost, and Safari drops a
 * `Secure` cookie there, so a default of `true` would be a login that silently never sticks.
 *
 * @type {MockAuthOptions}
 */
export const DEFAULT_AUTH_OPTIONS = { sessionTtlSeconds: 8 * 60 * 60, secureCookie: false };

/**
 * Signs the minted tokens. It is a mock: the token proves nothing, it only has the shape and the
 * claims of the real one, so a fixture can read `req.user.token` the way a backend reads a bearer.
 */
const DEV_SECRET = "pico-mock-dev-secret";

/**
 * Split a `Cookie` header. The first occurrence of a name wins, the way servers commonly read it.
 *
 * @param {string | undefined} header
 * @return {Record<string, string>}
 */
export function parseCookies(header) {
  /** @type {Record<string, string>} */
  const cookies = {};
  for (const part of (header ?? "").split(";")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    const name = part.slice(0, eq).trim();
    if (name === "" || Object.hasOwn(cookies, name)) continue;
    cookies[name] = part.slice(eq + 1).trim();
  }
  return cookies;
}

/**
 * @param {unknown} value
 * @return {string}
 */
const base64url = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");

/**
 * Mint an HS256 JWT over the claims.
 *
 * @param {Record<string, unknown>} claims
 * @param {number} iat - Issued at, epoch seconds.
 * @param {number} exp - Expires at, epoch seconds.
 * @return {string}
 */
export function mintJwt(claims, iat, exp) {
  const unsigned = `${base64url({ alg: "HS256", typ: "JWT" })}.${base64url({ ...claims, iss: "pico-mock", iat, exp })}`;
  const signature = createHmac("sha256", DEV_SECRET).update(unsigned).digest("base64url");
  return `${unsigned}.${signature}`;
}

/**
 * Where a login or logout may send the browser back to: a path on this origin that belongs to the
 * app. Anything else - an absolute url, a protocol relative `//host`, a `/\host` the browser would
 * normalize into one, the api or the gateway pages themselves - falls back to `/`.
 *
 * @param {string | undefined} value
 * @param {string[]} [blocked] - Path prefixes that are not the app: the api, the login and the
 *   logout page. The server passes the ones it is configured with.
 * @return {string}
 */
export function safeReturn(value, blocked = ["/api/", "/auth.html", "/logout.html"]) {
  if (typeof value !== "string" || !value.startsWith("/") || /^\/[/\\]/.test(value)) return "/";
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001f\u007f]/.test(value)) return "/";
  if (blocked.some((prefix) => value.startsWith(prefix))) return "/";
  return value;
}

/**
 * The path and query of a `Referer`, which is where the app was when the gateway took over.
 *
 * @param {string | undefined} referer
 * @return {string | undefined}
 */
export function returnFromReferer(referer) {
  if (!referer) return undefined;
  try {
    const url = new URL(referer);
    return url.pathname + url.search;
  } catch {
    return undefined;
  }
}

/**
 * @param {string} sid
 * @param {number} ttlSeconds
 * @param {boolean} secure
 * @return {string}
 */
export function sessionCookie(sid, ttlSeconds, secure) {
  return [`${SESSION_COOKIE}=${sid}`, "Path=/", `Max-Age=${ttlSeconds}`, "HttpOnly", "SameSite=Lax", ...(secure ? ["Secure"] : [])].join("; ");
}

/**
 * @param {boolean} secure
 * @return {string}
 */
export function clearedCookie(secure) {
  return sessionCookie("", 0, secure);
}

/**
 * The sessions of the running server.
 *
 * Kept on globalThis for the same reason the SSE bus is: vite re-bundles the server on every dev
 * server restart, and a module level map would log everybody out each time. Stopping the process
 * still does.
 *
 * @return {Map<string, MockSession>}
 */
function globalSessions() {
  const key = Symbol.for("pico-mock.sessions");
  const store = /** @type {Record<symbol, Map<string, MockSession> | undefined>} */ (/** @type {unknown} */ (globalThis));
  return (store[key] ??= new Map());
}

/**
 * A session store. The server uses the global one, a spec passes its own map.
 *
 * @param {Map<string, MockSession>} [store]
 */
export function createSessions(store = globalSessions()) {
  /**
   * Start a session for `user`.
   *
   * @param {MockUser} user
   * @param {number} ttlSeconds
   * @param {number} [now] - Epoch milliseconds.
   * @return {{ sid: string, session: MockSession }}
   */
  function login(user, ttlSeconds, now = Date.now()) {
    const sid = randomBytes(24).toString("base64url");
    const expiresAt = now + ttlSeconds * 1000;
    /** @type {MockSession} */
    const session = {
      key: user.key,
      claims: user.claims,
      token: mintJwt(user.claims, Math.floor(now / 1000), Math.floor(expiresAt / 1000)),
      expiresAt,
      via: "session",
      kind: user.kind ?? "human",
    };
    store.set(sid, session);
    return { sid, session };
  }

  /**
   * The session a `Cookie` header points at. An expired one is dropped on the way, so it answers 401
   * from then on - that is how a user with a short `sessionTtlSeconds` exercises re-authentication.
   *
   * @param {string | undefined} cookieHeader
   * @param {number} [now] - Epoch milliseconds.
   * @return {{ sid: string, session: MockSession } | undefined}
   */
  function resolve(cookieHeader, now = Date.now()) {
    const sid = parseCookies(cookieHeader)[SESSION_COOKIE];
    if (!sid) return undefined;
    const session = get(sid, now);
    return session ? { sid, session } : undefined;
  }

  /**
   * The session behind an id, as long as it has not run out. An open event stream asks this before
   * every message, so the stream ends together with its session.
   *
   * @param {string} sid
   * @param {number} [now] - Epoch milliseconds.
   * @return {MockSession | undefined}
   */
  function get(sid, now = Date.now()) {
    const session = store.get(sid);
    if (!session) return undefined;
    if (session.expiresAt <= now) {
      store.delete(sid);
      return undefined;
    }
    return session;
  }

  /**
   * @param {string} sid
   */
  function logout(sid) {
    store.delete(sid);
  }

  return { login, resolve, get, logout };
}

/**
 * Whether the browser may sign in as this user at all.
 *
 * A `kind: "service"` user is a machine identity: it exists so an api key can act as it, and
 * offering it in the picker would be offering a password-less login to a robot. A `disabled` one is
 * deactivated. Both are still perfectly good notification recipients, which is why they stay in
 * `USERS` - see `MockUser.kind`.
 *
 * @param {MockUser} user
 * @return {boolean}
 */
export function canSignIn(user) {
  return user.kind !== "service" && !user.disabled;
}

/**
 * @param {string} value
 * @return {string}
 */
const escapeHtml = (value) => value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/**
 * Where the picker's links point and which files its footnote names.
 *
 * @typedef {object} PickerOptions
 * @property {string} [gatewayPrefix] - The gateway routes, `/api/_pico-mock/` by default.
 * @property {string} [usersFile] - The users file as the reader knows it, relative to the project.
 * @property {string} [apiKeysFile] - The api keys file, likewise.
 */

/**
 * The user picker - what the identity provider's login page is in a deployed app.
 *
 * Links are absolute: the page is also served as the `loginPath` (`/auth.html`), where a relative
 * `login?…` would resolve against the wrong directory.
 *
 * @param {MockUser[]} users
 * @param {string} returnTo - Already passed through `safeReturn`.
 * @param {string | undefined} currentKey - The user of the session the browser holds, if any.
 * @param {PickerOptions} [options]
 * @return {string}
 */
export function renderPicker(
  users,
  returnTo,
  currentKey,
  { gatewayPrefix = "/api/_pico-mock/", usersFile = "mock/auth/users.ts", apiKeysFile = "mock/auth/apiKeys.ts" } = {}
) {
  const signable = users.filter(canSignIn);
  const items = signable
    .map((u) => {
      const href = `${gatewayPrefix}login?user=${encodeURIComponent(u.key)}&return=${encodeURIComponent(returnTo)}`;
      const current = u.key === currentKey;
      const roles = u.claims.roles.join(", ") || "no roles";
      const ttl = u.sessionTtlSeconds === undefined ? "" : ` · session ends after ${u.sessionTtlSeconds}s`;
      return `<li><a class="user${current ? " current" : ""}" href="${escapeHtml(href)}">${escapeHtml(u.claims.name)}${current ? " (signed in)" : ""}<small>${escapeHtml(`${u.claims.preferred_username} · ${roles}${ttl}`)}</small></a></li>`;
    })
    .join("\n      ");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>pico-mock sign in</title>
    <style>
      :root { color-scheme: light dark; font-family: system-ui, sans-serif; }
      body { max-width: 32rem; margin: 3rem auto; padding: 0 1rem; }
      ul { list-style: none; padding: 0; }
      li { margin: 0.5rem 0; }
      a.user { display: block; padding: 0.75rem 1rem; border: 1px solid #8886; border-radius: 0.5rem; text-decoration: none; color: inherit; }
      a.user:hover, a.user:focus-visible { border-color: currentColor; }
      a.user.current { font-weight: bold; }
      small { display: block; font-weight: normal; opacity: 0.7; }
    </style>
  </head>
  <body>
    <h1>Sign in to the mock</h1>
    <p>In a deployed app the gateway runs the OIDC flow here. Pick who you want to be:</p>
    ${signable.length ? `<ul>\n      ${items}\n    </ul>` : `<p><strong>There is nobody to sign in as yet.</strong> Add a user to ${escapeHtml(usersFile)}.</p>`}
    ${currentKey ? `<p><a href="${escapeHtml(gatewayPrefix)}logout?return=${encodeURIComponent(returnTo)}">Sign out</a></p>` : ""}
    <p><small>The users live in ${escapeHtml(usersFile)}. Service accounts are not listed: they are
    machines, reached with an api key from ${escapeHtml(apiKeysFile)}.</small></p>
  </body>
</html>
`;
}
