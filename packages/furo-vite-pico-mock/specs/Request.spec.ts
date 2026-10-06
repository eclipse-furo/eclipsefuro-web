import { describe, expect, it } from "vitest";
import { Readable } from "node:stream";
import { parseQuery, readJsonBody } from "../src/Request.js";

/**
 * `readJsonBody` only reaches for the content type, the request stream and `ctx.throw`, so a stub
 * stands in for the koa context - which is just as well, since koa 3 ships no type declarations.
 */
const ctxWith = (contentType: string | undefined, ...chunks: string[]) => ({
  request: { headers: contentType === undefined ? {} : { "content-type": contentType } },
  req: Readable.from(chunks.map((c) => Buffer.from(c))),
  throw: (status: number, message: string): never => {
    throw Object.assign(new Error(message), { statusCode: status });
  },
});

describe("readJsonBody", () => {
  it("parses a json body", async () => {
    await expect(readJsonBody(ctxWith("application/json", '{"a":1}'))).resolves.toEqual({ a: 1 });
  });

  it("accepts a content type with parameters", async () => {
    const body = ctxWith("application/json; charset=utf-8", '{"a":1}');
    await expect(readJsonBody(body)).resolves.toEqual({ a: 1 });
  });

  it("joins the chunks before parsing", async () => {
    // The body arrives in pieces on a real socket, and a chunk boundary lands mid-token here.
    const body = ctxWith("application/json", '{"display_na', 'me":"Cube"}');
    await expect(readJsonBody(body)).resolves.toEqual({ display_name: "Cube" });
  });

  it.each([
    ["no content type", undefined],
    ["a non-json content type", "text/plain"],
  ])("returns undefined for %s", async (_label, contentType) => {
    await expect(readJsonBody(ctxWith(contentType, '{"a":1}'))).resolves.toBeUndefined();
  });

  it.each([
    ["an empty body", ""],
    ["a whitespace body", "  \n "],
  ])("returns undefined for %s", async (_label, raw) => {
    await expect(readJsonBody(ctxWith("application/json", raw))).resolves.toBeUndefined();
  });

  it("throws a 400 for malformed json", async () => {
    await expect(readJsonBody(ctxWith("application/json", "{oops"))).rejects.toMatchObject({
      statusCode: 400,
      message: expect.stringContaining("not valid json"),
    });
  });
});

describe("parseQuery", () => {
  it("returns an empty object for an empty query string", () => {
    expect(parseQuery("")).toEqual({});
  });

  it("keeps a key that occurs once as a string", () => {
    expect(parseQuery("query=cube&page_size=23")).toEqual({ query: "cube", page_size: "23" });
  });

  it.each([
    ["order_by=a&order_by=b", ["a", "b"]],
    ["order_by=a&order_by=b&order_by=c", ["a", "b", "c"]],
  ])("collapses a repeated key into an array (%s)", (querystring, expected) => {
    expect(parseQuery(querystring)).toEqual({ order_by: expected });
  });

  it("percent decodes values", () => {
    expect(parseQuery("query=hello%20world")).toEqual({ query: "hello world" });
  });

  it("keeps an empty value", () => {
    expect(parseQuery("query=&page_size=23")).toEqual({ query: "", page_size: "23" });
  });

  it("leaves a comma separated value alone", () => {
    // Splitting a repeated field mask is `middleware/query.ts`'s job, not the parser's.
    expect(parseQuery("update_mask=cube.height,description")).toEqual({
      update_mask: "cube.height,description",
    });
  });
});
