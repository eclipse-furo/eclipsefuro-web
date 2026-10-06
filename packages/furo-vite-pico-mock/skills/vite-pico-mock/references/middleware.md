# Middleware

Middleware lets one fixture answer every request to an endpoint — every filter, every page, every
id — instead of one file per variant. It runs after the case is picked, in array order, each one
awaited.

```typescript
middleware: [filterBooks, sortBooks, paginate, withEtag()],
```

`res` is the picked case with the defaults filled in (`status`, `contentType`, `delay`, `headers`,
`body`) and deep cloned, so mutate it freely. It also carries `replace()`, `notify()` and `inbox()`.

| `req.` | |
|---|---|
| `method` | uppercase |
| `path` | as received, with the api prefix |
| `params` | captured by the `{name}` directories, percent decoded |
| `customMethod` | the verb after the colon |
| `query` | decoded; a repeated key (`?tag=a&tag=b`) arrives as an array |
| `body` | the parsed json body, or `undefined` |
| `headers` | lowercased keys |
| `user` | the principal (`MockSession`), filled whenever a credential is present |

`MockMiddleware<T>` from `@furo/vite-pico-mock/types` types one.

## Order is not free

`filter → sort → count → paginate → withEtag()`. Each one hands the next a smaller body, and the
etag has to hash the body that actually ships, so **`withEtag()` is always last**. It warns when it
finds no body, which is what a wrong order looks like from the outside.

## Where it goes

| kind | location |
|---|---|
| generic, shipped by the package | `@furo/vite-pico-mock/helpers` |
| reusable across the project's endpoints | `<dir>/middleware/<topic>.ts` (outside `data/`, never routed) |
| specific to one resource | `<dataDir>/<path>/_middleware.ts` |
| used by one case only | inline in the `middleware` array |

Use a `_` prefixed **file**, never a folder.

## The shipped helpers

`@furo/vite-pico-mock/helpers`. Reach for these before writing a new one.

### `first` / `all`

- `first(v)` — the first value of a query param, `""` when absent. `req.query` hands back an array
  when a key repeats; a list endpoint usually wants one value.
- `all(v)` — every value of a repeated param, **also splitting on commas**, so
  `?update_mask=a,b` and `?update_mask=a&update_mask=b` mean the same thing (a
  `google.protobuf.FieldMask` serializes comma-joined in json).

### `withEtag()`

A **factory** — always written called. Hashes `JSON.stringify(res.body)` into a weak tag, pushes the
`ETag` header, and answers `304 Not Modified` with no body and no delay when `If-None-Match` names it.
Because the tag is derived from the body, a PATCH that writes a shared store makes the next GET hash
differently without either file knowing about the other. Pair it with `Cache-Control`; never give a
per-user response a `max-age`.

### `mergePatch` and friends

The merge behind a PATCH.

- `deepMerge(base, patch)` — nested objects merge, arrays and scalars replace, omitted keys stay.
- `applyMask(base, patch, mask)` — FieldMask semantics: a masked path is set to what the request
  holds there, and **a masked path the request does not set is cleared**.
- `mergePatch(base, patch, mask)` — `applyMask` when the mask is non-empty, `deepMerge` otherwise.
- `isObject(v)` — a json object, something to recurse into.

**All of them mutate `base` and return it**: hand them a `structuredClone` and store the result only
once the merge went through.

### `CursorPagination(options)`

Token paging (AIP-158): `page_size` / `page_token` in, `next_page_token` out. Returns `paginate`,
`countTotalSize` and `resolveLastPageToken`, all opt in so a fixture never answers with fields its
api does not declare. Reads the query first, the body second. Options: `itemsField` (default
`entities`), `nextTokenField` / `prevTokenField`, `totalField`, `pageSizeParam` / `pageTokenParam`,
`defaultPageSize` (20), `maxPageSize`, `lastPageToken`. Configure it once per project in a shared
middleware module with the api's own defaults.

### `Pagination(options)`

Page number / offset paging for a REST api without tokens, optional RFC 8288 `Link` header,
`itemsField: false` for a bare array with `X-Total-Count`. See the README for the option table.

## Type against the narrowest shape

Shared middleware typed against one endpoint's response stops being shared. Type it against only
the fields it touches:

```typescript
interface TitledList {
  books?: { title?: string }[];
}
export const filterByTitle: MockMiddleware<TitledList> = (res, req) => { /* … */ };
```

`MockMiddleware<T>` is contravariant in `res`, so a middleware typed on a narrower shape fits
wherever a wider response is expected.

## Recipe: filter by a query param

Read the param, narrow the list in place, return untouched when the param is absent.

```typescript
export const filterBooks: MockMiddleware<TitledList> = (res, req) => {
  const needle = first(req.query.query).toLowerCase();
  if (!needle || !res.body?.books) return;
  res.body.books = res.body.books.filter((b) => (b.title ?? "").toLowerCase().includes(needle));
};
```

## Recipe: pick by path param, 404 when missing

The case declares no `body`; the middleware produces it. `res.replace<U>()` answers with a
differently shaped body than the case declares, which an error always is:

```typescript
(res, req) => {
  const book = BOOKS[req.params.book_id ?? ""];
  if (!book) {
    res.replace<Status>({ status: 404, body: { error: "not_found", message: "…", code: 5, details: [] } });
    return;
  }
  res.body = book;
},
```

Anything left out of `replace` keeps its value — except `body`, which is cleared when omitted.

## Recipe: patch with a field mask

Drop the fields a client may not write, read the mask with `all()`, merge onto a clone, store it
only once the merge went through:

```typescript
const NOT_WRITABLE = ["id", "create_time"];

export const patchBook: MockMiddleware<Book> = (res, req) => {
  const id = req.params.book_id ?? "";
  const current = BOOKS[id];
  if (!current) {
    res.replace<Status>({ status: 404, body: { error: "not_found", message: `book ${id} does not exist`, code: 5, details: [] } });
    return;
  }
  const writable = (field: string): boolean => !NOT_WRITABLE.includes(field);
  const patch = Object.fromEntries(Object.entries(isObject(req.body) ? req.body : {}).filter(([f]) => writable(f)));
  const mask = all(req.query.update_mask).filter((path) => writable(path.split(".")[0] ?? ""));

  BOOKS[id] = mergePatch(structuredClone(current) as Record<string, unknown>, patch, mask) as Book;
  res.body = BOOKS[id];
};
```

Where the mask travels depends on the api's body binding: with the resource alone as the body, it is
in the query string; with the whole request as the body, it is in the body.

## Recipe: read a request body

Cast `req.body` to the **wire** type of what is actually bound as the body — with a single field
bound, that field's type, not the request's:

```typescript
const filter = (req.body ?? {}) as BookFilter;
```

Remember proto3 zero values: `0` and `""` usually mean "unset", so treat them as "no criterion".

## Recipe: alternate success and error

No middleware needed — `sequence` indexes into `cases` and rotates per request:

```typescript
const data: MockData<[Book, Status]> = {
  sequence: [0, 1],
  cases: [{ middleware: [patchBook] }, { status: 409, body: { /* … */ } }],
};
```

Put the write in the success case only. Counters are per resolved file, in memory: they survive a
fixture edit (clamped if the sequence got shorter) but not a dev server restart. A request refused
by `auth` does not advance the rotation. For automated tests, branch on a header or query param
instead — a shared counter makes parallel tests flaky.

## Recipe: push from a middleware

`res.notify(event, payload, { to })` announces a change to every open stream; `res.inbox({...})`
stores a message for a person. Both are queued and sent once the response is on the wire. See
[Notifications](notifications.md).
