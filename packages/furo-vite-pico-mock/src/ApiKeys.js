/**
 * pico-mock's api keys - the machine half of the gateway it stands in for.
 *
 * An api key is a **credential, not a principal**. It names a user in the users file and
 * acts as them, so it resolves to the very same `MockSession` shape a cookie session does and a
 * fixture reading `req.user.claims.features` cannot tell the difference - beyond `req.user.via` and
 * `req.user.kind`, which are there for the fixture that wants to insist.
 *
 * Two rules carry the design:
 *
 * - **A key may only narrow.** `roles` and `features` are *intersected* with what the user holds.
 *   There is deliberately no way to write a key that grants something its user does not have.
 * - **It is sessionless.** Nothing is stored: a key resolves per request, sets no cookie and gets
 *   no redirect. There is nothing to log out of, and a curl loop cannot grow a session store.
 */

import { DEFAULT_AUTH_OPTIONS, mintJwt } from "./Auth.js";

/** @typedef {import('./types.js').MockApiKey} MockApiKey */
/** @typedef {import('./types.js').MockUser} MockUser */
/** @typedef {import('./types.js').MockSession} MockSession */
/** @typedef {import('./types.js').MockAuthOptions} MockAuthOptions */

/**
 * `Bearer <token>`, the scheme case insensitively. The token may not contain whitespace, so a
 * pasted `Bearer api key` is a malformed header rather than a key that is merely unknown.
 *
 * @type {RegExp}
 */
const BEARER = /^Bearer[ \t]+(\S+)[ \t]*$/i;

/**
 * A refusal, in the three arguments `answerStatus` in server.js takes.
 *
 * Every one of them is a 401: the request carried a credential and it did not work. None of them
 * may mention the login page - whatever sent an `authorization` header is not a browser and cannot
 * follow a login page.
 *
 * @typedef {{ status: number, error: string, message: string }} ApiKeyError
 */

/**
 * @param {string} message
 * @return {{ error: ApiKeyError }}
 */
const refuse = (message) => ({ error: { status: 401, error: "unauthenticated", message: `[pico-mock] ${message}` } });

/**
 * Warnings already printed, so a misconfigured key does not log on every request. Module level on
 * purpose: `createApiKeys` is called per request, since `apiKeys.ts` is re-imported per request.
 *
 * @type {Set<string>}
 */
const warned = new Set();

/**
 * @param {string} key
 * @param {string} message
 */
function warnOnce(key, message) {
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(`[pico-mock] ${message}`);
}

/**
 * Intersect what the user holds with what the key allows. `undefined` means the key does not
 * narrow this axis at all, which is not the same as `[]` - an empty array narrows to nothing.
 *
 * @param {string[]} held
 * @param {string[] | undefined} allowed
 * @return {string[]}
 */
const narrow = (held, allowed) => (allowed === undefined ? held : held.filter((value) => allowed.includes(value)));

/**
 * Hide the token in a log line. A `label` is nicer, this is the fallback.
 *
 * @param {string} token
 * @return {string}
 */
const redact = (token) => `…${token.slice(-4)}`;

/**
 * The api keys of the running server.
 *
 * A factory rather than a module singleton, so a spec passes its own arrays the way `Auth.spec.ts`
 * passes its own `Map` into `createSessions`. The server builds one per request, because
 * `auth/apiKeys.ts` and `auth/users.ts` are re-imported per request and an edit to either has to
 * show up on the next one.
 *
 * @param {MockApiKey[]} keys
 * @param {MockUser[]} users
 * @param {MockAuthOptions} [options]
 * @param {{ usersFile?: string, apiKeysFile?: string }} [files] - How the refusals name the two
 *   files, relative to the project.
 */
