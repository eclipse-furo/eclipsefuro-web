import { afterEach, describe, expect, it, vi } from "vitest";
import type { MockHeader, MockRequest, MockResponse } from "../src/types.js";
import { withEtag } from "../src/helpers/etag.js";

/** The body every case in here serves, unless a test wants a different one. */
const CUBE = { entity: { display_name: "Cube 1x2x3", description: "a cube" } };

/**
 * A `res` shaped the way `server.js` hands it to a middleware: the defaults already filled
 * in, and a `replace` that behaves exactly like the server's - everything left out keeps its value,
 * except the body, which is cleared.
 */
const responseFor = <T>(body: T | undefined, delay = 0): MockResponse<T> => ({
  status: 200,
  contentType: "application/json; charset=utf-8",
  delay,
  headers: [],
  body,
  replace(next) {
    this.status = next.status;
    this.body = next.body as T | undefined;
    if (next.contentType !== undefined) this.contentType = next.contentType;
    if (next.headers !== undefined) this.headers = next.headers;
    if (next.delay !== undefined) this.delay = next.delay;
  },
  notify: () => undefined,
  inbox: () => undefined,
});

/** A `req` for `GET /api/v1/cubes/1`, optionally carrying an `If-None-Match`. */
const requestWith = (ifNoneMatch?: string): MockRequest => ({
  method: "GET",
  path: "/api/v1/cubes/1",
  params: { cube_id: "1" },
  query: {},
  body: undefined,
  headers: ifNoneMatch === undefined ? {} : { "if-none-match": ifNoneMatch },
});

/** The value of the single `ETag` entry the middleware pushes. */
const etagOf = (headers: MockHeader[]): string | undefined => headers.map((h) => h.ETag).find((value) => value !== undefined);

/** Run the middleware over a fresh response and hand back both, so a test can assert on either. */
const run = <T>(body: T | undefined, ifNoneMatch?: string, delay = 0) => {
  const res = responseFor(body, delay);
  void withEtag<T>()(res, requestWith(ifNoneMatch));
  return { res, tag: etagOf(res.headers) };
};

describe("withEtag", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("adds exactly one weak ETag and leaves the response alone", () => {
    const { res, tag } = run(CUBE);

    expect(res.headers).toHaveLength(1);
    expect(tag).toMatch(/^W\/"[\w-]+"$/);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(CUBE);
  });

  it("hashes the same body to the same tag", () => {
    expect(run(CUBE).tag).toBe(run({ ...CUBE }).tag);
  });

  it("hashes a changed body to a different tag", () => {
    // What a PATCH through the shared CUBES store looks like from here.
    const patched = { entity: { ...CUBE.entity, description: "edited" } };

    expect(run(patched).tag).not.toBe(run(CUBE).tag);
  });

  describe("when If-None-Match names the current entity", () => {
    it("answers 304 with no body", () => {
      const { tag } = run(CUBE);
      const { res } = run(CUBE, tag);

      expect(res.status).toBe(304);
      expect(res.body).toBeUndefined();
    });

    it("keeps the ETag, so the client learns the tag is still current", () => {
      const { tag } = run(CUBE);
      const { res } = run(CUBE, tag);

      expect(etagOf(res.headers)).toBe(tag);
    });

    it("drops the delay the case declared", () => {
      const { tag } = run(CUBE);
      const { res } = run(CUBE, tag, 2000);

      expect(res.delay).toBe(0);
    });

    it.each([
      ["a weak tag as sent", (tag: string) => tag],
      ["the strong form, because the comparison is weak", (tag: string) => tag.replace("W/", "")],
      ["a wildcard", () => "*"],
      ["a list containing it", (tag: string) => `W/"other", ${tag}`],
      ["a list with untrimmed whitespace", (tag: string) => `  W/"other" ,   ${tag}  `],
    ])("recognises %s", (_label, asHeader) => {
      const { tag = "" } = run(CUBE);
      const { res } = run(CUBE, asHeader(tag));

      expect(res.status).toBe(304);
    });
  });

  describe("when If-None-Match does not name it", () => {
    it.each([
      ["a stale tag", 'W/"stale"'],
      ["a list without it", 'W/"stale", W/"older"'],
      ["an empty header", ""],
    ])("serves the body for %s", (_label, header) => {
      const { res, tag } = run(CUBE, header);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(CUBE);
      expect(tag).toMatch(/^W\/"/);
    });

    it("keeps a declared delay", () => {
      expect(run(CUBE, 'W/"stale"', 2000).res.delay).toBe(2000);
    });
  });

  it("warns and changes nothing when there is no body to hash", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const res = responseFor(undefined, 2000);

    void withEtag()(res, requestWith());

    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0]?.[0]).toContain("last in the array");
    expect(res.headers).toEqual([]);
    expect(res.status).toBe(200);
    expect(res.delay).toBe(2000);
  });
});
