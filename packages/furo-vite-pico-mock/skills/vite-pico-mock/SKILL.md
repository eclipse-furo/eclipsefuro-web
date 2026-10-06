---
name: vite-pico-mock
description: Write and debug fixtures for @furo/vite-pico-mock, the vite plugin that answers api calls from typed .ts files. Use when adding or changing mock api data, mocking an endpoint, the mock server answers 404 or 401/403, protecting a fixture with auth, roles or api keys, adding mock users, pushing notifications or inbox entries from a fixture, writing an ndjson streaming fixture, or writing fixture middleware (filter, paging, patch, etags).
---

# vite-pico-mock fixtures

pico-mock answers every request under the api prefix (default `/api/`) from a file whose path
mirrors the url. A fixture is a typed TypeScript module, re-imported on every request, so an edit is
live on the next request — no restart.

The canonical reference is `node_modules/@furo/vite-pico-mock/README.md`; the typed contract, doc
commented field by field, is `node_modules/@furo/vite-pico-mock/dist/types.d.ts`
(`@furo/vite-pico-mock/types`). This skill is the workflow and the traps.

> **Never guess the url or the body type.** Take both from the project's api layer — the generated
> SDK, an OpenAPI client, the proto's `google.api.http` rule. If the project has its own skill for
> mapping its SDK to fixtures, follow that one for steps 2 and 4.

## 1. Find the setup

Read the `picoMock({...})` call in the vite config. Everything below is relative to it:

| option | default | means |
|---|---|---|
| `dir` | `mock` | holds `data/` and `auth/` |
| `dataDir` | `<dir>/data` | the fixture tree |
| `usersFile` / `apiKeysFile` | `<dir>/auth/users.ts` / `apiKeys.ts` | who can sign in, which bearer tokens work |
| `apiPrefix` | `/api/` | stripped before the lookup: `/api/v1/x` → `data/v1/x/GET.ts` |
| `gatewayPrefix` | `<apiPrefix>_pico-mock/` | the built-in `login`, `logout`, `whoami`, `sse`, `notify` |
| `aliases` | `{}` | added on top of the vite config's `resolve.alias` |
| `formatError` | `rpcStatus` | the shape of errors the mock produces itself |

A `server.proxy` entry wins over the mock for the paths it claims.

## 2. Map the url to a file

| request | fixture file |
|---|---|
| `GET /api/v1/books` | `data/v1/books/GET.ts` |
| `POST /api/v1/books` | `data/v1/books/POST.ts` |
| `GET /api/v1/books/{book_id}` | `data/v1/books/{book_id}/GET.ts` |
| `PATCH /api/v1/books/{book_id}` | `data/v1/books/{book_id}/PATCH.ts` |
| `GET /api/v1/books:search` | `data/v1/books/search.GET.ts` |
| `POST /api/v1/books/{book_id}:archive` | `data/v1/books/{book_id}/archive.POST.ts` |

- **Each path segment is a directory**, the file is named after the http method the client
  actually sends (`PATCH.ts`, not `PUT.ts`). `HEAD` is answered from `GET.ts`.
- **`{name}/` keeps its braces** and captures the segment into `req.params.name`, percent decoded.
  One template directory per level.
- **A literal directory beats the template, per method.** `books/42/GET.ts` answers only book 42;
  a `PATCH` on 42 still falls through to `{book_id}/PATCH.ts`. A literal override does **not**
  inherit the template's `auth`.
- **A custom method (`:verb`) is a filename prefix**, `<verb>.<METHOD>.ts`, in the directory of what
  it acts on — never a directory of its own.
- **The query string never takes part.** Middleware reads it.
- **`_` prefixed files are helpers**, never routes. Use a file, not a folder: a directory is a path
  segment the router walks into.

Quote the path in a shell, `{` and `}` are brace expansion: `git add 'mock/data/v1/books/{book_id}/GET.ts'`.

## 3. Fill in the envelope

```typescript
import type { MockData } from "@furo/vite-pico-mock/types";
import type { Book } from "@/api/types";

/** GET /v1/books/{book_id} */
const data: MockData<[Book]> = {
  auth: "required",
  cases: [{ body: { id: "01JB…", title: "Dune" } }],
};

export default data;
```

