import { describe, expect, it } from "vitest";
import type { MockRequest, MockResponse } from "../src/types.js";
import { CursorPagination } from "../src/helpers/CursorPagination.js";

/** What the FilterCubes chain builds: a paged body that also reports the whole match count. */
interface FilterBody {
  entities?: unknown[];
  next_page_token?: string;
  prev_page_token?: string;
  total_size?: number;
}

// 23 is what the starter's protos document, and what these specs were written against.
const { paginate: paginateEntities, resolveLastPageToken, countTotalSize, lastPageToken: LAST_PAGE_TOKEN } = CursorPagination({ defaultPageSize: 23 });

/** `n` entities, distinguishable so a spec can say which page it got. */
const entities = (n: number): { id: string }[] => Array.from({ length: n }, (_, index) => ({ id: String(index) }));

/**
 * A `res` shaped the way `server.js` hands it to a middleware. Only `body` matters here -
 * pagination never touches the rest.
 */
const responseFor = (body: FilterBody | undefined): MockResponse<FilterBody> => ({
  status: 200,
  contentType: "application/json; charset=utf-8",
  delay: 0,
  headers: [],
  body,
  replace() {
    // pagination edits the body in place, it never replaces the response
  },
  notify: () => undefined,
  inbox: () => undefined,
});

/**
 * A `POST /v1/cubes:filter` request. `body: "cube_filter"` binds only the criteria, so the body is
 * the bare CubeFilter and the paging pair arrives in the query string - see open_models/AIP-9136.md.
 * The specs below pass the sizes as numbers because that is what they assert on; a query param is a
 * string on the wire, which is why the builder converts.
 */
const filterRequest = (paging: { page_size?: number; page_token?: string }): MockRequest => ({
  method: "POST",
  path: "/api/v1/cubes:filter",
  customMethod: "filter",
  params: {},
  query: {
    ...(paging.page_size === undefined ? {} : { page_size: String(paging.page_size) }),
    ...(paging.page_token === undefined ? {} : { page_token: paging.page_token }),
  },
  body: {},
  headers: {},
});

/**
 * An rpc bound with `body: "*"`, where every field not in the path travels in the body and there is
 * no query string at all. No paged rpc has that shape today - `MarkNotificationsRead` is the only
 * `body: "*"` method and it does not page - but `pageSizeOf` / `pageTokenOf` still serve it.
 */
const bodyRequest = (paging: { page_size?: number; page_token?: string }): MockRequest => ({
  method: "POST",
  path: "/api/v1/things:doSomething",
  customMethod: "doSomething",
  params: {},
  query: {},
  body: { ...paging },
  headers: {},
});

/** A `GET /v1/cubes:suggest` request, where the same fields arrive as query params instead. */
const queryRequest = (paging: { page_size?: string; page_token?: string }): MockRequest => ({
  method: "GET",
  path: "/api/v1/cubes:suggest",
  customMethod: "suggest",
  params: {},
  query: { ...paging },
  body: undefined,
  headers: {},
});

/** The full FilterCubes chain, minus the filter step: count, resolve the sentinel, then slice. */
const serveFilter = (count: number, req: MockRequest): FilterBody => {
  const res = responseFor({ entities: entities(count) });
  countTotalSize(res, req);
  resolveLastPageToken(res, req);
  paginateEntities(res, req);
  return res.body ?? {};
};

/** The first id on the page, so a spec can name the page it landed on. */
const firstId = (body: FilterBody): string | undefined => (body.entities?.[0] as { id: string } | undefined)?.id;

