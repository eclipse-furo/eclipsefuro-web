export type SubscriptionToken = symbol;

export class Message<T> {
  /**
   * A list of listeners, each containing a callback function and a flag indicating whether it should be triggered only once.
   */
  public listeners: { callback: (data: T) => void; once: boolean; token: SubscriptionToken }[] = [];
}

/**
 * ### `ChannelAPI` – A TypeScript Pub/Sub Utility
 * The `ChannelAPI` class is a lightweight, type‑safe publish/subscribe implementation that works with any object describing your channels.
 *
 * It’s designed for use in a Lit‑based front‑end (or any TypeScript project) where you want to:
 *
 * - **Publish** events to named channels.
 * - **Subscribe** to those events with optional “once” semantics.
 * - **Unsubscribe** via a token returned at subscription time.
 *
 *
 */
export class ChannelAPI<CHANNELS> {
  private readonly channels: CHANNELS;

  /**
   * Constructs a new ChannelAPI instance with the specified channels.
   * @param channels - An object containing all the channels.
   */
  constructor(channels: CHANNELS) {
    this.channels = channels;
  }

  /**
   * Subscribes to a channel to receive messages.
   * @param channel - The name of the channel to subscribe to.
   * @param callback - The function to call when a message is received on the channel.
   * @param once - Set to `true` if you want to unsubscribe after receiving one message. Defaults to `false`.   */
  subscribe<K extends keyof CHANNELS, C extends CHANNELS[K]>(
    channel: K & string,
    callback: (data: C extends Message<infer X> ? X : undefined) => void,
    once: boolean = false
  ): SubscriptionToken {
    const token = Symbol(channel);
    (this.channels[channel] as Message<never>).listeners.push({ callback, once, token });
    return token;
  }

  /**
   * Unsubscribes from a channel to stop receiving messages.
   * @param channel - The name of the channel to unsubscribe from.
   * @param callback - The function used to subscribe to the channel.
   */
  unsubscribe(token: SubscriptionToken) {
    for (const channel of Object.values(this.channels as ArrayLike<Message<never>>)) {
      const { listeners } = channel;
      const index = listeners.findIndex(l => l.token === token);
      if (index !== -1) {
        listeners.splice(index, 1);
        return;
      }
    }
  }

  /**
   * Publishes a message to a channel for subscribers to receive.
   * @param channel - The name of the channel to send the message to.
   * @param data - The data to be sent as a message.
   */
  publish<K extends keyof CHANNELS, C extends CHANNELS[K]>(channel: K & string, data: C extends Message<infer X> ? X : undefined) {
    const { listeners } = this.channels[channel] as Message<unknown>;
    if (!listeners.length) return; // <-- guard
    for (let i = 0; i < listeners.length; i += 1) {
      const listener = listeners[i];
      if (listener) {
        listener.callback(data);
        if (listener.once) {
          listeners.splice(i, 1);
          i -= 1; // Adjust the index after removal
        }
      }
    }
  }
}
