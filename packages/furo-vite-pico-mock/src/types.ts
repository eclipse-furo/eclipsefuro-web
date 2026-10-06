/**
 * Types for the pico-mock fixture files, and the options of the server.
 *
 * A mock file is a module whose default export is a `MockData`. The response body is typed by `T`,
 * so `npm run typecheck` is what keeps a fixture in sync with the proto it stands in for.
 */

/**
 * A single response header, written as a one entry object: `{ "Cache-Control": "Max-Age=10" }`.
 */
export type MockHeader = Record<string, string>;

/**
 * The claims of a mock user, named the way an OIDC / Entra ID token names them. Add whatever else
 * the real tokens of an app carry; the index signature lets a fixture read it.
 */
export interface MockClaims {
  sub: string;
  preferred_username: string;
  name: string;
  given_name: string;
  family_name: string;
  email: string;
  roles: string[];
  features: string[];
  [claim: string]: unknown;
}

/**
 * A user the mock gateway can sign in, see the users file (`mock/auth/users.ts` by default).
 */
export interface MockUser {
  /**
   * What the picker sends as `?user=`, i.e. `alice`.
   */
  key: string;
  /**
   * A note to the reader, shown nowhere.
   */
  description?: string;
  /**
   * What this identity is. A `"service"` account is a machine: it is reachable through an api key
   * (see the api keys file (`mock/auth/apiKeys.ts` by default)) and never through the browser picker. Defaults to `"human"`.
   *
   * This classifies the *identity*, not the picker. A resource that lists users - "everyone who can
   * receive a notification" - filters on this and on `disabled` itself, rather than inheriting
   * whatever rule the picker happens to use.
   */
  kind?: "human" | "service";
  /**
   * Deactivated: cannot sign in, and no api key naming it resolves. Kept in the file rather than
   * deleted, so the refusal path stays one request away.
   */
  disabled?: boolean;
  /**
   * Overrides `AUTH_OPTIONS.sessionTtlSeconds`, so one user can run into an expired session quickly.
   */
  sessionTtlSeconds?: number;
  claims: MockClaims;
}

/**
 * An api key the mock gateway accepts as `authorization: Bearer <token>`, see
 * the api keys file (`mock/auth/apiKeys.ts` by default).
 *
 * A key is a *credential*, not a principal: it names a user in `users.ts` and acts as them, so a
 * fixture reading `req.user` cannot tell the difference beyond `req.user.via` and `req.user.kind`. `roles` and
 * `features` may only ever **narrow** that user - they are intersected with what the user holds,
 * never added to it.
 */
export interface MockApiKey {
  /**
   * The bearer as a client sends it: `authorization: Bearer api-key-ci-bot`.
   */
  token: string;
  /**
   * The `key` of the user in `users.ts` this key acts as.
   */
  user: string;
  /**
   * A short name for log lines and `whoami`. Defaults to the last four characters of the token, so
   * the token itself never has to be printed.
   */
  label?: string;
  /**
   * A note to the reader, shown nowhere.
   */
  description?: string;
  /**
   * Narrows the user's `roles` by intersection. Absent means all of them. It can never grant one.
   */
  roles?: string[];
  /**
   * Narrows the user's `features` by intersection. Absent means all of them. It can never grant one.
   */
  features?: string[];
  /**
   * RFC 3339. Absent means the key itself does not expire - the principal it resolves to still
   * only lasts `AUTH_OPTIONS.sessionTtlSeconds`, the way a gateway trades a long lived key for a
   * short lived access token.
   */
  expiresAt?: string;
  /**
   * Revoked, but kept in the file rather than deleted so the 401 path stays one request away.
   */
  disabled?: boolean;
}

/**
 * The `AUTH_OPTIONS` export of the users file (`mock/auth/users.ts` by default).
 */
export interface MockAuthOptions {
  sessionTtlSeconds: number;
  /**
   * Whether the session cookie is marked `Secure`.
   */
  secureCookie: boolean;
}

/**
 * The principal of a request, as the mock gateway hands it to a fixture.
 *
 * It is the same shape whichever credential proved it - a session cookie or an api key - which is
 * what lets every fixture read `req.user` without caring.
 */
