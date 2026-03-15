/**
 * ### EntityServiceEventType
 *
 * Standard event types dispatched by entity services.
 * These events cover the full lifecycle of REST API operations.
 *
 * #### Request Lifecycle Events
 * | Event              | Description                                           |
 * |--------------------|-------------------------------------------------------|
 * | `busy-changed`     | Loading/saving state changed                          |
 * | `request-started`  | Request has been initiated                            |
 * | `request-finished` | Request completed (success, error, or abort)          |
 * | `request-aborted`  | Request was aborted (navigation, timeout, new request)|
 *
 * #### Success Events
 * | Event              | Description                                           |
 * |--------------------|-------------------------------------------------------|
 * | `response-received`| Successful response with parsed data                  |
 * | `raw-response`     | Successful response (raw, before parsing)             |
 *
 * #### Error Events
 * | Event              | Description                                           |
 * |--------------------|-------------------------------------------------------|
 * | `response-error`   | Any error response (4xx/5xx) with parsed body         |
 * | `raw-error`        | Any error response (raw, before parsing)              |
 * | `error-404`        | Resource not found (404)                              |
 * | `error-5xx`        | Server error (500+)                                   |
 * | `fatal-error`      | Unhandled/unexpected error                            |
 *
 * Usage:
 * ```typescript
 * export type MyServiceEventType = EntityServiceEventType;
 * // Or extend with custom events:
 * export type MyServiceEventType = EntityServiceEventType | "custom-event";
 * ```
 */
export type EntityServiceEventType =
  // Request lifecycle
  | "busy-changed"
  | "request-started"
  | "request-finished"
  | "request-aborted"
  // Success
  | "response-received"
  | "raw-response"
  // Errors
  | "response-error"
  | "raw-error"
  | "error-404"
  | "error-5xx"
  | "fatal-error";

/**
 * ### EntityServiceEventMap
 *
 * Maps each event type to its detail payload type.
 * This enables type-safe event handling with `storeBindings`.
 *
 * #### Request Lifecycle Events
 * | Event              | Detail Type                                      |
 * |--------------------|--------------------------------------------------|
 * | `busy-changed`     | `{ busy: boolean }`                              |
 * | `request-started`  | `{ request: unknown }`                           |
 * | `request-finished` | `{ request: unknown }`                           |
 * | `request-aborted`  | `{ reason: string }`                             |
 *
 * #### Success Events
 * | Event              | Detail Type                                      |
 * |--------------------|--------------------------------------------------|
 * | `response-received`| `{ response: unknown, serverResponse: Response }`|
 * | `raw-response`     | `{ serverResponse: Response }`                   |
 *
 * #### Error Events
 * | Event              | Detail Type                                      |
 * |--------------------|--------------------------------------------------|
 * | `response-error`   | `{ parsedResponse: unknown, serverResponse: Response }` |
 * | `raw-error`        | `{ serverResponse: Response }`                   |
 * | `error-404`        | `{ serverResponse: Response }`                   |
 * | `error-5xx`        | `{ serverResponse: Response }`                   |
 * | `fatal-error`      | `{ error: unknown }`                             |
 *
 * Usage:
 * ```typescript
 * // Extend with custom events:
 * interface MyServiceEventMap extends EntityServiceEventMap {
 *   "custom-event": { data: string };
 * }
 * ```
 */
export interface EntityServiceEventMap {
  // Request lifecycle
  "busy-changed": { busy: boolean };
  "request-started": { request: unknown };
  "request-finished": { request: unknown };
  "request-aborted": { reason: string };
  // Success
  "response-received": { response: unknown; serverResponse: Response };
  "raw-response": { serverResponse: Response };
  // Errors
  "response-error": { parsedResponse: unknown; serverResponse: Response };
  "raw-error": { serverResponse: Response };
  "error-404": { serverResponse: Response };
  "error-5xx": { serverResponse: Response };
  "fatal-error": { error: unknown };
}

/**
 * ### TypedEntityService
 *
 * Type alias for entity services with type-safe event handling.
 * Use this when you need to type a variable or parameter that holds a service.
 *
 * Note: Services extend `EventTarget` at runtime, but this type provides
 * compile-time type safety for event names when used with `storeBindings`.
 *
 * Usage:
 * ```typescript
 * // Type a variable
 * const service: TypedEntityService = cubeEntityService;
 *
 * // With custom events
 * interface MyEventMap extends EntityServiceEventMap {
 *   "custom-event": { data: string };
 * }
 * const myService: TypedEntityService<MyEventMap> = myEntityService;
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type TypedEntityService<_TEventMap extends EntityServiceEventMap = EntityServiceEventMap> = EventTarget;
