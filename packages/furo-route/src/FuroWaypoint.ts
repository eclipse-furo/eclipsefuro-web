import type { DocumentTitle } from "./types";

/**
 * The two event names a `FuroWaypoint` can emit.
 *
 * - `waypoint-pushed` — the staged waypoint was committed to browser history.
 * - `waypoint-canceled` — the staged waypoint was discarded (e.g. user navigated back).
 */
type EventType = "waypoint-pushed" | "waypoint-canceled";

/** Callback signature for waypoint event listeners. */
type CustomEventListener = (evt: CustomEvent) => void;

/** Internal storage shape for a registered event listener and its options. */
interface EventListenerEntry {
  cb: CustomEventListener;
  options?: boolean | AddEventListenerOptions;
}

/**
 * Tracks the currently activated waypoint instance.
 * Set by {@link FuroWaypoint.activate} and consumed by {@link FuroWaypoint.deepDive}.
 */
let ActivatedWaypoint: FuroWaypoint | undefined;

/**
 * Manages browser history waypoints and document titles for page navigation.
 *
 * The document title is composed from three segments:
 * `prefix + documentTitle + suffix`. Each segment can be updated independently
 * and the title is re-rendered automatically.
 *
 * Waypoints follow a **two-phase lifecycle**:
 *
 * 1. **Staging** — `setWaypoint()` (or `deepDive()`) registers listeners for
 *    `__beforeReplaceState` and `popstate`. The waypoint is now *pre-staged*.
 * 2. **Commit or cancel** — When the URL changes (`__beforeReplaceState` fires),
 *    the waypoint is pushed to `history.pushState` and `waypoint-pushed` is
 *    dispatched. If the user navigates back (`popstate`), the waypoint is
 *    canceled and `waypoint-canceled` is dispatched instead.
 *
 * ## Usage
 *
 * ```typescript
 * // Create a waypoint with a prefix
 * const wp = new FuroWaypoint("Dashboard", "MyApp — ");
 *
 * // Activate: sets document.title and registers as current waypoint
 * wp.activate();
 *
 * // Before navigating away, push the waypoint to history
 * FuroWaypoint.deepDive();
 *
 * // Listen for commit / cancel
 * wp.addEventListener("waypoint-pushed", (e) => {
 *   console.log("waypoint committed", e.detail);
 * });
 * wp.addEventListener("waypoint-canceled", () => {
 *   console.log("waypoint was canceled");
 * });
 *
 * // Dynamically update the title (re-renders automatically)
 * wp.documentTitle = "Settings";
 * ```
 */
export class FuroWaypoint {
  /** Title prefix segment (e.g. app name). Defaults to `""`. */
  private _prefix = "";

  /** Main title segment. Defaults to `""`. */
  private _documentTitle = "";

  /** Title suffix segment. Defaults to `""`. */
  private _suffix = "";

  /** Whether a waypoint is currently staged, awaiting commit or cancellation. */
  private _inPreStage = false;

  /** Registry of event listeners keyed by event type. */
  private __eventListener = new Map<string, EventListenerEntry[]>();

  /** Arbitrary data passed to `history.pushState` when the waypoint is committed. */
  private _stateData: unknown;

  /**
   * Sets the state data that will be passed to `history.pushState`
   * when the waypoint is committed.
   */
  public set stateData(value: unknown) {
    this._stateData = value;
  }

  /**
   * Creates a new waypoint instance.
   *
   * The document title is composed as `prefix + documentTitle + suffix`.
   * All segments default to `""` if not provided.
   *
   * @param documentTitle - The main title segment.
   * @param prefix - Optional prefix prepended to the title (e.g. app name).
   * @param suffix - Optional suffix appended to the title.
   */
  constructor(documentTitle: string, prefix?: string, suffix?: string) {
    this._documentTitle = documentTitle;

    if (prefix != null) {
      this._prefix = prefix;
    }

    if (suffix != null) {
      this._suffix = suffix;
    }
  }

  /** Returns the current title prefix. */
  public get prefix(): string {
    return this._prefix;
  }

  /** Sets the title prefix and re-renders `document.title`. */
  public set prefix(value: string) {
    this._prefix = value;
    this._setDocumentTitle();
  }

  /** Returns the current main title segment. */
  public get documentTitle(): string {
    return this._documentTitle;
  }

  /** Sets the main title segment and re-renders `document.title`. */
  public set documentTitle(value: string) {
    this._documentTitle = value;
    this._setDocumentTitle();
  }

  /** Returns the current title suffix. */
  public get suffix(): string {
    return this._suffix;
  }

  /** Sets the title suffix and re-renders `document.title`. */
  public set suffix(value: string) {
    this._suffix = value;
    this._setDocumentTitle();
  }

