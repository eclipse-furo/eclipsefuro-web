### `ChannelAPI` – A TypeScript Pub/Sub Utility
The `ChannelAPI` class is a lightweight, type‑safe publish/subscribe implementation that works with any object describing your channels.

It’s designed for use in a Lit‑based front‑end (or any TypeScript project) where you want to:

- **Publish** events to named channels.
- **Subscribe** to those events with optional “once” semantics.
- **Unsubscribe** via a token returned at subscription time.

### Example
*config.ts*
```typescript
import { ChannelAPI, Message } from "@furo/channels/dist/ChannelAPI";

// Define your channel shape
type AppChannels = {
  dataUpdated: Message<{ items: number[] }>;
  errorOccurred: Message<string>;
};

// Instantiate
export const AppChannels = new ChannelAPI<AppChannels>({
  dataUpdated: new Message(),
  errorOccurred: new Message()
});
```

*Any file of your app.ts*
```typescript

// Subscribe
const subscritionToken = AppChannels.subscribe('dataUpdated', data => {
  console.log('New items:', data?.items);
});

// Publish
AppChannels.publish('dataUpdated', { items: [1, 2, 3] });

// Unsubscribe
AppChannels.unsubscribe(subscritionToken);
```

> **Note:**
> Publishing and subscribing can be done in complete different parts of your app.

### Type-Safety Highlights
- **Channel names**  are checked against keyof CHANNELS, preventing typos.
- **Payload types**  are inferred from the channel’s Message<T> type, ensuring that callbacks receive the correct data shape.
- **once**  listeners are automatically cleaned up, preventing memory leaks.

### Types
- **SubscriptionToken:** A unique `symbol` that identifies a subscription. It’s returned by `subscribe()` and used to `unsubscribe()`.

### Extending the API
If you need to add more advanced features (e.g., priority listeners, error handling, or async callbacks), you can extend ChannelAPI:

```typescript
class AdvancedChannelAPI<CHANNELS> extends ChannelAPI<CHANNELS> {
  // add new methods or override existing ones
}
```

### More examples:

```typescript
type ApiChannels = {
  userLoggedIn: Message<{ id: string }>;
  ping: Message<void>;
};

const api = new ChannelAPI<ApiChannels>({
  userLoggedIn: new Message(),
  ping: new Message()
});

const token = api.subscribe('userLoggedIn', data => {
  console.log(`User logged in: ${data?.id}`);
});
```
