# Notifications and streams

One event bus carries everything: a fixture announces what a request did, and every open stream
hears it. pico-mock pushes over a long-lived http response, not WebSockets, framed two ways —
ndjson for the app, SSE for curl.

## Pushing from a fixture

`res.notify` and `res.inbox` are on the response, so any middleware can call them.

```typescript
res.notify("book_created", { book_id: id });
res.notify("unread_changed", { unread_count }, { to: "self" });   // the user's other tabs

res.inbox({ to: "others", event: "book_created", title: `${senderName(req.user)} added a book`, text: title });
```

| | `notify` | `inbox` |
|---|---|---|
| what it is | data sync — "something changed, refetch" | a message meant for a person |
| stored | no | yes, in each recipient's inbox |
| reaches | every open stream, narrowed by `to` | every user `to` names, signed in or not |
| pushed as | the `event` name you pass | `notification_created` (option `inbox.event`) |

`event` is the **name of the member** the stream envelope carries, so `"book_created"` goes out as
`{"book_created":{…}}` on ndjson and as `event: book_created` on SSE.

`senderName(session?)` from the helpers gives `claims.name` or `"pico-mock"` — use it so an
unauthenticated push still reads sensibly.

### Who hears it

```typescript
type NotifyTarget = "all" | "others" | "self" | { users: string[] } | { roles: string[] };
```

`"all"` is the default. `"others"` and `"self"` are relative to the user of the request; **without
one, `"others"` means everyone and `"self"` nobody.**

### The ordering guarantee

Both calls are **queued, not emitted**, and drained once the response is on the wire — a client
that refetches on `book_created` cannot overtake its own POST response. Only the case that actually
ran notifies, and messages keep their order.

### Serving the inbox

The inboxes live in memory. Serve them from your own fixtures:

```typescript
import { createInbox } from "@furo/vite-pico-mock/helpers";

const inbox = createInbox();
inbox.list(req.user.key, { unreadOnly: true });
inbox.markRead(req.user.key, ["01M…"]);   // or "all"; returns the unread count
```

A notification is `{ id, event, title, text, sender, create_time, read }`; every inbox starts with a
welcome entry. Change the shape, seed or event with the `inbox` plugin option (`event`, `seed`,
`mint`).

## Writing a streaming fixture

The fixture never sees the connection. It says what a message *is*; pico-mock opens the response,
keeps it alive, re-checks the credential per message, honours `to` and closes when the client goes.

```typescript
interface MockStream<T> {
  map: (name: string | undefined, payload: unknown, req: MockRequest) => T | undefined;
  open?: (send: (message: T) => void, req: MockRequest) => void;
}
```

- **`map`** turns one bus message into one stream message. `name` is what `res.notify` was called
  with, `undefined` for the heartbeat. Return `undefined` to drop a message the stream does not model.
- **`open`** is optional, sent once right after the stream opens — a snapshot or a hello.

See the streaming template in [Templates](templates.md#streaming-ndjson).

Easy to get wrong:

- **`contentType: "application/x-ndjson"` is the only legal one.** Anything else throws.
- `body`, `delay`, `sequence` and `withEtag()` mean nothing on a streaming case.
- Type the case with what the client's stream reader yields per message, which may differ from the
  plain wire body type.
- A fixture edit reaches a stream **on reconnect** only.

## The two framings

| route | content type | who |
|---|---|---|
| a fixture with a `stream` case | `application/x-ndjson` | the app |
| `GET <gatewayPrefix>sse` | `text/event-stream` | curl and debugging |

- **ndjson**: one whole message per line, `{"book_created":{…}}`.
- **SSE**: `event: <name>\ndata: <payload>\n\n`; the heartbeat has no name, so `es.onmessage` works.
- A **heartbeat** every 20 s, `{"count": n}`. It also bounds how long a logged-out session or expired
  key keeps a stream open: the credential is re-checked per message, the stream ends, and the
  client's reconnect gets the 401 that starts its auth flow.
- Each framing sends a **preamble** right away, so a proxy in between forwards the headers and a
  client timeout does not fire while waiting for the first event.

Watch it by hand:

```bash
curl -N -H "authorization: Bearer api-key-ci-bot" localhost:5173/api/v1/events:stream
curl -N -b /tmp/pm.jar localhost:5173/api/_pico-mock/sse

# push one without touching a fixture
curl -s -b /tmp/pm.jar -X POST localhost:5173/api/_pico-mock/notify \
  -H 'content-type: application/json' \
  -d '{"to":"all","title":"hello","text":"from curl"}'
```
