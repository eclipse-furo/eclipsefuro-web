# @furo/vite-pico-mock

A mock backend for frontend development. pico-mock is a vite plugin that answers your app's api
calls from files in your repository, so the frontend can be built, demoed and tested without the
real backend running — or before it exists.

The url picks the file: `GET /api/v1/cubes/42` is answered by `mock/data/v1/cubes/{cube_id}/GET.ts`,
a typed TypeScript module that is re-read on every request. On top of that:

- **Typed mock data, no stale fixtures.** `MockData<[TCube, IStatus]>` types every case's body
  against your api's own types — the ones your SDK or code generator emits. When the api changes,
  `npx tsc --noEmit` names every fixture that no longer fits, before the app runs into it. Fixtures
  can't drift out of date without anyone noticing. For this, the mock directory must be in your
  `tsconfig.json` — an `"include": ["src"]` leaves it out, and `tsc` passes without checking a
  single fixture:

  ```jsonc
  // tsconfig.json
  { "include": ["src", "mock"] }
  ```
- **Fixtures are programs, compiled by vite on demand.** A fixture is not a json file but a
  TypeScript module: it imports your app's types and shared helpers, runs
  [middleware](#middleware) that computes the answer from the request, and can keep state across
  requests. Vite compiles it fresh on every request, with no cache — no build step, no watcher, no
  restart. Edit it and the next request runs the new code; your vite aliases work in it. The users
  and api keys files are loaded the same way.
- **Very specific cases, without touching the general one.** A literal path wins over a template:
  `cubes/{cube_id}/GET.ts` answers every cube, and `cubes/42/GET.ts` next to it answers only cube 42
  — the one that is locked, half deleted, or has the 3 MB description. It wins per method, so a
  `PATCH` on 42 still falls through to the template. See [File layout](#file-layout).
- **Multi user simulation.** A mock login gateway with [users, roles and sessions](#users-and-auth),
  so the app runs behind the real 401 → sign in → back flow and can be tried as alice, as an admin,
  as a user whose session runs out after a minute. Endpoints can demand a session, an api key or a
  role and answer 401 or 403.
- **Api keys and personal access tokens** for the callers that are not a browser — curl, an `.http`
  file, another server. A key [acts as a user](#api-keys): a service identity, or a person, as a PAT
  does. It can narrow that user's roles, expire or be revoked.
- **Data that changes.** A POST adds to a store, a PATCH merges into it with field mask semantics,
  a GET reads it back — [middleware](#middleware) on an in-memory store, or on a real SQLite
  database through `node:sqlite` ([example](#a-real-database)), where filters, sorting and joins are
  plain SQL. A restart of the dev server resets an in-memory store to the seed, so every session
  starts from a known state; a database file keeps its data until you delete it.
- **Network conditions.** A `delay` per case for slow responses, see [the envelope](#the-envelope).
- **Caching.** [`withEtag()`](#etags) sends an ETag computed from the body and answers
  `If-None-Match` with 304; any other header — `Cache-Control`, `Link`, … — is set per case.
- **Streaming responses.** Long-lived [ndjson streams](#push-notifications) with a heartbeat, an
  SSE view of the same bus, and a per user [inbox](#the-inbox). A middleware notifies everyone, the
  other users, the user's own tabs or a role — only after its response is on the wire.
- **Paging and filtering.** [Helpers](#helpers) for token paging (AIP-158), page / offset paging with
  `Link` headers, repeated query params and PATCH.
- **Helpful 404s.** A request without a fixture answers 404 naming the file to create.
- **Next to a real backend.** A `server.proxy` entry wins over the mock, so one part of the api can
  be real while the rest is fixtures, see [How it runs](#how-it-runs).
- **No second server.** It answers inside vite's own dev server — no extra port, no proxy — and can
  also [run on its own](#without-the-plugin).

```sh
npm i -D @furo/vite-pico-mock
```

```ts
// vite.config.ts
import { defineConfig } from "vite";
import { picoMock } from "@furo/vite-pico-mock/vite";

export default defineConfig({
  plugins: [picoMock()],
});
```

```ts
// mock/data/v1/hello/GET.ts  ->  GET /api/v1/hello
import type { MockData } from "@furo/vite-pico-mock/types";

const data: MockData<[{ greeting: string }]> = {
  cases: [{ body: { greeting: "hello" } }],
};

export default data;
```

`npm run dev`, then `curl localhost:5173/api/v1/hello`. Edit the fixture and the next request
serves the edit; there is no restart and no module cache.

- [How it runs](#how-it-runs)
- [Options](#options)
- [File layout](#file-layout)
- [The envelope](#the-envelope)
- [Middleware](#middleware)
- [Helpers](#helpers) — query, PATCH, ETags, pagination
- [Users and auth](#users-and-auth)
- [Api keys](#api-keys) — service keys and personal access tokens
- [Push notifications](#push-notifications)
- [Without the plugin](#without-the-plugin)
- [Claude Code skill](#claude-code-skill)
- [Limits](#limits)

## How it runs

The plugin mounts the mock into vite's own dev server and into `vite preview`. There is no second
port and no proxy to keep in step: a request under the api prefix is answered in-process, a stream
is written straight to the browser's socket. A build serves nothing, so the plugin is inactive there.

It runs before vite's own middleware, so it wins over a placeholder `public/auth.html` — but **not
over a `server.proxy` entry**. A path a proxy claims is left to the proxy even when it is under the
api prefix, which is how a real backend for one part of the api (an LLM server under
`/api/openai/`, say) coexists with fixtures for the rest:

```ts
export default defineConfig({
  plugins: [picoMock()],
  server: { proxy: { "^/api/openai/.*": { target: "http://localhost:1234", rewrite: (p) => p.replace(/^\/api\/openai/, "") } } },
});
```

Fixtures are imported through vite's module runner, so TypeScript and the **aliases of your vite
config** (`resolve.alias`) work in them, value imports included. The runner reads no config file of
its own; the plugin hands the aliases over.

## Options

```ts
picoMock({
  root: undefined,             // vite's root
  dir: "mock",                 // holds data/ and auth/
  dataDir: "mock/data",        // the fixture tree, default <dir>/data
  usersFile: "mock/auth/users.ts",
  apiKeysFile: "mock/auth/apiKeys.ts",
  apiPrefix: "/api/",          // not part of the tree: /api/v1/x -> data/v1/x/GET.ts
  gatewayPrefix: "/api/_pico-mock/",
  loginPath: "/auth.html",     // false serves none
  logoutPath: "/logout.html",  // false serves none
  aliases: {},                 // added on top of the vite config's resolve.alias
  formatError: rpcStatus,      // the body of an error the mock produces itself
  inbox: {},                   // see The inbox
  standalonePort: undefined,   // also listen on a port of its own, see below
});
```

Every option is optional. Relative paths resolve against [`root`](#root).

### Files

#### `root`

*`string` · default: vite's `root`, `process.cwd()` without the plugin*

The project root every other path is relative to. The plugin passes vite's, so it rarely needs
setting.

#### `dir`

*`string` · default `"mock"`*

The directory holding `data/` and `auth/`. The defaults of `dataDir`, `usersFile` and
`apiKeysFile` are built from it, so moving the whole mock is this one option.

#### `dataDir`

*`string` · default `<dir>/data`*

The fixture tree, see [File layout](#file-layout).

#### `usersFile`

*`string` · default `<dir>/auth/users.ts`*

The module exporting `USERS` and, optionally, `AUTH_OPTIONS`, see [Users and auth](#users-and-auth).
Without the file there are no users: every endpoint with `auth` answers 401 and the picker says
where to add one.

#### `apiKeysFile`

*`string` · default `<dir>/auth/apiKeys.ts`*

The module exporting `API_KEYS`, see [Api keys](#api-keys). Without the file there are none.

### Urls

#### `apiPrefix`

*`string` · default `"/api/"`*

The url prefix the fixtures are served under. It is not part of the tree: `/api/v1/cubes` is
answered from `<dataDir>/v1/cubes/GET.ts`. A missing trailing slash is added. A `server.proxy`
entry still wins over it, see [How it runs](#how-it-runs).

#### `gatewayPrefix`

*`string` · default `<apiPrefix>_pico-mock/`*

Where the built-in routes live: `login`, `logout`, `whoami`, `sse` and `notify`, see
[The gateway routes](#the-gateway-routes).

#### `loginPath`

*`string | false` · default `"/auth.html"`*

The page the app sends the browser to for a login, served as the user picker. `false` serves none,
and a 401 then points to `<gatewayPrefix>login` instead.

#### `logoutPath`

*`string | false` · default `"/logout.html"`*

The page that ends the session and returns to the picker. `false` serves none;
`<gatewayPrefix>logout` does the same job.

### Behaviour

#### `aliases`

*`Record<string, string>` or `{ find: string | RegExp, replacement: string }[]` · default `{}`*

Import aliases for the fixtures, in the form of vite's `resolve.alias`. Fixtures are loaded through
vite's module runner, which reads no config file of its own, so the plugin hands the vite config's
aliases over; these are added on top. Without the plugin they are the only aliases there are.

#### `formatError`

*`(error: { status, error, message }) => unknown` · default `rpcStatus`*

Shapes the errors the **mock** produces itself — no fixture, no session, an unknown api key, an
exception in a middleware. The default, `rpcStatus` (exported from `@furo/vite-pico-mock`), answers a
`google.rpc.Status`, `{ error, message, code, details: [] }`, the shape a gRPC transcoding gateway
uses. An api with RFC 9457 problem details would pass:

```ts
formatError: ({ status, error, message }) => ({ type: error, title: message, status }),
```

A fixture's own error cases are untouched by it.

#### `inbox`

*object · default `{}`*

How `res.inbox()` stores and pushes, see [The inbox](#the-inbox).

- `event` — the stream event a delivered notification goes out with. Default
  `"notification_created"`.
- `seed` — `() => MockNotification[]`, what a fresh inbox holds. Default: one welcome entry.
- `mint` — `(entry, sender, now) => MockNotification`, turns an entry into the stored and pushed
  notification, for an api whose notification looks different. Keep `id` and `read`: the inbox marks
  notifications read by them. Default `mintNotification` from the helpers.

### Plugin only

#### `standalonePort`

*`number` · default: off*

Additionally listen on this port, for a client that should reach the mock without the dev server in
between — an IntelliJ `.http` file, a test runner. When the port is taken the next free one is used;
the log names the port it landed on.

### `startPicoMock` only

[Without the plugin](#without-the-plugin), `startPicoMock` takes the options above plus:

- `port` — the preferred port. Default `10000`.
- `host` — default `"127.0.0.1"`: a fixture server has no business being on the LAN.
- `maxAttempts` — how many ports from `port` on are tried before giving up. Default `10`.

## File layout

```
mock/
├── auth/
│   ├── users.ts       ← the users you can sign in as, see Users and auth
│   └── apiKeys.ts     ← the api keys other servers and curl authenticate with
└── data/              ← the fixtures
    └── v1/cubes/
        ├── POST.ts              POST  /api/v1/cubes          ← the collection itself
        ├── filter.POST.ts       POST  /api/v1/cubes:filter   ← custom method
        ├── _entities.ts         (helper, never a route)
        ├── 01KCFMX3…/GET.ts     GET   /api/v1/cubes/01KCFMX3… ← literal, wins over the template
        └── {cube_id}/
            ├── GET.ts           GET   /api/v1/cubes/<any id>
            └── PATCH.ts         PATCH /api/v1/cubes/<any id>
```

- **The path mirrors the url** minus the api prefix, and the file is named after the http method.
  The query string never takes part — that is what middleware is for.
- **`{name}/`** captures a path segment into `req.params.name`, percent decoded. One template
  directory per level.
- **A literal directory wins** over the template, **per method**: a `PATCH` on `01KCFMX3…` finds no
  `PATCH.ts` there and falls through to `{cube_id}/PATCH.ts`.
- **Custom methods** (`:verb`, AIP-136) put the verb before the method: `GET /v1/cubes:suggest` →
  `suggest.GET.ts`, `POST /v1/cubes/{cube_id}:archive` → `{cube_id}/archive.POST.ts`.
- **`HEAD`** is answered from `GET.ts`.
- **`_` prefixed files are helpers**, never routes: data and middleware shared by the fixtures of one
  resource. Use a file, not a folder — a directory is a path segment the router walks into.
- A request for a path that has no fixture answers 404 naming the file to create and how far the
  path got. `..` segments and symlinks out of the tree are refused.

> `{` and `}` are brace expansion characters in zsh and bash. Quote the path:
> `git add 'mock/data/v1/cubes/{cube_id}/GET.ts'`.

## The envelope

```ts
const data: MockData<[TCubeEntity, IStatus]> = {
  sequence: [0, 0, 0, 1],
  cases: [
    { status: 200, body: { cube: { … } }, middleware: [ … ] },
    { status: 409, body: { error: "already_exists", message: "…", code: 6, details: [] } },
  ],
};

export default data;
```

| key | |
|---|---|
| `sequence` | indexes into `cases`, rotated per request. Defaults to `[0]`. With a 409 as case 1, `[0, 0, 0, 1]` answers a conflict on every fourth call; `[0, 2]` with a 503 as case 2 makes every other call fail |
| `auth` | makes the endpoint non public, see [Users and auth](#users-and-auth) |
| `cases[].status` | default 200 |
| `cases[].contentType` | default `application/json; charset=utf-8` |
| `cases[].delay` | ms to wait before responding |
| `cases[].headers` | array of single-key objects, applied after Content-Type so they can override it |
| `cases[].body` | typed by the tuple — `MockData<[A, B]>` types case 0 as `A` and case 1 as `B`. Omit it when middleware produces the whole body |
| `cases[].middleware` | see below |
| `cases[].stream` | answer with a long-lived ndjson stream instead, see [Push notifications](#push-notifications) |
| `description` | a note to the reader, on the envelope or on a case |

The sequence counters live in memory, per file: they survive a fixture edit (and are clamped when
the edit shortens the sequence) but not a dev server restart.

> [!WARNING]
> **A `sequence` makes tests flaky.** There is one counter per fixture for the whole server, shared
> by every client. Playwright, Vitest and other runners spread tests over parallel workers, retry
> failed ones and run them in any order, so which test gets the fourth call — the 409 — is down to
> timing. The same goes for an app that fetches twice, or a prefetch. A sequence is for clicking
> through the app by hand. For an automated test, let the request pick the failure — a middleware on
> a query param or header the test sends — so every test gets the same answer whatever runs beside it.

Keep the failure cases. A fixture that only ever answers the happy path tests nothing an app does
when the backend misbehaves.

## Middleware

```ts
middleware: [(res, req) => { … }]
```

They run in array order and each one is awaited. `res` is the picked case with the defaults filled
in — `status`, `contentType`, `delay`, `headers`, `body` — and deep cloned, so mutate it freely.
`req` carries:

| | |
|---|---|
| `method` | uppercase |
| `path` | as received, with the api prefix |
| `params` | captured by the `{name}` directories |
| `customMethod` | the verb after the colon |
| `query` | decoded; a repeated key (`?tag=a&tag=b`) arrives as an array |
| `body` | the parsed json body, or `undefined` |
| `headers` | lowercased keys |
| `user` | the principal, see [The signed in user](#the-signed-in-user) |

To answer with a differently shaped body than the case declares — an error, a 204 — use
`res.replace`, because the error does not fit into a `body` typed as the happy path:

```ts
res.replace<IStatus>({
  status: 404,
  body: { error: "not_found", message: `cube ${req.params.cube_id} does not exist`, code: 5, details: [] },
});
```

Anything left out keeps its value, except the body, which is cleared. `res.notify` and `res.inbox`
push, see [Push notifications](#push-notifications).

State that should outlive a request — a store a POST writes and a GET reads — goes into a `_`
prefixed module, anchored on `globalThis`. The fixture and its helpers are re-imported on every
request, so a module level variable would start over each time:

```ts
const store = globalThis as typeof globalThis & { __myCubes?: Record<string, TCube> };
export const CUBES = (store.__myCubes ??= { /* seed */ });
```

### A real database

The store can just as well be SQLite. Node ships it as `node:sqlite`, so there is nothing to
install: open the database once in a `_` prefixed module, anchored on `globalThis` like the store
above, and query it from the middleware.

```ts
// mock/data/v1/cubes/_db.ts - a helper, never a route
import { DatabaseSync } from "node:sqlite";

const store = globalThis as typeof globalThis & { __cubesDb?: DatabaseSync };
export const db = (store.__cubesDb ??= open());

function open(): DatabaseSync {
  const db = new DatabaseSync(":memory:"); // or a file, see below
  db.exec("CREATE TABLE IF NOT EXISTS cubes (id TEXT PRIMARY KEY, name TEXT NOT NULL)");
  if (!db.prepare("SELECT 1 FROM cubes LIMIT 1").get()) {
    db.prepare("INSERT INTO cubes (id, name) VALUES (?, ?)").run("42", "the answer");
  }
  return db;
}
```

```ts
// mock/data/v1/cubes/{cube_id}/GET.ts  ->  GET /api/v1/cubes/42
import type { MockData } from "@furo/vite-pico-mock/types";
import { db } from "../_db";

const data: MockData<[{ cube: TCube }, IStatus]> = {
  cases: [
    {
      middleware: [
        (res, req) => {
          const cube = db.prepare("SELECT id, name FROM cubes WHERE id = ?").get(req.params.cube_id) as TCube | undefined;
          if (!cube) {
            res.replace<IStatus>({ status: 404, body: { error: "not_found", message: `cube ${req.params.cube_id} does not exist`, code: 5, details: [] } });
            return;
          }
          res.body = { cube };
        },
      ],
    },
  ],
};

export default data;
```

```ts
// mock/data/v1/cubes/POST.ts  ->  POST /api/v1/cubes
import type { MockData } from "@furo/vite-pico-mock/types";
import { db } from "./_db";

const data: MockData<[{ cube: TCube }]> = {
  cases: [
    {
      status: 201,
      middleware: [
        (res, req) => {
          const { id, name } = (req.body as { cube: TCube }).cube;
          db.prepare("INSERT INTO cubes (id, name) VALUES (?, ?)").run(id, name);
          res.body = { cube: { id, name } };
        },
      ],
    },
  ],
};

export default data;
```

- **`:memory:` or a file.** An in-memory database starts over with every dev server restart, like any
  other state. A file — `new DatabaseSync("mock/.db/cubes.sqlite")`, gitignored — keeps its rows
  across restarts; delete it to start fresh. That is why `open()` creates the table only if it is
  missing and seeds only an empty one.
- **The schema is read once.** The connection is reused from `globalThis`, so an edit to `open()`
  takes effect after a restart (and, for a file, after deleting it). The fixtures themselves stay live.
- **Rows are untyped.** `.get()` and `.all()` return plain records; cast them to your api's type.
- **Node 22.13 or later**, where `node:sqlite` needs no flag. It still logs an `ExperimentalWarning`
  on Node 24. `better-sqlite3` works the same way if a native dependency is fine with you.
- **One database for every client**, so the [`sequence` warning](#the-envelope) applies here too:
  parallel test workers that write to it see each other's rows.

## Helpers

`@furo/vite-pico-mock/helpers`:

| | |
|---|---|
| `first(v)`, `all(v)` | one value of a query param; every value of a repeated one, comma separated values split too |
| `mergePatch(base, patch, mask)` | the merge behind a PATCH: `google.protobuf.FieldMask` semantics with an `update_mask`, a deep merge without one. Mutates `base` |
| `deepMerge`, `applyMask`, `isObject` | its parts |
| `withEtag()` | ETag and `304 Not Modified`, see below |
| `CursorPagination(options)` | token paging, AIP-158 |
| `Pagination(options)` | page number or offset paging |
| `createInbox()`, `senderName()`, `mintNotification()`, `matches()`, `publish()` | the inbox and the push bus, for a fixture that serves or feeds them |

### ETags

Append `withEtag()` to a case's middleware, **last** — it hashes the finished body:

```ts
middleware: [pickCubeById, withEtag()],
```

The case then sends a weak `ETag` computed from the body, and answers a matching `If-None-Match`
with `304` — no body and no delay. You never write a tag: it changes exactly when the body does.
Matching follows RFC 9110 (`*`, lists, weak comparison).

It pairs with `Cache-Control`, it does not replace it: `max-age` saves the request while the copy is
fresh, the ETag saves the body once it is stale. Never give a response that depends on `req.user` a
`max-age` — the url is the same for every user. Send `Cache-Control: private, no-cache` with
`withEtag()` instead.

The app never sees the 304: the browser consumes it and hands `fetch` the stored response as a 200.
Watch it in the network panel or with curl.

### CursorPagination

Token paging the way AIP-158 has it: `page_size` and `page_token` in, `next_page_token` out.

```ts
const { paginate, countTotalSize, resolveLastPageToken } = CursorPagination({ defaultPageSize: 23 });

middleware: [filterCubes, sortCubes, countTotalSize, resolveLastPageToken, paginate],
```

- `paginate` slices the items and fills `next_page_token` and `prev_page_token`. The token is the
  offset, which is all a fixture needs; a client treats it as opaque anyway.
- `countTotalSize` writes `total_size`, the size of the whole match set.
- `resolveLastPageToken` turns the sentinel `::last-page` into the offset of the final page, for an
  api that documents such a token.

All three are opt in, so a fixture never answers with more fields than its api declares. **Order
matters: filter → sort → count → resolve → paginate**, and only `withEtag()` after that — paging
replaces the items with one page, so anything that changes the set or its order has to run first.

The fields are read from the query string first and from the request body second, so the same
middleware serves an rpc bound with `body: "*"`.

| option | default |
|---|---|
| `itemsField` | `entities` |
| `nextTokenField` / `prevTokenField` | `next_page_token` / `prev_page_token` (`false` for none) |
| `totalField` | `total_size` |
| `pageSizeParam` / `pageTokenParam` | `page_size` / `page_token` |
| `defaultPageSize` | 20, also for a size that is not a positive number |
| `maxPageSize` | unlimited |
| `lastPageToken` | `::last-page` |

### Pagination

Page number or offset paging, for a REST api without tokens:

```ts
const { paginate } = Pagination({ itemsField: "users", pageSizeParam: "limit", link: true });
// GET /api/users?page=2&limit=10
// -> { users: [10 of them], page: 2, page_size: 10, total_size: 42, total_pages: 5 }
//    Link: </api/users?page=1&limit=10>; rel="first", …; rel="prev", …; rel="next", …; rel="last"
```

An `offset` wins over `page` when both are sent. A page past the end answers with no items, not an
error — the totals still say how far the list goes. With `itemsField: false` the body *is* the
array, and the total goes into an `X-Total-Count` header.

| option | default |
|---|---|
| `itemsField` | `items`, `false` for a bare array |
| `pageParam` / `pageSizeParam` / `offsetParam` | `page` / `page_size` / `offset` (`false` to ignore offsets) |
| `defaultPageSize` / `maxPageSize` | 20 / 100 |
| `fields` | names of `page`, `pageSize`, `totalSize`, `totalPages` next to the items, `false` leaves one out |
| `totalHeader` | `X-Total-Count`, for a bare array |
| `link` | `false`; `true` adds an RFC 8288 `Link` header |

## Users and auth

An app usually sits behind a gateway — OIDC, Entra ID, a BFF — and the browser only ever holds an
HttpOnly session cookie. pico-mock plays that gateway, so an app can be exercised as more than one
user, and the 401 → sign in → back flow runs against the mock too.

```ts
// mock/auth/users.ts - re-read per request, an edit is live on the next one
import type { MockAuthOptions, MockUser } from "@furo/vite-pico-mock/types";

export const USERS: MockUser[] = [
  {
    key: "alice",
    claims: { sub: "u1", preferred_username: "alice", name: "Alice Example", given_name: "Alice", family_name: "Example", email: "alice@example.com", roles: ["user"], features: [] },
  },
  { key: "bob", sessionTtlSeconds: 60, claims: { … } },          // runs out after a minute
  { key: "ci-bot", kind: "service", claims: { … } },             // reachable by api key only
];

export const AUTH_OPTIONS: Partial<MockAuthOptions> = { sessionTtlSeconds: 8 * 60 * 60, secureCookie: false };
```

Name the claims the way the app's real tokens do; add whatever else they carry. The file lives
outside `data/` so nothing in it can be routed to.

### Non public endpoints

```ts
const data: MockData<[TProfile]> = {
  auth: "required",                    // any principal - a session or an api key
  // auth: { roles: ["admin"] },       // one holding at least one of the roles, 403 otherwise
  // auth: { via: "api-key" },         // machine only, 403 for a browser session
  // auth: { via: "session" },         // browser only, 403 for an api key
  cases: [ … ],
};
```

Without a credential the endpoint answers **401**; with one that lacks the roles or is the wrong
kind, **403** — the caller is authenticated, it is just not allowed. Both are answered before a case
is picked, so a refusal neither runs middleware nor advances the `sequence`. A fixture without `auth`
is public, and `req.user` is still filled when there is a credential.

### The signed in user

Every middleware sees the principal as `req.user`. It is the same shape for a session and for an api
key:

| field | |
|---|---|
| `key` | the user's key in `users.ts`. For an api key, the user it acts as |
| `claims` | as they were when the session started, or as the api key narrowed them |
| `token` | an HS256 JWT minted from the claims — the bearer a BFF forwards. It never reaches the browser |
| `expiresAt` | epoch ms |
| `via` | `"session"` or `"api-key"` |
| `kind` | the user's `kind`, `"human"` or `"service"`. Always `"human"` for a session; for an api key it tells a service key from a [personal access token](#api-keys) |
| `apiKey` | the key's `label`, when `via` is `"api-key"`. Never the token itself |

Anything else a fixture needs per user belongs to that fixture's resource: a `_` prefixed store keyed
by `req.user.key`.

### The gateway routes

| route | |
|---|---|
| `GET /auth.html` (`loginPath`) | the user picker |
| `GET /api/_pico-mock/login?user=alice&return=/cubes` | signs in, sets the cookie, 303 to `return` |
| `GET /logout.html` (`logoutPath`), `/api/_pico-mock/logout` | ends the session, clears the cookie, 303 to the picker |
| `GET /api/_pico-mock/whoami` | the principal as json, 401 without one. Takes an api key |
| `GET /api/_pico-mock/sse` | the push bus as `text/event-stream`, see below |
| `POST /api/_pico-mock/notify` | send an inbox notification by hand, see below |

`return` falls back to the `Referer`, so after signing in the app is back on the page it was on.
Only paths of the app are accepted — never the api or the gateway pages.

**Sessions** live in memory on `globalThis`: they survive a vite config reload, not a restart of the
process. A session keeps the claims it started with. The cookie is `pico_mock_session`,
`HttpOnly; SameSite=Lax`, plus `Secure` when `AUTH_OPTIONS.secureCookie` is set — off by default,
because Safari drops a `Secure` cookie on `http://localhost`.

Nothing clears the browser's http cache when the user changes, so a per user response must not be
cacheable across users — see [ETags](#etags). `Clear-Site-Data: "cache"` would do it wholesale, but
Chrome takes seconds to process it, so the gateway does not send it.

## Api keys

For the callers that are not a browser — another server, a curl script, an `.http` file:

```sh
curl -H 'authorization: Bearer api-key-ci-bot' localhost:5173/api/profile
```

```ts
// mock/auth/apiKeys.ts - re-read per request
import type { MockApiKey } from "@furo/vite-pico-mock/types";

export const API_KEYS: MockApiKey[] = [
  { token: "api-key-ci-bot", user: "ci-bot", label: "ci-bot" },
  { token: "api-key-alice-readonly", user: "alice", roles: ["user"], features: [] },   // narrowed
  { token: "api-key-expired", user: "alice", expiresAt: "2020-01-01T00:00:00Z" },
  { token: "api-key-revoked", user: "alice", disabled: true },
];
```

A key **acts as a user** from `users.ts`, so it is not a second kind of caller to write fixtures for:
`req.user` is filled the same way and `auth` gates it the same way.

| field | |
|---|---|
| `token` | what the client sends as `authorization: Bearer <token>`. Required |
| `user` | the `key` of the user this key acts as. Required |
| `label` | a short name for logs and `whoami`. Defaults to the last four characters of the token |
| `roles` / `features` | narrow the user's. Leave one out for all of them; `[]` narrows to nothing |
| `expiresAt` | RFC 3339 |
| `disabled` | revoke without losing the entry |

**A key can only take away.** `roles` and `features` are intersected with what the user holds;
naming one the user lacks logs a warning and drops it. A key expires at its `expiresAt` or after
`AUTH_OPTIONS.sessionTtlSeconds`, whichever comes first; a user's own `sessionTtlSeconds` is not
inherited.

**A key that does not work gets a 401**, on public endpoints too, and never falls back to the cookie
the browser may also be sending — a typo in a key would otherwise quietly succeed as somebody else.
An unknown and a revoked key answer identically, and only the last four characters are echoed back.

Who the key acts as decides what it is:

- **A service key** acts as a `kind: "service"` user — a machine identity, reachable only through a
  key, left out of the picker, and still a user in every other respect: it has claims and an inbox.
- **A personal access token** acts as a person from the picker. It is the same entry, pointed at a
  human user and usually narrowed and given an expiry, the way GitHub or GitLab hand out a token for
  a script that should run as you, with less than you may:

  ```ts
  { token: "pat-alice-reports", user: "alice", label: "alice: reports script", roles: ["user"], expiresAt: "2026-12-31T23:59:59Z" },
  ```

  Fixtures see it as alice — `req.user.key` is `"alice"`, her inbox is hers — with `via: "api-key"`,
  so a `{ via: "session" }` endpoint still refuses it.

A fixture tells the two apart by `req.user.kind`, `"service"` or `"human"`; `whoami` answers it too:

```ts
middleware: [(res, req) => {
  if (req.user?.via === "api-key" && req.user.kind === "human") res.headers.push({ "X-Acting-As": req.user.key });
}],
```

The tokens are plaintext in the file. That is the point of a fixture; never put a token there that is
real somewhere else.

## Push notifications

pico-mock pushes over a **long-lived http response**, not WebSockets. One bus, two framings:

| | |
|---|---|
| a fixture with a `stream` case | `application/x-ndjson`, one message per line — what an app consumes |
| `GET /api/_pico-mock/sse` | `text/event-stream`, the raw bus, for `curl -N` |

Both need a session or an api key, re-check it before every message and end once it is gone. A
heartbeat ticks every 20 s without an event name, so an open stream proves itself and notices a
logout within 20 s.

### A streaming fixture

```ts
// mock/data/v1/notifications/stream.GET.ts  ->  GET /api/v1/notifications:stream
cases: [
  {
    contentType: "application/x-ndjson",   // the only one a streaming fixture may use
    stream: {
      // `name` is undefined for the heartbeat. Return undefined to drop a message.
      map: (name, payload) => ({ [name ?? "message"]: payload }),
      // optional: sent once when the stream opens
      open: (send, req) => send({ hello: req.user?.key }),
    },
  },
],
```

The fixture never sees the connection. `body`, `delay` and `withEtag()` mean nothing to a stream. An
edit reaches an open stream on its next reconnect.

### Notifying from a middleware

```ts
res.notify("cube_created", { cube_id: id });                        // everyone, the default
res.notify("notifications_read", { unread_count }, { to: "self" }); // the user's other tabs
```

The message goes out once the response is **on the wire**, never before it, so a client that refetches
on `cube_created` cannot race its own POST. Only the case that actually ran notifies.

| `to` | reaches |
|---|---|
| `"all"` | every open stream — the default |
| `"others"` | everyone but the user of the request |
| `"self"` | only the user of the request, in every tab |
| `{ users: ["alice"] }` | the named users |
| `{ roles: ["admin"] }` | the users holding at least one of the roles |

Without a principal on the request, `"others"` means everyone and `"self"` nobody.

### The inbox

An event is data sync: nothing is stored. A message meant for a person goes into an inbox:

```ts
res.inbox({ to: "others", event: "cube_created", title: `${req.user?.claims.name} created a cube`, text: name });
```

Every user `to` names — out of `users.ts`, signed in or not — gets a notification in their inbox, and
their open streams get it as `notification_created`. The inboxes live in memory; serve them from your
own fixtures with `createInbox()`:

```ts
import { createInbox } from "@furo/vite-pico-mock/helpers";

const inbox = createInbox();
inbox.list(req.user.key, { unreadOnly: true });
inbox.markRead(req.user.key, ["01M…"]);   // or "all"; answers the unread count
```

A notification is `{ id, event, title, text, sender, create_time, read }` and every inbox starts with
a welcome entry. Both can be changed with the [`inbox`](#inbox) option:

```ts
picoMock({
  inbox: {
    event: "notification_created",                         // the stream event of a delivery
    seed: () => [],                                        // what a fresh inbox holds
    mint: (entry, sender, now) => ({ ...mintNotification(entry, sender, now), priority: "normal" }),
  },
});
```

Send one by hand to act as another user without a second browser — the sender is the principal of the
request:

```sh
curl -X POST -H 'content-type: application/json' -b 'pico_mock_session=…' \
  -d '{"to":{"users":["alice"]},"title":"Please review cube 42"}' \
  localhost:5173/api/_pico-mock/notify
```

## Without the plugin

```ts
import { createPicoMock, startPicoMock } from "@furo/vite-pico-mock";

// a server of its own, on 10000 or the next free port
const { port } = await startPicoMock({ dir: "mock", port: 10000 });

// or a node request handler to mount yourself
const mock = createPicoMock({ dir: "mock" });
const handler = mock.callback();          // (req, res) => Promise<void>
if (mock.handles(req.url)) await handler(req, res);
```

Both take the [options](#options) of the plugin except `standalonePort`; `startPicoMock` also takes
[`port`, `host` and `maxAttempts`](#startpicomock-only). vite is still a peer dependency: it is what
imports the TypeScript fixtures.

## Claude Code skill

The package ships a [Claude Code](https://docs.claude.com/en/docs/claude-code) skill that teaches an
agent to write fixtures the way this README describes: url to file, the envelope, `auth`,
middleware and its order, streams, and the traps. Copy it into the project, and again after an
upgrade:

```sh
rm -rf .claude/skills/vite-pico-mock && cp -R node_modules/@furo/vite-pico-mock/skills/vite-pico-mock .claude/skills/
```

It knows the server, not your api. If your project generates its client from protos or OpenAPI, a
small project skill that says where the url and the wire type of an endpoint are written down
completes it.

## Limits

- **In memory.** Sessions, inboxes and the sequence counters are gone after a restart; so is any
  store a fixture keeps on `globalThis`.
- **Json in, anything out.** A request body is parsed when it is `application/json`, and is
  `undefined` otherwise.
- **Request scoped pushes.** `res.notify` exists for the duration of a request; nothing pushes on a
  timer but the heartbeat.
- **ndjson only** for a streaming fixture; the SSE framing is the gateway's.
- **No WebSockets.**
- **Revoking a key does not close an open stream.** It is refused on the next request and the next
  reconnect; an `expiresAt` running out does end the stream, within one heartbeat.
