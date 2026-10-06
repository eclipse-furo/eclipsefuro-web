import type { MockRequest, MockResponse } from "../types.js";
import { first } from "./query.js";

/**
 * How a page numbered api names its fields. A request asks for `?page=2&page_size=10`, or for
 * `?offset=10&page_size=10`; the response says which page it is and how many there are.
 */
export interface PaginationOptions {
  /**
   * The array to page through, a member of the response body. `false` when the body *is* the array:
   * the paging facts then go into headers, `X-Total-Count` and, with `link`, `Link`. Defaults to
   * `items`.
   */
  itemsField?: string | false;
  /**
   * The query param, or body field, carrying the 1-based page number. Defaults to `page`.
   */
  pageParam?: string;
  /**
   * The query param, or body field, carrying the page size. Defaults to `page_size`; a `limit`
   * param would be `pageSizeParam: "limit"`.
   */
  pageSizeParam?: string;
  /**
   * The query param, or body field, carrying a 0-based offset. It wins over the page number when
   * both are present, `false` ignores it. Defaults to `offset`.
   */
  offsetParam?: string | false;
  /**
   * The page size when the request names none, or one that is not a positive number. Defaults to 20.
   */
  defaultPageSize?: number;
  /**
   * The largest page size honoured, a bigger one is cut down to it. Defaults to 100.
   */
  maxPageSize?: number;
  /**
   * The names of the facts written next to the items, `false` leaves one out. Default to `page`,
   * `page_size`, `total_size` and `total_pages`.
   */
  fields?: {
    page?: string | false;
    pageSize?: string | false;
    totalSize?: string | false;
    totalPages?: string | false;
  };
  /**
   * The header carrying the total when the body is a bare array. Defaults to `X-Total-Count`,
   * `false` sends none.
   */
  totalHeader?: string | false;
  /**
   * Add an RFC 8288 `Link` header with `first`, `prev`, `next` and `last`. Off by default.
   */
  link?: boolean;
}

/** A middleware for any response type, see `PagingMiddleware` in CursorPagination.ts. */
export type PageMiddleware = <T>(res: MockResponse<T>, req: MockRequest) => void;

/**
 * Page number (or offset) based paging for a list response, the kind a REST api without tokens
 * has:
 *
 * ```ts
 * const { paginate } = Pagination({ itemsField: "users", pageSizeParam: "limit" });
 * // GET /api/users?page=2&limit=10 -> { users: [10 of them], page: 2, page_size: 10, total_size: 42, total_pages: 5 }
 * ```
 *
 * A page past the end answers with no items rather than an error - the totals still say how far
 * the list goes. The paging fields are read from the query string first and from the request body
 * second.
 */
export function Pagination(options: PaginationOptions = {}) {
  const {
    itemsField = "items",
    pageParam = "page",
    pageSizeParam = "page_size",
    offsetParam = "offset",
    defaultPageSize = 20,
    maxPageSize = 100,
    totalHeader = "X-Total-Count",
    link = false,
  } = options;
  const fields = { page: "page", pageSize: "page_size", totalSize: "total_size", totalPages: "total_pages", ...options.fields };

  /** A positive integer from the query, or from the body, or undefined. */
  const numberOf = (req: MockRequest, name: string): number | undefined => {
    const raw = first(req.query[name]) || (req.body && typeof req.body === "object" ? (req.body as Record<string, unknown>)[name] : undefined);
    const value = Math.floor(Number(raw));
    return raw === undefined || raw === "" || Number.isNaN(value) ? undefined : value;
  };

  /** The url of another page of the same request, for the `Link` header. */
  const pageUrl = (req: MockRequest, page: number, size: number): string => {
    const params = new URLSearchParams();
    Object.entries(req.query).forEach(([key, value]) => {
      if (key === pageParam || key === pageSizeParam || key === offsetParam) return;
      (Array.isArray(value) ? value : [value]).forEach((v) => {
        params.append(key, v);
      });
    });
    params.set(pageParam, String(page));
    params.set(pageSizeParam, String(size));
    return `${req.path}?${params.toString()}`;
  };

  const paginate: PageMiddleware = (res, req) => {
    const envelope = itemsField === false ? undefined : (res.body as Record<string, unknown> | undefined);
    const all: unknown = itemsField === false ? res.body : envelope?.[itemsField];
    if (!Array.isArray(all)) return;

    const asked = numberOf(req, pageSizeParam);
    const size = Math.min(asked !== undefined && asked > 0 ? asked : defaultPageSize, maxPageSize);
    const offsetAsked = offsetParam === false ? undefined : numberOf(req, offsetParam);
    const pageAsked = numberOf(req, pageParam);
    const offset = offsetAsked !== undefined ? Math.max(0, offsetAsked) : (Math.max(1, pageAsked ?? 1) - 1) * size;
    // the page an offset falls on, so an offset request still reports a page number
    const page = Math.floor(offset / size) + 1;
    const totalPages = Math.max(1, Math.ceil(all.length / size));
    const slice = all.slice(offset, offset + size);

    if (envelope && itemsField !== false) {
      envelope[itemsField] = slice;
      if (fields.page) envelope[fields.page] = page;
      if (fields.pageSize) envelope[fields.pageSize] = size;
      if (fields.totalSize) envelope[fields.totalSize] = all.length;
      if (fields.totalPages) envelope[fields.totalPages] = totalPages;
    } else {
      (res as MockResponse<unknown>).body = slice;
      if (totalHeader) res.headers.push({ [totalHeader]: String(all.length) });
    }

    if (link) {
      const rels = [`<${pageUrl(req, 1, size)}>; rel="first"`, `<${pageUrl(req, totalPages, size)}>; rel="last"`];
      if (page > 1) rels.push(`<${pageUrl(req, Math.min(page - 1, totalPages), size)}>; rel="prev"`);
      if (page < totalPages) rels.push(`<${pageUrl(req, page + 1, size)}>; rel="next"`);
      res.headers.push({ Link: rels.join(", ") });
    }
  };

  return { paginate };
}