describe("CursorPagination", () => {
  describe("paginateEntities", () => {
    it("slices by page_size and offers a next token while entities remain", () => {
      const body = serveFilter(37, filterRequest({ page_size: 10 }));

      expect(body.entities).toHaveLength(10);
      expect(firstId(body)).toBe("0");
      expect(body.next_page_token).toBe("10");
      expect(body.prev_page_token).toBe("");
    });

    it("pages by 23 when the request names no size, the way the proto documents", () => {
      const body = serveFilter(37, filterRequest({}));

      expect(body.entities).toHaveLength(23);
      expect(body.next_page_token).toBe("23");
    });

    it('falls back to the body when the rpc binds `body: "*"` and has no query string', () => {
      const res = responseFor({ entities: entities(37) });
      paginateEntities(res, bodyRequest({ page_size: 10, page_token: "10" }));

      expect(res.body?.entities).toHaveLength(10);
      expect(firstId(res.body ?? {})).toBe("10");
    });

    it("reads the fields off the query string when the rpc has one", () => {
      const res = responseFor({ entities: entities(37) });
      paginateEntities(res, queryRequest({ page_size: "10", page_token: "10" }));

      expect(res.body?.entities).toHaveLength(10);
      expect(firstId(res.body ?? {})).toBe("10");
      expect(res.body?.prev_page_token).toBe("0");
    });

    it("offers no next token on the final page", () => {
      const body = serveFilter(37, filterRequest({ page_size: 10, page_token: "30" }));

      expect(body.entities).toHaveLength(7);
      expect(body.next_page_token).toBe("");
      expect(body.prev_page_token).toBe("20");
    });
  });

  describe("resolveLastPageToken", () => {
    it("lands on the final page, which is a partial one here", () => {
      const body = serveFilter(37, filterRequest({ page_size: 10, page_token: LAST_PAGE_TOKEN }));

      expect(firstId(body)).toBe("30");
      expect(body.entities).toHaveLength(7);
      expect(body.next_page_token).toBe("");
      expect(body.prev_page_token).toBe("20");
    });

    it("lands on the last full page when the count divides exactly, not on the empty one after it", () => {
      const body = serveFilter(20, filterRequest({ page_size: 10, page_token: LAST_PAGE_TOKEN }));

      expect(firstId(body)).toBe("10");
      expect(body.entities).toHaveLength(10);
      expect(body.next_page_token).toBe("");
    });

    it("stays on the first page when everything fits on one", () => {
      const body = serveFilter(7, filterRequest({ page_size: 10, page_token: LAST_PAGE_TOKEN }));

      expect(firstId(body)).toBe("0");
      expect(body.prev_page_token).toBe("");
    });

    it("survives a match set of nothing", () => {
      const body = serveFilter(0, filterRequest({ page_size: 10, page_token: LAST_PAGE_TOKEN }));

      expect(body.entities).toHaveLength(0);
      expect(body.next_page_token).toBe("");
      expect(body.prev_page_token).toBe("");
    });

    it("counts the whole match set, not the page - it runs before the slice", () => {
      // the guard on middleware order: resolving after paginateEntities would see one page and think
      // that was everything
      const body = serveFilter(37, filterRequest({ page_size: 10, page_token: LAST_PAGE_TOKEN }));

      expect(body.total_size).toBe(37);
      expect(firstId(body)).toBe("30");
    });

    it("resolves the sentinel on the query string too", () => {
      const res = responseFor({ entities: entities(37) });
      const req = queryRequest({ page_size: "10", page_token: LAST_PAGE_TOKEN });
      resolveLastPageToken(res, req);
      paginateEntities(res, req);

      expect(firstId(res.body ?? {})).toBe("30");
    });

    it("leaves an ordinary token alone", () => {
      const body = serveFilter(37, filterRequest({ page_size: 10, page_token: "10" }));

      expect(firstId(body)).toBe("10");
    });

    it("pages from the start when an rpc serves the sentinel without resolving it", () => {
      // SuggestCubes does not document the token, so its fixture does not carry the resolver - the
      // sentinel is simply not a number there
      const res = responseFor({ entities: entities(37) });
      paginateEntities(res, queryRequest({ page_size: "10", page_token: LAST_PAGE_TOKEN }));

      expect(firstId(res.body ?? {})).toBe("0");
    });
  });

  describe("options", () => {
    interface Listing {
      results?: unknown[];
      next?: string;
      count?: number;
    }

    const listingResponse = (n: number): MockResponse<Listing> => ({ ...responseFor(undefined), body: { results: entities(n) } });

    it("pages through the field it is told to, and writes the token and the total where it is told to", () => {
      const { paginate, countTotalSize: count } = CursorPagination({
        itemsField: "results",
        nextTokenField: "next",
        prevTokenField: false,
        totalField: "count",
      });
      const res = listingResponse(30);
      const req = queryRequest({ page_size: "10" });
      count(res, req);
      paginate(res, req);

      expect(res.body?.results).toHaveLength(10);
      expect(res.body?.next).toBe("10");
      expect(res.body?.count).toBe(30);
      expect(res.body).not.toHaveProperty("prev_page_token");
    });

    it("reads renamed request fields", () => {
      const { paginate } = CursorPagination({ itemsField: "results", pageSizeParam: "limit", pageTokenParam: "cursor" });
      const res = listingResponse(30);
      paginate(res, { ...queryRequest({}), query: { limit: "5", cursor: "5" } });

      expect(res.body?.results).toHaveLength(5);
      expect((res.body?.results?.[0] as { id: string }).id).toBe("5");
    });

    it("defaults to 20 and cuts a page size down to maxPageSize", () => {
      const unlimited = CursorPagination();
      const res = responseFor({ entities: entities(70) });
      unlimited.paginate(res, queryRequest({}));
      expect(res.body?.entities).toHaveLength(20);

      const capped = CursorPagination({ maxPageSize: 50 });
      const big = responseFor({ entities: entities(70) });
      capped.paginate(big, queryRequest({ page_size: "1000" }));
      expect(big.body?.entities).toHaveLength(50);
    });

    it("treats a negative or broken page size as none", () => {
      const { paginate } = CursorPagination({ defaultPageSize: 7 });
      const res = responseFor({ entities: entities(30) });
      paginate(res, queryRequest({ page_size: "-3" }));

      expect(res.body?.entities).toHaveLength(7);
    });

    it("leaves a body without the items alone", () => {
      const { paginate } = CursorPagination();
      const res = responseFor({});
      paginate(res, queryRequest({ page_size: "10" }));

      expect(res.body).toEqual({});
    });
  });
});