  // setMarker() {}

  /**
   * Stages a waypoint for the current page.
   *
   * The waypoint enters a **PreStage** phase: listeners are registered for
   * `__beforeReplaceState` (commit) and `popstate` (cancel).
   *
   * - **Commit**: When the URL changes, `history.pushState` is called with the
   *   current state data and title, and a `waypoint-pushed` event is dispatched.
   * - **Cancel**: If the user navigates back before a URL change, the staged
   *   waypoint is discarded and a `waypoint-canceled` event is dispatched.
   *
   * Only one stage can be active at a time per waypoint instance.
   */
  public setWaypoint() {
    /**
     * Waypoints are set in a staging (PreStage) and pushed to the history when
     * something in the url changes.
     */
    this._setDocumentTitle();

    /**
     * This will push the waypoint to the browser history and clear the listeners for cancellation and popstate
     */
    const pushState = () => {
      window.removeEventListener("__beforeReplaceState", pushState, true);

      window.removeEventListener("popstate", cancelPre, true);

      window.history.pushState(this._stateData, document.title, window.location.href);
      this._inPreStage = false;

      this.dispatchEvent(
        new CustomEvent("waypoint-pushed", {
          composed: true,
          bubbles: true,
          detail: this._stateData,
        })
      );
    };

    /**
     * This will cancel the staged waypoint
     */
    const cancelPre = () => {
      window.removeEventListener("__beforeReplaceState", pushState, true);
      window.removeEventListener("popstate", cancelPre, true);
      this._inPreStage = false;

      this.dispatchEvent(new CustomEvent("waypoint-canceled", { composed: true, bubbles: true }));
    };

    /**
     * Put the waypoint in to the staging
     */
    if (!this._inPreStage) {
      this._inPreStage = true;
      window.addEventListener("__beforeReplaceState", pushState, true);
      // cancel pre on navigate back
      window.addEventListener("popstate", cancelPre, true);
    }
  }

  /**
   * Sets the document title and registers this waypoint as the currently
   * activated one. The static {@link FuroWaypoint.deepDive} method will
   * call `setWaypoint()` on whichever waypoint was last activated.
   *
   * Does **not** push a history entry — use `setWaypoint()` or `deepDive()` for that.
   */
  public activate() {
    this._setDocumentTitle();
    // ActivatedWaypoint is a singleton variable
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    ActivatedWaypoint = this;
  }

  /**
   * Composes `document.title` from `prefix + documentTitle + suffix` and
   * dispatches a `document-title-changed` event on `window` with the
   * individual segments and the full title.
   * @private
   */
  private _setDocumentTitle() {
    document.title = this._prefix + this._documentTitle + this._suffix;

    window.dispatchEvent(
      new CustomEvent<DocumentTitle>("document-title-changed", {
        composed: true,
        bubbles: true,
        detail: {
          prefix: this._prefix,
          title: this._documentTitle,
          suffix: this._suffix,
          documentTitle: document.title,
        },
      })
    );
  }

  /**
   * Registers an event listener for waypoint events.
   *
   * @param type - The event type: `"waypoint-pushed"` or `"waypoint-canceled"`.
   * @param handler - The callback invoked when the event fires.
   * @param options - Standard `addEventListener` options. Supports `{ once: true }`
   *   to auto-remove the listener after a single invocation.
   */
  public addEventListener(type: EventType, handler: CustomEventListener, options?: boolean | AddEventListenerOptions): void {
    if (!this.__eventListener.has(type)) {
      this.__eventListener.set(type, []);
    }
    this.__eventListener.get(type)!.push({ cb: handler, options });
  }

  /**
   * Dispatches a `CustomEvent` to all registered listeners for the event's type.
   * Listeners registered with `{ once: true }` are automatically removed after
   * being called.
   *
   * @param event - The `CustomEvent` to dispatch.
   */
  public dispatchEvent(event: CustomEvent): void {
    const listeners = this.__eventListener.get(event.type);
    if (listeners && listeners.length > 0) {
      for (let i = listeners.length - 1; i >= 0; i--) {
        listeners[i].cb(event);
        if (typeof listeners[i].options === "object" && (listeners[i].options as AddEventListenerOptions).once) {
          listeners.splice(i, 1);
        }
      }
    }
  }

  /**
   * Calls `setWaypoint()` on the currently activated waypoint (set via `activate()`).
   * This is a convenience for pushing a history entry before navigating away,
   * without needing a direct reference to the waypoint instance.
   *
   * Does nothing if no waypoint has been activated.
   */
  public static deepDive() {
    if (ActivatedWaypoint) {
      ActivatedWaypoint.setWaypoint();
    }
  }
}