export interface MockSession {
  /**
   * The `key` of the user in the users file (`mock/auth/users.ts` by default). For an api key that is the user it acts as,
   * so `PROFILES[key]` and a notification aimed at `{ users: [...] }` keep working.
   */
  key: string;
  /**
   * The claims as they were when the session started, or as the api key narrowed them.
   */
  claims: MockClaims;
  /**
   * An HS256 JWT minted from the claims - the bearer token a BFF would forward to the backend. It
   * never reaches the browser.
   */
  token: string;
  /**
   * Epoch milliseconds.
   */
  expiresAt: number;
  /**
   * Which credential proved this principal. A fixture can insist on one with `auth.via`.
   */
  via: "session" | "api-key";
  /**
   * The `kind` of the user, `"human"` when the users file leaves it out. A session is always a
   * human's; for an api key it tells a service key from a personal access token - a key acting as a
   * person.
   */
  kind: "human" | "service";
  /**
   * The `label` of the api key, when `via` is `"api-key"`. Never the token itself.
   */
  apiKey?: string;
}

/**
 * Who may read a fixture.
 *
 * `"required"` wants any principal at all. `{ roles }` wants one holding at least one of the roles,
 * and `{ via }` one that authenticated with that kind of credential - `"session"` for a
 * browser only endpoint, `"api-key"` for a machine only one. Both may be combined, and both are
 * optional, so `{ via: "api-key" }` on its own is legal.
 */
export type MockAuth = "required" | { roles?: string[]; via?: "session" | "api-key" };

/**
 * The incoming request, as far as a mock file cares about it.
 */
export interface MockRequest {
  /**
   * Uppercase http method, `GET`, `PATCH`, ...
   */
  method: string;
  /**
   * The path as received, including the `/api` prefix: `/api/v1/cubes/1`.
   */
  path: string;
  /**
   * The custom method after the colon: `suggest` for `GET /v1/cubes:suggest`.
   */
  customMethod?: string;
  /**
   * The values captured by the `{name}` directories on the way to this file, percent decoded.
   * `data/v1/cubes/{cube_id}/GET.ts` serving `/api/v1/cubes/1` sees `{ cube_id: "1" }`.
   */
  params: Record<string, string>;
  /**
   * Query params, percent decoded. A key that occurs more than once (`?tag=a&tag=b`) arrives as an
   * array, a key that occurs once as a string.
   */
  query: Record<string, string | string[]>;
  /**
   * The parsed json request body, `undefined` when the request carries none.
   */
  body: unknown;
  /**
   * Request headers, keys lowercased.
   */
  headers: Record<string, string>;
  /**
   * The signed in user, `undefined` when the browser holds no valid session. A fixture with `auth`
   * set never runs without one.
   */
  user?: MockSession;
}

/**
 * The response being assembled. Middleware mutates it in place.
 *
 * This is the resolved form of a `MockCase`: the server has filled in the defaults, so middleware
 * never has to deal with an undefined status or a missing headers array.
 */
export interface MockResponse<T> {
  status: number;
  contentType: string;
  delay: number;
  headers: MockHeader[];
  /**
   * Set it to `undefined` to answer with an empty body.
   */
  body?: T;
  /**
   * Answer with a differently shaped body than the case declares - an error status, a redirect, a
   * 204. `T` is the happy path, so a `google.rpc.Status` would not fit into `body`:
   *
   * ```ts
   * res.replace<IStatus>({
   *   status: 404,
   *   body: { error: "not_found", message: `cube ${req.params.cube_id} does not exist`, code: 5, details: [] },
   * });
   * ```
   *
   * Anything left out keeps its current value, except `body`, which is cleared when omitted.
   */
  // `U` appears once on purpose: it is how the caller states the shape of the replacement body,
  // `res.replace<IStatus>({ ... })`, not something inferred from an argument.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  replace<U>(next: { status: number; body?: U; contentType?: string; headers?: MockHeader[]; delay?: number }): void;
  /**
   * Announce what this request did to every open stream:
   *
   * ```ts
   * res.notify("cube_created", { cube_id: id, display_name: created.display_name });
   * ```
   *
   * The message is queued and sent once the response is on the wire, never before it, so a client
   * that refetches when it hears `cube_created` cannot overtake its own POST response. Call it as
   * often as a middleware needs to; the messages keep their order.
   *
   * `event` names the `payload` member of the envelope the stream carries, so `"cube_created"`
   * goes out as `{"cube_created":{…}}` on `/api/v1/notifications:stream` and as
   * `event: cube_created` on `/api/_pico-mock/sse`. The heartbeat is the only message without a
   * name.
   *
   * An event is data sync and reaches every open stream unless `to` narrows it, i.e.
   * `{ to: "self" }` for the other tabs of the signed in user. Nothing is stored; for a message meant
   * for a person use `inbox`.
   */
  notify(event: string, payload: unknown, options?: MockNotifyOptions): void;
  /**
   * Put a notification into the inbox of every user `to` names, signed in or not, and push it to
   * their open streams as `notification_created`:
   *
   * ```ts
   * res.inbox({ to: "others", event: "cube_created", title: `${req.user?.claims.name} created a cube`, text: created.display_name });
   * ```
   *
   * Queued like `notify`, so it is delivered once the response is on the wire.
   */
  inbox(entry: MockInboxEntry): void;
}

