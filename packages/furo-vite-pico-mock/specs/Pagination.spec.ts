import { describe, expect, it } from "vitest";
import type { MockRequest, MockResponse } from "../src/types.js";
import { Pagination } from "../src/helpers/Pagination.js";

const items = (n: number): number[] => Array.from({ length: n }, (_, index) => index);

const responseFor = <T>(body: T): MockResponse<T> => ({
  status: 200,
  contentType: "application/json; charset=utf-8",
  delay: 0,
  headers: [],
  body,
  replace() {
    // paging edits the body in place, it never replaces the response
  },
  notify: () => undefined,
  inbox: () => undefined,
});

const request = (query: Record<string, string | string[]>, body?: unknown): MockRequest => ({
  method: "GET",
  path: "/api/users",
  params: {},
  query,
  body,
  headers: {},
});

interface Envelope {
  items?: unknown[];
  page?: number;
  page_size?: number;
  total_size?: number;
  total_pages?: number;
}

const headerOf = (res: MockResponse<unknown>, name: string): string | undefined => res.headers.find((h) => name in h)?.[name];

describe("Pagination", () => {
  it("serves the page the request asks for, and says where it is", () => {
    const res = responseFor<Envelope>({ items: items(42) });
    Pagination().paginate(res, request({ page: "2", page_size: "10" }));

    expect(res.body).toEqual({ items: items(42).slice(10, 20), page: 2, page_size: 10, total_size: 42, total_pages: 5 });
  });

  it("starts on page 1 with the default size", () => {
    const res = responseFor<Envelope>({ items: items(42) });
    Pagination().paginate(res, request({}));

    expect(res.body?.items).toHaveLength(20);
    expect(res.body?.page).toBe(1);
  });

  it("lets an offset win over the page, and reports the page it falls on", () => {
    const res = responseFor<Envelope>({ items: items(42) });
    Pagination().paginate(res, request({ offset: "25", page: "1", page_size: "10" }));

    expect(res.body?.items?.[0]).toBe(25);
    expect(res.body?.page).toBe(3);
  });

  it("answers a page past the end with no items rather than an error", () => {
    const res = responseFor<Envelope>({ items: items(5) });
    Pagination().paginate(res, request({ page: "9" }));

    expect(res.body?.items).toEqual([]);
    expect(res.body?.total_pages).toBe(1);
  });

  it("clamps the page size and ignores a broken one", () => {
    const capped = responseFor<Envelope>({ items: items(500) });
    Pagination({ maxPageSize: 50 }).paginate(capped, request({ page_size: "1000" }));
    expect(capped.body?.items).toHaveLength(50);

    const broken = responseFor<Envelope>({ items: items(500) });
    Pagination({ defaultPageSize: 7 }).paginate(broken, request({ page_size: "abc", page: "0" }));
    expect(broken.body?.items).toHaveLength(7);
    expect(broken.body?.page).toBe(1);
  });

  it("reads the fields from the body when the query has none", () => {
    const res = responseFor<Envelope>({ items: items(42) });
    Pagination().paginate(res, request({}, { page: 3, page_size: 10 }));

    expect(res.body?.items?.[0]).toBe(20);
  });

  it("uses the names it is given, and leaves out what is switched off", () => {
    const res = responseFor<Record<string, unknown>>({ users: items(42) });
    Pagination({ itemsField: "users", pageSizeParam: "limit", fields: { pageSize: "per_page", totalPages: false } }).paginate(
      res,
      request({ page: "2", limit: "5" })
    );

    expect(res.body).toEqual({ users: [5, 6, 7, 8, 9], page: 2, per_page: 5, total_size: 42 });
  });

  it("pages a bare array and puts the total into a header", () => {
    const res = responseFor<number[]>(items(42));
    Pagination({ itemsField: false }).paginate(res, request({ page: "5", page_size: "10" }));

    expect(res.body).toEqual([40, 41]);
    expect(headerOf(res, "X-Total-Count")).toBe("42");
  });

  it("links the neighbouring pages, keeping the other query params", () => {
    const res = responseFor<Envelope>({ items: items(42) });
    Pagination({ link: true }).paginate(res, request({ page: "2", page_size: "10", q: "x" }));

    const links = headerOf(res, "Link") ?? "";
    expect(links).toContain('</api/users?q=x&page=1&page_size=10>; rel="first"');
    expect(links).toContain('</api/users?q=x&page=5&page_size=10>; rel="last"');
    expect(links).toContain('</api/users?q=x&page=1&page_size=10>; rel="prev"');
    expect(links).toContain('</api/users?q=x&page=3&page_size=10>; rel="next"');
  });

  it("offers no prev on the first page and no next on the last", () => {
    const res = responseFor<Envelope>({ items: items(5) });
    Pagination({ link: true }).paginate(res, request({}));

    const links = headerOf(res, "Link") ?? "";
    expect(links).not.toContain('rel="prev"');
    expect(links).not.toContain('rel="next"');
  });

  it("leaves a body without the items alone", () => {
    const res = responseFor<Envelope>({});
    Pagination().paginate(res, request({ page: "2" }));

    expect(res.body).toEqual({});
  });
});
