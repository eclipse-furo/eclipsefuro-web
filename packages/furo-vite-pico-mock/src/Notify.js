/**
 * pico-mock's notifications - who a push reaches, and the inbox every user has.
 *
 * Two kinds of push go through here:
 *
 * - an **event** (`res.notify`) is data sync, like `cube_created`: live only, nothing is stored.
 * - a **notification** (`res.inbox`) is meant for a person: it lands in the inbox of every recipient,
 *   signed in or not, and reaches their open streams as `notification_created` (the `inbox.event`
 *   option).
 */

import { ulid } from "ulid";

/** @typedef {import('./types.js').NotifyTarget} NotifyTarget */
/** @typedef {import('./types.js').MockInboxEntry} MockInboxEntry */
/** @typedef {import('./types.js').MockNotification} MockNotification */
/** @typedef {import('./types.js').MockSession} MockSession */
/** @typedef {import('./types.js').InboxOptions} InboxOptions */

/**
 * Whether a push aimed at `to` reaches `recipient`.
 *
 * `"others"` and `"self"` are relative to the sender, the signed in user of the request that pushed.
 * Without a sender `"others"` means everyone and `"self"` nobody. A recipient without a session only
 * hears what goes to `"all"` - that is the heartbeat, streams are signed in otherwise.
 *
 * @param {NotifyTarget | undefined} to - Defaults to `"all"`.
 * @param {{ key: string, roles: string[] } | undefined} recipient
 * @param {string | undefined} senderKey
 * @return {boolean}
 */
export function matches(to, recipient, senderKey) {
  const target = to ?? "all";
  if (target === "all") return true;
  if (!recipient) return false;
  if (target === "others") return recipient.key !== senderKey;
  if (target === "self") return senderKey !== undefined && recipient.key === senderKey;
  if ("users" in target) return target.users.includes(recipient.key);
  return target.roles.some((role) => recipient.roles.includes(role));
}

/**
 * The display name a push is attributed to.
 *
 * Without a principal it is the mock server itself, the way the `welcome()` seed below is - a push
 * nobody signed for came from the mock, not from a person.
 *
 * @param {MockSession | undefined} session - `req.user`, or the principal of the request.
 * @return {string}
 */
export function senderName(session) {
  return session?.claims.name ?? "pico-mock";
}

/**
 * A notification as the inbox stores it and the api serves it, by default. The `inbox.mint` option
 * replaces it for an api whose notification looks different.
 *
 * @param {MockInboxEntry} entry
 * @param {string} sender - Display name of whoever caused it.
 * @param {number} [now] - Epoch milliseconds.
 * @return {MockNotification}
 */
export function mintNotification(entry, sender, now = Date.now()) {
  return {
    id: ulid(now),
    event: entry.event ?? "notification",
    title: entry.title,
    text: entry.text ?? "",
    sender,
    create_time: new Date(now).toISOString(),
    read: false,
  };
}

/**
 * What an inbox holds before anything was delivered to it, so the bell has something to show on a
 * fresh start.
 *
 * @return {MockNotification[]}
 */
const welcome = () => [
  mintNotification({ to: "all", event: "welcome", title: "Welcome to the mock", text: "Notifications meant for you show up here." }, "pico-mock"),
];

/**
 * How the inboxes are configured, see `InboxOptions`. On globalThis rather than in the module: the
 * fixtures import this file through vite's module runner, which may well hand them a different copy
 * of it than the one the server runs on - and the seed has to be the same for both.
 *
 * @return {InboxOptions}
 */
function inboxConfig() {
  const store = /** @type {Record<symbol, InboxOptions | undefined>} */ (/** @type {unknown} */ (globalThis));
  return store[Symbol.for("pico-mock.inbox.config")] ?? {};
}

/**
 * Configure the inboxes of the running server. The server calls it with its `inbox` option.
 *
 * @param {InboxOptions} options
 */
export function configureInbox(options) {
  const store = /** @type {Record<symbol, InboxOptions | undefined>} */ (/** @type {unknown} */ (globalThis));
  store[Symbol.for("pico-mock.inbox.config")] = { ...options };
}

/**
 * Mint a notification the way the server is configured to.
 *
 * @param {MockInboxEntry} entry
 * @param {string} sender
 * @param {number} [now]
 * @return {MockNotification}
 */
export function mintConfigured(entry, sender, now = Date.now()) {
  return (inboxConfig().mint ?? mintNotification)(entry, sender, now);
}

/**
 * The event name an inbox delivery reaches the open streams with.
 *
 * @return {string}
 */
export function inboxEvent() {
  return inboxConfig().event ?? "notification_created";
}

/**
 * What a fresh inbox starts with: the configured seed, the welcome entry otherwise.
 *
 * @return {MockNotification[]}
 */
const configuredSeed = () => (inboxConfig().seed ?? welcome)();

/**
 * The inboxes of the running server.
 *
 * Kept on globalThis, the way the sessions are: the server delivers into it and the fixtures that
 * serve the inbox read from it, and a fixture is re-imported on every request.
 *
 * @return {Map<string, MockNotification[]>}
 */
function globalInboxes() {
  const key = Symbol.for("pico-mock.inbox");
  const store = /** @type {Record<symbol, Map<string, MockNotification[]> | undefined>} */ (/** @type {unknown} */ (globalThis));
  return (store[key] ??= new Map());
}

/**
 * The inboxes, keyed by the user's `key`. The server and the fixtures use the global ones, a spec
 * passes its own map and seed.
 *
 * @param {Map<string, MockNotification[]>} [store]
 * @param {() => MockNotification[]} [seed] - What a user's inbox starts with.
 */
export function createInbox(store = globalInboxes(), seed = configuredSeed) {
  /**
   * @param {string} key
   * @return {MockNotification[]}
   */
  const inboxOf = (key) => {
    let inbox = store.get(key);
    if (!inbox) {
      inbox = seed();
      store.set(key, inbox);
    }
    return inbox;
  };

  /**
   * @param {string} key
   * @return {number}
   */
  const unreadCount = (key) => inboxOf(key).filter((n) => !n.read).length;

  return {
    /**
     * Put a notification on top of a user's inbox.
     *
     * @param {string} key
     * @param {MockNotification} notification
     */
    deliver(key, notification) {
      inboxOf(key).unshift(notification);
    },

    /**
     * A user's notifications, newest first. The array is a copy, the notifications are not.
     *
     * @param {string} key
     * @param {{ unreadOnly?: boolean }} [options]
     * @return {MockNotification[]}
     */
    list(key, { unreadOnly = false } = {}) {
      const inbox = inboxOf(key);
      return unreadOnly ? inbox.filter((n) => !n.read) : [...inbox];
    },

    /**
     * @param {string} key
     * @param {string[] | "all"} ids
     * @return {number} What is left unread.
     */
    markRead(key, ids) {
      inboxOf(key).forEach((n) => {
        if (ids === "all" || ids.includes(n.id)) n.read = true;
      });
      return unreadCount(key);
    },

    unreadCount,
  };
}
