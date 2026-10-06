import { createHash } from "node:crypto";
import type { MockMiddleware } from "../types.js";

/**
 * Strip the weak validator prefix, so `W/"abc"` and `"abc"` compare equal.
 *
 * `If-None-Match` on a GET uses the *weak* comparison function (RFC 9110 §8.8.3.2), which ignores
 * whether either side is marked weak. A client that echoes the tag back without the `W/` still means
 * the same entity.
 */
const weaken = (tag: string): string => (tag.startsWith("W/") ? tag.slice(2) : tag);

/**
 * Whether an `If-None-Match` header names this entity.
 *
 * The header is either `*` or a comma separated list of entity tags, so a client holding several
 * cached representations can offer all of them in one request.
 */
const isNoneMatch = (header: string, tag: string): boolean => {
  const current = weaken(tag);
  return header
    .split(",")
    .map((candidate) => candidate.trim())
    .some((candidate) => candidate === "*" || weaken(candidate) === current);
};

/**
 * Answers conditional requests for the case it is added to.
 *
 * Opt in per case by appending it to the case's `middleware`, and put it **last** - it hashes the
 * finished body, so anything that still has to shape the body has to have run already:
 *
 * ```ts
 * middleware: [pickCubeById, withEtag()],
 * ```
 *
 * Every response then carries an `ETag`, and a request whose `If-None-Match` names it is answered
 * `304 Not Modified` with no body and **no delay** - a revalidation that the client is about to
 * satisfy from its own cache should not be slowed down by a fixture pretending to be a slow
 * endpoint.
 *
 * The tag is derived from the body rather than stored anywhere, which is what makes it work across
 * fixture files: `{cube_id}/PATCH.ts` writes the shared `CUBES` store, so the next `GET` serves a
 * different body and hashes to a different tag without either file knowing about the other.
 *
 * It pairs with `Cache-Control: max-age=…` rather than replacing it. The `max-age` is the window in
 * which the browser answers from its cache without asking at all; the `ETag` is what makes the
 * request *after* that window cheap. Note that the app never sees the 304: the browser resolves it
 * against its cache and hands javascript the stored response as a 200.
 */
export const withEtag =
  <T>(): MockMiddleware<T> =>
  (res, req) => {
    if (res.body === undefined) {
      console.warn("[pico-mock] withEtag() found no body to hash - it has to run after the middleware that builds the body, i.e. last in the array");
      return;
    }

    // Weak, because the hash is taken over the serialized body: two payloads that differ only in key
    // order are the same entity to everyone but this function, and claiming a strong validator would
    // be a promise it cannot keep.
    const tag = `W/"${createHash("sha1").update(JSON.stringify(res.body)).digest("base64url")}"`;

    // Set before the 304 below, and deliberately only once: `replace` leaves `headers` alone when the
    // field is omitted, so this survives into the 304 - which needs it, because that is how the
    // client learns the tag is still current.
    res.headers.push({ ETag: tag });

    const ifNoneMatch = req.headers["if-none-match"];
    if (ifNoneMatch && isNoneMatch(ifNoneMatch, tag)) {
      res.replace({ status: 304, delay: 0 });
    }
  };
