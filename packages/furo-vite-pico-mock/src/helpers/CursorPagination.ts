import type { MockRequest, MockResponse } from "../types.js";
import { first } from "./query.js";

/**
 * How a token paged api names its fields. The defaults are the AIP-158 names, `page_size`,
 * `page_token` and `next_page_token`, with the items in `entities`.
 */
export interface CursorPaginationOptions {
  /**
   * The array to page through, a member of the response body. Defaults to `entities`.
   */
  itemsField?: string;
  /**
   * Where the token of the next page goes. Defaults to `next_page_token`.
   */
  nextTokenField?: string;
  /**
   * Where the token of the previous page goes, `false` for an api that has none. Defaults to
   * `prev_page_token`.
   */
  prevTokenField?: string | false;
  /**
   * Where `countTotalSize` writes the size of the whole match set. Defaults to `total_size`.
   */
  totalField?: string;
  /**
   * The query param, or body field, carrying the page size. Defaults to `page_size`.
   */
  pageSizeParam?: string;
  /**
   * The query param, or body field, carrying the page token. Defaults to `page_token`.
   */
  pageTokenParam?: string;
  /**
   * The page size when the request names none, or one that is not a positive number. Defaults to 20.
   */
  defaultPageSize?: number;
  /**
   * The largest page size honoured, a bigger one is cut down to it. Unlimited by default.
   */
  maxPageSize?: number;
  /**
   * The symbolic token that means "the last page", see `resolveLastPageToken`. Defaults to
   * `::last-page`.
   */
  lastPageToken?: string;
}

/** A response body, as far as paging is concerned: an object with the items somewhere in it. */
type Paged = Record<string, unknown>;

/**
 * A middleware for any response type. Generic, because the field names are options: which member
 * holds the items is not something the type of the body can tell.
 */
export type PagingMiddleware = <T>(res: MockResponse<T>, req: MockRequest) => void;

/**
 * Token based paging for a list response, as three middlewares that are opted into separately -
 * a fixture should never answer with more than its api declares.
 *
 * The token is simply the offset into the list, which is all a fixture needs to exercise a paging
 * UI. A client must treat it as opaque anyway.
 *
 * ```ts
 * const { paginate, countTotalSize } = CursorPagination({ defaultPageSize: 23 });
 * // middleware: [filterCubes, countTotalSize, paginate]
 * ```
 *
 * The paging fields are read from the query string first and from the request body second, so the
 * same middleware serves a `GET` and a `body: "*"` rpc whose fields all travel in the body.
 */
export function CursorPagination(options: CursorPaginationOptions = {}) {
  const {
    itemsField = "entities",
    nextTokenField = "next_page_token",
    prevTokenField = "prev_page_token",
    totalField = "total_size",
    pageSizeParam = "page_size",
    pageTokenParam = "page_token",
    defaultPageSize = 20,
    maxPageSize = Infinity,
    lastPageToken = "::last-page",
  } = options;

  const bodyOf = (req: MockRequest): Record<string, unknown> => (req.body ?? {}) as Record<string, unknown>;

  const pageSizeOf = (req: MockRequest): number => {
    const size = Number(first(req.query[pageSizeParam])) || Number(bodyOf(req)[pageSizeParam]);
    return Math.min(size > 0 ? Math.floor(size) : defaultPageSize, maxPageSize);
  };

  const pageTokenOf = (req: MockRequest): string => {
    const fromBody = bodyOf(req)[pageTokenParam];
    return first(req.query[pageTokenParam]) || (typeof fromBody === "string" ? fromBody : "");
  };

  const itemsOf = (body: Paged | undefined): unknown[] | undefined => {
    const items = body?.[itemsField];
    return Array.isArray(items) ? items : undefined;
  };

  /**
   * Applies the page size and the page token and fills both page tokens.
   *
   * A token that is not a number pages from the start - so an rpc whose api documents a symbolic
   * token has to resolve it first, see `resolveLastPageToken`.
   */
  const paginate: PagingMiddleware = (res, req) => {
    const body = res.body as Paged | undefined;
    const all = itemsOf(body);
    if (!body || !all) return;
    const size = pageSizeOf(req);
    const offset = Math.max(0, Math.floor(Number(pageTokenOf(req)) || 0));
    body[itemsField] = all.slice(offset, offset + size);
    body[nextTokenField] = offset + size < all.length ? String(offset + size) : "";
    if (prevTokenField) {
      body[prevTokenField] = offset > 0 ? String(Math.max(0, offset - size)) : "";
    }
  };

  /**
   * Turns the `lastPageToken` into the offset of the final page, for an rpc whose api documents
   * one. It is a sentinel rather than a number because the offset of the last page depends on the
   * page size and on how many items matched - neither of which the client knows.
   *
   * It rewrites the request rather than the response, so `paginate` stays the only thing that slices
   * and needs to know nothing about symbolic tokens. That puts it in the chain **after** whatever
   * narrows the list - the last page of a filtered set is not the last page of all of them - and
   * **before** `paginate`, which is about to replace the items with a single page.
   *
   * Without it the sentinel is simply not a number and the rpc answers with the first page.
   */
  const resolveLastPageToken: PagingMiddleware = (res, req) => {
    const all = itemsOf(res.body as Paged | undefined);
    if (!all) return;
    if (pageTokenOf(req) !== lastPageToken) return;

    const count = all.length;
    const size = pageSizeOf(req);
    // the first item of the final page: the last whole multiple of `size` below the count. `count - 1`
    // so that an exact fit lands on the page that is full rather than on the empty one after it - 20
    // items by 10 ends at offset 10, not 20. A match set of none has no last page and stays at 0.
    const offset = count === 0 ? 0 : Math.floor((count - 1) / size) * size;

    // written back where it was read from, so the precedence above keeps holding
    if (first(req.query[pageTokenParam]) === lastPageToken) {
      req.query[pageTokenParam] = String(offset);
      return;
    }
    if (req.body && typeof req.body === "object") {
      (req.body as Record<string, unknown>)[pageTokenParam] = String(offset);
    }
  };

  /**
   * Records how many items matched the request, for a response whose api declares a total.
   *
   * It has to run **after** whatever narrows the list and **before** `paginate`: the count is of the
   * whole match set, and paging replaces the items with a slice of it, so a count taken afterwards
   * would only report the page size.
   */
  const countTotalSize: PagingMiddleware = (res) => {
    // an empty array is truthy, so a filter that matched nothing still reports a total of 0
    const body = res.body as Paged | undefined;
    const all = itemsOf(body);
    if (!body || !all) return;
    body[totalField] = all.length;
  };

  return { paginate, resolveLastPageToken, countTotalSize, lastPageToken };
}
