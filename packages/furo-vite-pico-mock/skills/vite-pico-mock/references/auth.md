# Auth

pico-mock plays the gateway an app usually sits behind (OIDC, Entra ID, a BFF). The browser proves
itself with an HttpOnly session cookie, a script or another server with an api key. Both arrive at a
fixture as the same thing: `req.user`.

## Declaring it on a fixture

`auth` sits on the `MockData`, next to `sequence` — not on a case.

| value | means |
|---|---|
| `"required"` | any principal at all |
| `{ roles: ["admin"] }` | a principal holding **at least one** of the roles |
| `{ via: "session" }` | browser only |
| `{ via: "api-key" }` | machine only |
| `{ roles: [...], via: ... }` | both; each part optional |
| absent | public — `req.user` is still filled when a credential is present |

No credential → **401**; authenticated but wrong role or kind → **403**. Both are answered before a
case is picked, shaped by `formatError` (default `google.rpc.Status`, code 16 and 7). `auth` is per
file: a literal-id override does not inherit the template's.

## Reading the principal

```typescript
interface MockSession {
  key: string;                 // the user's key in users.ts; for an api key, the user it acts as
  claims: MockClaims;          // as at session start, or as the api key narrowed them
  token: string;               // HS256 JWT, the bearer a BFF would forward; never reaches the browser
  expiresAt: number;           // epoch ms
  via: "session" | "api-key";
  kind: "human" | "service";   // tells a service key from a personal access token
  apiKey?: string;             // the key's label, never the token
}
```

`MockClaims` uses OIDC names — `sub`, `preferred_username`, `name`, `given_name`, `family_name`,
`email`, `roles`, `features` — plus an index signature for whatever else the real tokens carry.

```typescript
const fromSession: MockMiddleware<Profile> = (res, req) => {
  // `auth: "required"` keeps a request without a session from getting here
  if (!req.user || !res.body) return;
  res.body.display_name = req.user.claims.name ?? req.user.key;
};
```

The guard is for the typechecker; `auth` already refused anyone without a principal. Per-user data
belongs in the resource's own `_` store, keyed by `req.user.key`.

## The users file

`<dir>/auth/users.ts`, re-imported per request — an added user shows up in the picker right away.
An existing session keeps the claims it started with; sign in again to pick up an edit.

```typescript
import type { MockAuthOptions, MockUser } from "@furo/vite-pico-mock/types";

export const USERS: MockUser[] = [
  { key: "admin", claims: { sub: "u0", name: "Ada Admin", email: "ada@example.com", roles: ["admin", "user"], features: [] } },
  { key: "alice", claims: { sub: "u1", name: "Alice Example", email: "alice@example.com", roles: ["user"], features: [] } },
  { key: "bob", sessionTtlSeconds: 60, claims: { sub: "u2", name: "Bob", roles: ["user"], features: [] } }, // re-auth flow
  { key: "ci-bot", kind: "service", claims: { sub: "svc1", name: "CI", roles: ["service"], features: [] } }, // api key only
];

export const AUTH_OPTIONS: Partial<MockAuthOptions> = { sessionTtlSeconds: 8 * 60 * 60, secureCookie: false };
```

Without the file there are no users and every `auth` endpoint answers 401. Keep `secureCookie`
off for plain `http://localhost` — Safari drops a `Secure` cookie there.

## Api keys

`<dir>/auth/apiKeys.ts`, also re-imported per request.

```typescript
import type { MockApiKey } from "@furo/vite-pico-mock/types";

export const API_KEYS: MockApiKey[] = [
  { token: "api-key-ci-bot", user: "ci-bot", label: "ci-bot" },                      // service key
  { token: "pat-alice-readonly", user: "alice", roles: ["user"], features: [] },     // PAT, narrowed
  { token: "api-key-expired", user: "alice", expiresAt: "2020-01-01T00:00:00Z" },    // the 401 path
  { token: "api-key-revoked", user: "alice", disabled: true },                       // the 401 path
];
```

- **A key is a credential, not a principal.** It acts as a user from `users.ts`; fixtures see that
  user, with `via: "api-key"`.
- **A key can only take away.** `roles` / `features` are intersected with the user's; absent means
  all, `[]` means none.
- **A present `authorization` header never falls back to the cookie.** A bad key gets a 401 even on
  public endpoints, so a typo cannot quietly succeed as whoever the browser is.
- Unknown and revoked keys answer identically; tokens are echoed only as their last four characters.
- Tokens are plaintext. Never put one there that is real somewhere else.

## Gateway routes

Under `gatewayPrefix` (default `/api/_pico-mock/`), built in, never fixtures, all `no-store`:

| route | what it does |
|---|---|
| `login` | the user picker; `?user=alice&return=/` signs in, 303 + `Set-Cookie` |
| `logout` | ends the session, 303 back to the picker |
| `whoami` | the principal as json, 401 without one; takes an api key |
| `sse` | the push bus as `text/event-stream` |
| `notify` | `POST {to, title, text?, event?}`, sender is the request's principal |

`loginPath` (`/auth.html`) and `logoutPath` (`/logout.html`) serve the same as pages the app can
redirect to. A PWA's service worker must let both reach the network.

## Exercising a protected fixture

```bash
# as a machine
curl -s -H "authorization: Bearer api-key-ci-bot" localhost:5173/api/v1/books | jq .

# the 401 path
curl -s -H "authorization: Bearer api-key-revoked" localhost:5173/api/v1/books | jq .code   # 16

# as a browser: keep the cookie the picker sets, then reuse it
curl -s -c /tmp/pm.jar "localhost:5173/api/_pico-mock/login?user=alice&return=/" -o /dev/null
curl -s -b /tmp/pm.jar localhost:5173/api/v1/books | jq .
curl -s -b /tmp/pm.jar localhost:5173/api/_pico-mock/whoami | jq .
```
