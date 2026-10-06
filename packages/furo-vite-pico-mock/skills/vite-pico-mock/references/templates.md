# Fixture templates

Nine shapes cover almost every endpoint. The examples use a `books` resource with types imported
from `@/api/types`; replace both with the project's own resource and its generated wire types. In an
`@furo/open-models` project that is the generated `T<Name>` interface, `I<Name>` only when
`API_OPTIONS.UseProtoNames` is false — see SKILL.md, step 3.

Every fixture is the same skeleton: a `const data: MockData<[…]>` whose tuple types one body per
case, and `export default data;` at the bottom.

`Status` below stands for the api's error body. With the default `formatError` that is a
`google.rpc.Status`: `{ error: string; message: string; code: number; details: unknown[] }`.

## Collection list, filtered and paged

`GET /v1/books?query=…&page_size=…` → `data/v1/books/GET.ts`. The static body holds everything;
the middleware narrows it per request.

```typescript
import type { MockData } from "@furo/vite-pico-mock/types";
import type { ListBooksResponse } from "@/api/types";
import { CursorPagination, withEtag } from "@furo/vite-pico-mock/helpers";
import { BOOK_LIST } from "./_books";
import { filterBooks, sortBooks } from "./_middleware";

const { paginate, countTotalSize } = CursorPagination({ defaultPageSize: 20, itemsField: "books" });

/** GET /v1/books */
const data: MockData<[ListBooksResponse]> = {
  auth: "required",
  cases: [
    {
      headers: [{ "Cache-Control": "private, no-cache" }],
      middleware: [filterBooks, sortBooks, countTotalSize, paginate, withEtag()],
      body: { books: BOOK_LIST, next_page_token: "", total_size: 0 },
    },
  ],
};

export default data;
```

**The middleware order is the contract**: filter → sort → count → paginate → `withEtag()` last, so
the tag hashes the body that actually ships.

## Custom method filtered by the request body

`POST /v1/books:search` with the criteria as the body → `data/v1/books/search.POST.ts`. The case
declares **no body** — the middleware builds it. Paging may still arrive in the query string;
`CursorPagination` reads the query first and the body second.

```typescript
import type { MockData } from "@furo/vite-pico-mock/types";
import type { SearchBooksResponse } from "@/api/types";
import { CursorPagination } from "@furo/vite-pico-mock/helpers";
import { searchBooks } from "./_middleware";

const { paginate } = CursorPagination({ itemsField: "books" });

/** POST /v1/books:search - a custom method, so `<verb>.<METHOD>.ts` beside the collection */
const data: MockData<[SearchBooksResponse]> = {
  cases: [{ middleware: [searchBooks, paginate] }],
};

export default data;
```

## Single resource by path param, 404 when unknown

`GET /v1/books/{book_id}` → `data/v1/books/{book_id}/GET.ts`. One file serves every id.

```typescript
import type { MockData } from "@furo/vite-pico-mock/types";
import type { Book, Status } from "@/api/types";
import { withEtag } from "@furo/vite-pico-mock/helpers";
import { BOOKS } from "../_books";

/** GET /v1/books/{book_id} */
const data: MockData<[Book]> = {
  auth: "required",
  cases: [
    {
      delay: 300,
      middleware: [
        (res, req) => {
          const book = BOOKS[req.params.book_id ?? ""];
          if (!book) {
            res.replace<Status>({
              status: 404,
              body: { error: "not_found", message: `book ${req.params.book_id} does not exist`, code: 5, details: [] },
            });
            return;
          }
          res.body = book;
        },
        withEtag(),
      ],
    },
  ],
};

export default data;
```

With `noUncheckedIndexedAccess` on, `req.params.book_id` is `string | undefined`, hence `?? ""`.

## Update that alternates success and error

`PATCH /v1/books/{book_id}` → `data/v1/books/{book_id}/PATCH.ts`. `sequence: [0, 1]` answers 200,
then 409, then 200 — the UI's error path gets exercised on every second save. The 409 is a case of
its own and runs **no** middleware, so a failed save leaves the store untouched.

```typescript
import type { MockData } from "@furo/vite-pico-mock/types";
import type { Book, Status } from "@/api/types";
import { patchBook } from "../_middleware";

const data: MockData<[Book, Status]> = {
  auth: "required",
  sequence: [0, 1],
  cases: [
    { middleware: [patchBook] },
    {
      status: 409,
      delay: 100,
      body: {
        error: "aborted",
        message: "the book was changed by someone else",
        code: 10,
        details: [
          {
            "@type": "type.googleapis.com/google.rpc.BadRequest",
            field_violations: [{ field: "book.isbn", description: "This ISBN is already taken" }],
          },
        ],
      },
    },
  ],
};

export default data;
```

The body type is whatever the api actually returns — an update often returns the bare resource, not
a wrapper. Check the api layer, never the rpc name.

## Create that writes the store and notifies

