/**
 * What a fixture or its middleware imports: `@furo/vite-pico-mock/helpers`.
 */

export { first, all } from "./query.js";
export { isObject, deepMerge, applyMask, mergePatch } from "./patch.js";
export { withEtag } from "./etag.js";
export { CursorPagination } from "./CursorPagination.js";
export type { CursorPaginationOptions, PagingMiddleware } from "./CursorPagination.js";
export { Pagination } from "./Pagination.js";
export type { PaginationOptions, PageMiddleware } from "./Pagination.js";

// The inbox and the push bus, for a fixture that serves or feeds them. Both live on globalThis, so
// the copy a fixture imports reaches the same inboxes and streams as the server.
export { createInbox, matches, mintNotification, senderName } from "../Notify.js";
export { publish } from "../Stream.js";