/**
 * Who a push reaches. `"others"` and `"self"` are relative to the signed in user of the request that
 * pushes: without one `"others"` means everyone and `"self"` nobody.
 */
export type NotifyTarget = "all" | "others" | "self" | { users: string[] } | { roles: string[] };

export interface MockNotifyOptions {
  /**
   * Defaults to `"all"`.
   */
  to?: NotifyTarget;
}

/**
 * What `res.inbox` takes. The server fills in the id, the sender, the time and the read flag.
 */
export interface MockInboxEntry {
  to: NotifyTarget;
  title: string;
  text?: string;
  /**
   * What happened, i.e. `cube_created`. Defaults to `notification`.
   */
  event?: string;
}

/**
 * A notification as the inbox stores it. The default `mintNotification` fills exactly these fields;
 * an `inbox.mint` of your own may add more, see `InboxOptions`.
 */
export interface MockNotification {
  id: string;
  event: string;
  title: string;
  text: string;
  sender: string;
  /**
   * RFC 3339, the json form of a google.protobuf.Timestamp.
   */
  create_time: string;
  read: boolean;
  [field: string]: unknown;
}

/**
 * Shapes the response from the request, so one mock file can answer for every query param
 * combination and every id instead of needing a file per variant.
 *
 * The middleware of a case run in array order and each one is awaited.
 */
export type MockMiddleware<T> = (res: MockResponse<T>, req: MockRequest) => void | Promise<void>;

/**
 * One possible response of an endpoint.
 */
export interface MockCase<T> {
  /**
   * A note to the reader. Json has no comments, this carried the explanation there; in a `.ts`
   * mock a normal comment does the job just as well.
   */
  description?: string;
  /**
   * Http status code of the response, defaults to 200.
   */
  status?: number;
  /**
   * Content-Type of the response, defaults to `application/json; charset=utf-8`.
   */
  contentType?: string;
  /**
   * Artificial delay in milliseconds before the response is sent, to simulate slow requests.
   */
  delay?: number;
  /**
   * Additional response headers. They are applied after the Content-Type, so one of them can
   * override it.
   */
  headers?: MockHeader[];
  /**
   * The static part of the response body. Omit it when the middleware produces the whole body.
   */
  body?: T;
  /**
   * Run in order once this case has been picked. Each one may change the status, the headers and
   * the body, so a case can answer 404 for an unknown id or filter a list by `?query=`.
   */
  middleware?: MockMiddleware<T>[];
  /**
   * Answer with a long-lived stream instead of a body.
   *
   * The response stays open and is fed by the same bus `res.notify` pushes to, so a fixture can
   * model a server streaming rpc. `body`, `delay` and the middleware's `res.body` are unused - the
   * case answers with lines, not with a document.
   *
   * Only `application/x-ndjson` is framed here: one whole `T` per line, which is plain proto3 json
   * and what a generated `StreamFetcher` consumes. The SSE view of the same bus lives at
   * `/api/_pico-mock/sse`.
   */
  stream?: MockStream<T>;
}

/**
 * How a streaming case turns the push bus into its own messages.
 *
 * A fixture never sees the connection - no `ctx`, no socket. It says what a message *is*, and
 * pico-mock does the rest: opening the response, keeping it alive, re-checking the
 * credential per message, honouring `to`, and closing down when the client goes away.
 */
export interface MockStream<T> {
  /**
   * Turn one bus message into a message of this stream, or return undefined to drop it.
   *
   * `name` is the event name `res.notify` was called with, and is undefined for the heartbeat.
   * `payload` is the parsed json it carried.
   *
   * ```ts
   * map: (name, payload) => ({ [name ?? "message"]: payload }) as IStreamNotificationsResponse
   * ```
   */
  map: (name: string | undefined, payload: unknown, req: MockRequest) => T | undefined;
  /**
   * Sent once, right after the stream opens - a snapshot, or a hello. Optional; most streams only
   * carry what happens next.
   */
  open?: (send: (message: T) => void, req: MockRequest) => void;
}