export function createApiKeys(keys, users, options = DEFAULT_AUTH_OPTIONS, { usersFile = "mock/auth/users.ts", apiKeysFile = "mock/auth/apiKeys.ts" } = {}) {
  /**
   * The principal an `Authorization` header proves, or why it proves nothing.
   *
   * A header that is present and unusable is an error, never a silent `undefined`: the caller must
   * not fall back to the session cookie behind it, because that turns a typo in a key into a
   * request that quietly succeeds as somebody else.
   *
   * @param {string | undefined} header - The raw `Authorization` header.
   * @param {number} [now] - Epoch milliseconds.
   * @return {{ principal?: MockSession, error?: ApiKeyError }}
   */
  function resolve(header, now = Date.now()) {
    if (!header || header.trim() === "") return {};

    const match = BEARER.exec(header.trim());
    if (!match) {
      return refuse(`the authorization header has to be \`Bearer <api key>\`; the keys live in ${apiKeysFile}`);
    }
    const token = /** @type {string} */ (match[1]);

    const key = keys.find((candidate) => candidate.token === token);
    // A revoked key answers exactly what an unknown one answers. Telling the two apart would be a
    // way to find out that a token used to be real.
    if (!key || key.disabled) {
      return refuse(`unknown or revoked api key ${redact(token)}; the keys live in ${apiKeysFile}`);
    }

    const label = key.label ?? redact(token);

    if (key.expiresAt !== undefined) {
      const expiry = new Date(key.expiresAt).getTime();
      if (Number.isNaN(expiry)) {
        warnOnce(`${token}:expiresAt`, `api key "${label}" has an unparseable expiresAt ${JSON.stringify(key.expiresAt)}, expected RFC 3339`);
        return refuse(`api key "${label}" has an invalid expiresAt, see ${apiKeysFile}`);
      }
      if (expiry <= now) {
        return refuse(`api key "${label}" expired on ${new Date(expiry).toISOString()}`);
      }
    }

    const user = users.find((candidate) => candidate.key === key.user);
    if (!user) {
      warnOnce(`${token}:user`, `api key "${label}" names the user "${key.user}", which is not in ${usersFile}`);
      return refuse(`api key "${label}" is not configured: there is no user "${key.user}" in ${usersFile}`);
    }
    if (user.disabled) {
      return refuse(`the user "${user.key}" behind api key "${label}" is disabled`);
    }

    const held = user.claims;
    // `user.sessionTtlSeconds` is deliberately not honoured: it exists so a *browser* session runs
    // out quickly, and a key acting as `bob` should not inherit his 60 s. The key's own `expiresAt`
    // is the only thing that shortens it.
    const expiresAt = Math.min(key.expiresAt === undefined ? Infinity : new Date(key.expiresAt).getTime(), now + options.sessionTtlSeconds * 1000);

    const roles = narrow(held.roles ?? [], key.roles);
    const features = narrow(held.features ?? [], key.features);
    for (const [axis, allowed, kept] of /** @type {[string, string[] | undefined, string[]][]} */ ([
      ["roles", key.roles, roles],
      ["features", key.features, features],
    ])) {
      // Narrowing to something the user does not hold is not an error - the intersection drops it -
      // but it is almost always a typo, and a silent one.
      const dropped = (allowed ?? []).filter((value) => !kept.includes(value));
      if (dropped.length > 0) {
        warnOnce(
          `${token}:${axis}:${dropped.join(",")}`,
          `api key "${label}" narrows to ${axis} ${dropped.join(", ")}, which "${user.key}" does not hold - a key can only narrow, never grant`
        );
      }
    }

    /** @type {MockSession} */
    const principal = {
      key: user.key,
      claims: { ...held, roles, features },
      token: "",
      expiresAt,
      via: "api-key",
      kind: user.kind ?? "human",
      apiKey: label,
    };
    // Minted from the *narrowed* claims: that is the whole point of a downscoped key, the bearer a
    // BFF forwards to the backend carries only what the key allows.
    principal.token = mintJwt(principal.claims, Math.floor(now / 1000), Math.floor(expiresAt / 1000));

    return { principal };
  }

  return { resolve };
}
