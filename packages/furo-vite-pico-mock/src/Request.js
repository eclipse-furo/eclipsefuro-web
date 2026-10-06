/**
 * pico-mock's request reading - the body and the query string, as a fixture's middleware sees them.
 */

/**
 * The part of the koa context `readJsonBody` touches. Described structurally rather than as
 * `import('koa').Context`, because koa 3 ships no type declarations - and this way a spec can hand
 * it a stub without a cast.
 *
 * @typedef {object} BodyContext
 * @property {{ headers: Record<string, string | string[] | undefined> }} request
 * @property {AsyncIterable<Buffer>} req - The raw request stream.
 * @property {(status: number, message: string) => never} throw
 */

/**
 * Read the whole request body off the socket. Koa ships no body parser and the fixtures only ever
 * need json, so parsing it here saves a dependency.
 *
 * @param {BodyContext} ctx
 * @return {Promise<unknown>} The parsed body, or undefined when there is none.
 */
export async function readJsonBody(ctx) {
  const contentType = ctx.request.headers["content-type"];
  if (typeof contentType !== "string" || !contentType.startsWith("application/json")) {
    return undefined;
  }

  /** @type {Buffer[]} */
  const chunks = [];
  for await (const chunk of ctx.req) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (raw === "") {
    return undefined;
  }

  try {
    return JSON.parse(raw);
  } catch (err) {
    return ctx.throw(400, `[pico-mock] request body is not valid json: ${err.message}`);
  }
}

/**
 * Collapse the query string: a key that occurs once is a string, a repeated one an array.
 *
 * @param {string} querystring
 * @return {Record<string, string | string[]>}
 */
export function parseQuery(querystring) {
  /** @type {Record<string, string | string[]>} */
  const query = {};
  for (const [key, value] of new URLSearchParams(querystring)) {
    const seen = query[key];
    if (seen === undefined) {
      query[key] = value;
    } else if (Array.isArray(seen)) {
      seen.push(value);
    } else {
      query[key] = [seen, value];
    }
  }
  return query;
}
