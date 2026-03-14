import { EntityServiceEventMap, EntityServiceEventType } from "./EntityServiceTypes";

/**
 * Dispatch function type for entity service events.
 * Accepts any function that can dispatch the standard EntityServiceEventType events.
 * This allows extended event maps (like CubeServiceEventMap) to be used.
 */
type DispatchFn = (type: EntityServiceEventType, detail: EntityServiceEventMap[EntityServiceEventType]) => void;

/**
 * Options for creating default service event handlers.
 */
export interface DefaultServiceEventHandlersOptions {
  /**
   * Function to check if the service is still loading.
   * Used by `onRequestFinished` to determine the busy state.
   * If not provided, busy is set to false on request finish.
   */
  isLoading?: () => boolean;
}

/**
 * ### DefaultServiceEventHandlers
 *
 * Creates default service handlers that dispatch standard events.
 * Use this to reduce boilerplate when setting up service handlers.
 *
 * The `onResponse` handler is intentionally NOT included - you must provide your own
 * implementation since response handling is typically service-specific.
 *
 * Usage:
 * ```typescript
 * class MyEntityService extends EventTarget {
 *   private dispatch = createDispatch(this);
 *
 *   setupHandlers() {
 *     this.service.Get.setHandlers({
 *       ...DefaultServiceEventHandlers(this.dispatch),
 *       onResponse: (response, serverResponse) => {
 *         // Your custom response handling
 *         this.entity.fromLiteral(response.entity);
 *         this.dispatch("response-received", { response, serverResponse });
 *       },
 *     });
 *   }
 * }
 * ```
 *
 * With loading check:
 * ```typescript
 * this.service.Get.setHandlers({
 *   ...DefaultServiceEventHandlers(this.dispatch, {
 *     isLoading: () => this.service.Get.isLoading || this.service.Update.isLoading,
 *   }),
 *   onResponse: (response, serverResponse) => { ... },
 * });
 * ```
 *
 * @param dispatch - Function to dispatch events (typically bound to the service's dispatchEvent)
 * @param options - Optional configuration
 * @returns Object with all standard handlers except onResponse
 */
export function DefaultServiceEventHandlers(dispatch: DispatchFn, options: DefaultServiceEventHandlersOptions = {}) {
  const { isLoading } = options;

  return {
    onRequestStarted(request: unknown) {
      dispatch("request-started", { request });
      dispatch("busy-changed", { busy: true });
    },

    onRequestFinished(request: unknown) {
      dispatch("request-finished", { request });
      dispatch("busy-changed", { busy: isLoading ? isLoading() : false });
    },

    onResponseError(parsedResponse: unknown, serverResponse: Response) {
      dispatch("response-error", { parsedResponse, serverResponse });
      if (serverResponse.status === 404) {
        dispatch("error-404", { serverResponse });
      }
      if (serverResponse.status >= 500) {
        dispatch("error-5xx", { serverResponse });
      }
    },

    onResponseErrorRaw(serverResponse: Response) {
      dispatch("raw-error", { serverResponse });
    },

    onResponseRaw(serverResponse: Response) {
      dispatch("raw-response", { serverResponse });
    },

    onRequestAborted(reason: unknown) {
      dispatch("request-aborted", { reason: String(reason) });
    },

    onFatalError(error: unknown) {
      dispatch("fatal-error", { error });
    },
  };
}

/**
 * ### createDispatch
 *
 * Helper to create a typed dispatch function for an EventTarget.
 *
 * Usage:
 * ```typescript
 * class MyService extends EventTarget {
 *   private dispatch = createDispatch(this);
 *
 *   doSomething() {
 *     this.dispatch("busy-changed", { busy: true });
 *   }
 * }
 * ```
 *
 * @param target - The EventTarget to dispatch events on
 * @returns A typed dispatch function
 */
export function CreateDispatch(target: EventTarget): DispatchFn {
  return function dispatchEvent<K extends EntityServiceEventType>(type: K, detail: EntityServiceEventMap[K]) {
    target.dispatchEvent(new CustomEvent(type, { detail }));
  };
}