/**
 * A mock for a single endpoint.
 *
 * `T` is the tuple of body types, one per case, i.e. `MockData<[TProfileEntity, string]>` types the
 * first case as a profile entity and the second one as a plain string.
 *
 * The `sequence` contains indexes into `cases` and is rotated on every request, so an endpoint can
 * answer differently on consecutive calls, i.e. `[0, 0, 1]` answers twice with case 0, then once
 * with case 1, then starts over. It defaults to `[0]`.
 *
 * `auth` makes the endpoint non public: without a session it answers 401, with a session that lacks
 * the roles 403 - both before a case is picked, so a refusal does not advance the `sequence`.
 * Without `auth` the endpoint is public, and `req.user` is still filled when there is a session.
 */
export interface MockData<T extends unknown[] = unknown[]> {
  description?: string;
  auth?: MockAuth;
  sequence?: number[];
  cases: { [K in keyof T]: MockCase<T[K]> };
}

/**
 * How the inboxes behind `res.inbox()` behave. Every member is optional, the defaults fit an api
 * whose notification is `MockNotification`.
 */
export interface InboxOptions {
  /**
   * The event name a delivered notification reaches the open streams with. Defaults to
   * `notification_created`.
   */
  event?: string;
  /**
   * What an inbox holds before anything was delivered to it. Defaults to one welcome entry.
   */
  seed?: () => MockNotification[];
  /**
   * Turn an inbox entry into the notification that is stored and pushed, for an api whose
   * notification looks different from `MockNotification`. Keep `id` and `read`: the inbox marks
   * notifications read by them.
   */
  mint?: (entry: MockInboxEntry, sender: string, now: number) => MockNotification;
}

/**
 * Why the mock refuses or fails a request, before it is turned into a body by `formatError`.
 */
export interface MockError {
  /**
   * The http status the response goes out with.
   */
  status: number;
  /**
   * A short machine readable reason, i.e. `unauthenticated` or `pico_mock_no_fixture`.
   */
  error: string;
  /**
   * The explanation for the developer reading the response.
   */
  message: string;
}

/**
 * Options of `createPicoMock`, `startPicoMock` and the vite plugin. Every member is optional.
 *
 * Paths are relative to `root` unless they are absolute.
 */
export interface PicoMockOptions {
  /**
   * The project root. The plugin passes vite's `root`, everything else defaults to `process.cwd()`.
   */
  root?: string;
  /**
   * The directory holding `data/` and `auth/`. Defaults to `mock`.
   */
  dir?: string;
  /**
   * The fixture tree. Defaults to `<dir>/data`.
   */
  dataDir?: string;
  /**
   * The users, a module exporting `USERS` and optionally `AUTH_OPTIONS`. Defaults to
   * `<dir>/auth/users.ts`. A missing file means there are no users: every endpoint with `auth`
   * answers 401 and the picker says where to add one.
   */
  usersFile?: string;
  /**
   * The api keys, a module exporting `API_KEYS`. Defaults to `<dir>/auth/apiKeys.ts`, a missing file
   * means there are none.
   */
  apiKeysFile?: string;
  /**
   * The url prefix the fixtures are served under. It is not part of the tree, so
   * `/api/v1/cubes` is served from `<dataDir>/v1/cubes/GET.ts`. Defaults to `/api/`.
   */
  apiPrefix?: string;
  /**
   * The built-in routes of the mock gateway: `login`, `logout`, `whoami`, `sse` and `notify`.
   * Defaults to `<apiPrefix>_pico-mock/`.
   */
  gatewayPrefix?: string;
  /**
   * The page the app sends the browser to when it needs a login, served as the user picker.
   * Defaults to `/auth.html`, `false` serves none.
   */
  loginPath?: string | false;
  /**
   * The page the app sends the browser to for a logout. Defaults to `/logout.html`, `false` serves
   * none.
   */
  logoutPath?: string | false;
  /**
   * Import aliases for the fixtures, in vite's `resolve.alias` form. The fixtures are loaded through
   * vite's module runner, which reads no config file, so the aliases have to be handed over. The
   * plugin passes the ones of the vite config; these are added on top.
   */
  aliases?: Record<string, string> | { find: string | RegExp; replacement: string }[];
  /**
   * The body of an error the mock produces itself - no fixture, no session, an unknown api key, an
   * exception in a middleware. Defaults to a google.rpc.Status: `{ error, message, code, details }`.
   */
  formatError?: (error: MockError) => unknown;
  /**
   * How `res.inbox()` stores and pushes.
   */
  inbox?: InboxOptions;
}

/**
 * The plugin's options: the server's, plus what only a dev server has.
 */
export interface PicoMockPluginOptions extends PicoMockOptions {
  /**
   * Also listen on a port of its own, next to vite, for a client that should reach the mock without
   * the dev server in between - an IntelliJ `.http` file, a test runner. The next free port is taken
   * when this one is in use. Off by default.
   */
  standalonePort?: number;
}