`POST /v1/books` → `data/v1/books/POST.ts`. Mints an id, writes the shared store, sets `Location`,
and announces what it did.

```typescript
import type { MockData } from "@furo/vite-pico-mock/types";
import type { Book, Status } from "@/api/types";
import { senderName } from "@furo/vite-pico-mock/helpers";
import { ulid } from "ulid";
import { BOOKS } from "./_books";

const data: MockData<[Book, Status]> = {
  auth: "required",
  sequence: [0, 0, 0, 1],
  cases: [
    {
      status: 201,
      delay: 500,
      middleware: [
        (res, req) => {
          const id = ulid();
          const created: Book = { ...((req.body ?? {}) as Book), id };
          BOOKS[id] = created;

          res.headers = [{ Location: `/api/v1/books/${id}` }];
          res.body = created;

          res.notify("book_created", { book_id: id });
          res.inbox({ to: "others", event: "book_created", title: `${senderName(req.user)} added a book`, text: created.title ?? "" });
        },
      ],
    },
    { status: 409, delay: 100, body: { error: "already_exists", message: "Conflict", code: 6, details: [] } },
  ],
};

export default data;
```

`sequence: [0, 0, 0, 1]` fails every fourth create.

## Delete with an empty answer

`DELETE /v1/books/{book_id}` → `data/v1/books/{book_id}/DELETE.ts`. An rpc answering
`google.protobuf.Empty` is typed `Record<string, never>` and sends `body: {}` — a json document, so
a client that always parses json does not trip over an empty body. Fail it the way the real backend
would: 404 for an unknown id when there is a store to look in, a 400/409 precondition when deleting
can be refused.

```typescript
import type { MockData } from "@furo/vite-pico-mock/types";
import type { Status } from "@/api/types";
import { BOOKS } from "../_books";

const data: MockData<[Record<string, never>, Status]> = {
  auth: "required",
  sequence: [0, 0, 0, 1],
  cases: [
    {
      body: {},
      middleware: [
        (res, req) => {
          const id = req.params.book_id ?? "";
          if (!BOOKS[id]) {
            res.replace<Status>({ status: 404, body: { error: "not_found", message: `book ${id} does not exist`, code: 5, details: [] } });
            return;
          }
          delete BOOKS[id];
        },
      ],
    },
    { status: 400, body: { error: "failed_precondition", message: "the book is still lent out", code: 9, details: [] } },
  ],
};

export default data;
```

With no store yet, drop the middleware and answer `{}`; add the store (see Shared data) as soon as
a create or list fixture for the same resource exists, so they agree.

## Streaming, ndjson

`GET /v1/events:stream` → `data/v1/events/stream.GET.ts`. No `body`, no `status`, no `sequence` —
the case says what a *message* is. See [Notifications](notifications.md).

```typescript
import type { MockData } from "@furo/vite-pico-mock/types";
import type { StreamEventsResponse } from "@/api/types";

const MEMBERS = new Set(["notification_created", "book_created", "message"]);

const data: MockData<[StreamEventsResponse]> = {
  auth: "required",
  cases: [
    {
      contentType: "application/x-ndjson",
      stream: {
        map: (name, payload) => {
          const member = name ?? "message";
          if (!MEMBERS.has(member)) return undefined; // drop what this stream does not model
          return { [member]: payload };
        },
      },
    },
  ],
};

export default data;
```

Type it with whatever the client's stream reader yields per message; with open-models, the `T*` of
the stream's response type.

## A fixture that is only an error

To pin one id to a failure, type the whole `MockData` as the error and skip `res.replace`.
`data/v1/books/01JBZZZZZZZZZZZZZZZZZZZZZZ/GET.ts`:

```typescript
import type { MockData } from "@furo/vite-pico-mock/types";
import type { Status } from "@/api/types";

const data: MockData<[Status]> = {
  cases: [
    {
      description: "the resource does not exist",
      status: 404,
      body: { error: "not_found", message: "book 01JBZZZZZZZZZZZZZZZZZZZZZZ does not exist", code: 5, details: [] },
    },
  ],
};

export default data;
```

The literal directory beats `{book_id}/` **for GET only**, and does not inherit its `auth` — this
one is public unless it declares its own.

## Shared data

Data more than one fixture needs goes into a `_` prefixed sibling, `data/v1/books/_books.ts`:

```typescript
import type { Book } from "@/api/types";

const store = globalThis as typeof globalThis & { __mockBooks?: Record<string, Book> };

export const BOOKS = (store.__mockBooks ??= {
  "01JB0000000000000000000001": { id: "01JB0000000000000000000001", title: "Dune" },
});

export const BOOK_LIST = Object.values(BOOKS);
```

The `globalThis` anchor is required, not stylistic: every fixture *and its helpers* are re-imported
per request, so a plain module-level object would be thrown away and a POST never visible to the
next GET. The store survives a vite re-bundle, not a dev server restart — every session starts from
the seed. For real queries, the README's "A real database" section shows the same pattern on
`node:sqlite`.