| field | what it does |
|---|---|
| `description?` | a note to the reader, on the envelope or a case |
| `auth?` | who may call it — see below |
| `sequence?` | indexes into `cases`, rotated per request; defaults to `[0]` |
| `cases` | one entry per tuple member: `MockData<[A, B]>` types case 0 as `A`, case 1 as `B` |
| `cases[].status` | default 200 |
| `cases[].contentType` | default `application/json; charset=utf-8` |
| `cases[].delay` | artificial latency in ms |
| `cases[].headers` | `[{ "Cache-Control": "max-age=60" }]`, one key per object, applied after Content-Type |
| `cases[].body` | the static part; omit it when middleware produces the whole body |
| `cases[].middleware` | run in array order, each awaited — see [Middleware](references/middleware.md) |
| `cases[].stream` | a long-lived ndjson stream instead of a body — see [Notifications](references/notifications.md) |

**Type the body with the wire shape** — the field names exactly as they travel in json. A camelCase
client model typed against a snake_case api compiles and silently sends the wrong fields.

## 4. Declare `auth`

Declare it unless the endpoint is genuinely public. A fixture without it works from curl and
behaves differently in the app, or the reverse.

```typescript
auth: "required"                 // any principal, a session or an api key
auth: { roles: ["admin"] }       // 403 unless the principal holds one of them
auth: { via: "api-key" }         // machine only; "session" for browser only
```

It is enforced **before a case is picked**: a refusal runs no middleware and does not advance
`sequence`. No credential → 401, wrong role or kind → 403. `req.user` is filled on public endpoints
too whenever a credential is present. See [Auth](references/auth.md).

## 5. Write and verify

Start from a [template](references/templates.md), then:

```bash
npx tsc --noEmit                      # include the mock dir in tsconfig, or fixtures are never checked
curl -s localhost:5173/api/v1/books | jq .
curl -s -H "authorization: Bearer <token from apiKeys.ts>" localhost:5173/api/v1/books/01JB… | jq .
curl -s -X DELETE -w ' %{http_code}\n' -H "authorization: Bearer <token>" localhost:5173/api/v1/books/01JB…
curl -s -X PATCH -H 'content-type: application/json' -d '{"title":"x"}' "localhost:5173/api/v1/books/01JB…?update_mask=title"
```

5173 is vite's default; use the port the project's dev server runs on.

Curl through the vite dev server's port; the mock answers inside it. `standalonePort` only exists
for clients that bypass vite (`.http` files, test runners).

**Do not guess a path — curl it.** A miss answers 404 naming the exact file to create and how far
the path got:

```
[pico-mock] no fixture for DELETE /api/v1/books/42. Create mock/data/v1/books/42/DELETE.ts.
The path got as far as mock/data/v1/books/{book_id}/, which has: GET.ts, PATCH.ts.
```

"Create …" spells the path out literally; "got as far as" shows the template that matched. Put the
file under `{book_id}/` to serve every id, under `42/` to override only that one.

## Anti-Patterns (DO NOT)

- **Do NOT** drop the failure cases. A fixture that only ever answers the happy path tests nothing
  the app does when the backend misbehaves. Keep `sequence: [0, 0, 0, 1]` style rotations.
- **Do NOT** rely on a `sequence` in automated tests — one counter per fixture is shared by every
  client and worker. Let the request pick the failure (a query param or header the test sends).
- **Do NOT** hold state in a plain module-level object. Fixtures *and their helpers* are re-imported
  per request; anchor stores on `globalThis` (see [Templates](references/templates.md#shared-data)).
- **Do NOT** put `withEtag()` anywhere but **last** in `middleware`, and always call it: `withEtag()`.
- **Do NOT** put query params in a filename or add a directory per id. Middleware answers every
  combination from one file.
- **Do NOT** use `1`, `2` style ids when the real api uses ULIDs or UUIDs. Mint them the same way.
- **Do NOT** add a path alias to `tsconfig.json` alone. Fixtures resolve imports through vite's
  `resolve.alias` (or the `aliases` option); a missed entry typechecks and fails at request time.
- **Do NOT** give a response that depends on `req.user` a `max-age` — the url is the same for every
  user. Use `Cache-Control: private, no-cache` with `withEtag()`.
- **Do NOT** patch `@furo/vite-pico-mock` to make one fixture work. Project specific behaviour goes
  into the project's own middleware.

## References

- **[Templates](references/templates.md)** - list with filter and paging, custom method by body,
  single by id with 404, alternating error, create + notify, delete with an empty answer, ndjson
  stream, error-only, shared data
- **[Middleware](references/middleware.md)** - `req`/`res`, order, the shipped helpers
  (`first`/`all`, `withEtag`, `mergePatch`, `CursorPagination`, `Pagination`), recipes
- **[Auth](references/auth.md)** - `auth`, `req.user`, users file, api keys and PATs, gateway routes, curl
- **[Notifications](references/notifications.md)** - `res.notify`, `res.inbox`, streaming fixtures, SSE
