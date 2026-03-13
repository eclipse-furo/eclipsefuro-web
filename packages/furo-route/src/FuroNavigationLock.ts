/**
 * Prevents users from leaving the page when they have unsaved changes.
 *
 * When locked, it intercepts in-app navigation events (`__beforeReplaceState`,
 * `__beforeHistoryBack`) and the browser's `beforeunload` event. A confirmation
 * dialog is shown — if the user confirms, the lock auto-unlocks and navigation
 * proceeds. If the user cancels, navigation is blocked.
 *
 * Two locking modes are available:
 * - **`lock()`** — blocks all navigation (path, query, and hash changes).
 * - **`lockPath()`** — blocks only path changes; query and hash updates pass
 *   through freely. Useful when a page updates query params for filtering or
 *   sorting but should still prevent the user from navigating away.
 *
 * In both modes, `__beforeHistoryBack` always triggers the confirmation dialog
 * because browser history is opaque and the target path cannot be determined
 * in advance.
 *
 * The `message` property is public and can be updated at any time to provide
 * context-specific confirmation text.
 *
 * ## Usage
 *
 * ```typescript
 * // Create a lock with a custom message
 * const lock = new FuroNavigationLock("Discard unsaved changes?");
 *
 * // Full lock — blocks all navigation (e.g. when form becomes dirty)
 * lock.lock();
 *
 * // Update the message to reflect the current context, usually done when locking.
 * lock.message = "Object 123 is not saved, proceed anyway?";
 *
 * // Deactivate the lock (e.g. after saving)
 * lock.unlock();
 *
 * // Path-only lock — allows query/hash changes through
 * lock.lockPath();
 * ```
 */
export class FuroNavigationLock {
  public message = "You have unsaved changes, proceed anyway?";

  private _locked = false;

  private lockPathChangesOnly = false;

  constructor(message?: string) {
    if (message) {
      this.message = message;
    }
  }

  /**
   * Blocks furo-location-updater and furo-app-flow-router from navigating away on any url change.
   */
  public lock() {
    if (!this._locked) {
      window.addEventListener("__beforeReplaceState", this._lockHandler, true);
      window.addEventListener("__beforeHistoryBack", this._lockHandler, true);
      window.addEventListener("beforeunload", this._unloadHandler, true);
      this._locked = true;
    }
  }

  /**
   * Blocks furo-location-updater and furo-app-flow-router from navigating away
   * only when the path changes. Query param and hash updates pass through freely.
   *
   * On `__beforeReplaceState`, the handler compares the `targetPath` from the
   * navigation event against `window.location.pathname` and only shows the
   * confirmation dialog when the path actually differs.
   *
   * `__beforeHistoryBack` always triggers the confirmation as a safe default
   * because the browser does not expose the target URL for history traversals.
   */
  public lockPath() {
    this.lockPathChangesOnly = true;
    if (!this._locked) {
      window.addEventListener("__beforeReplaceState", this._lockHandler, true);
      window.addEventListener("__beforeHistoryBack", this._lockHandler, true);
      window.addEventListener("beforeunload", this._unloadHandler, true);
      this._locked = true;
    }
  }

  /**
   * Removes the lock and resets `lockPathChangesOnly`, so a subsequent
   * `lock()` call will not inherit path-only behavior.
   */
  public unlock() {
    if (this._locked) {
      window.removeEventListener("__beforeReplaceState", this._lockHandler, true);
      window.removeEventListener("__beforeHistoryBack", this._lockHandler, true);
      window.removeEventListener("beforeunload", this._unloadHandler, true);
      this._locked = false;
      this.lockPathChangesOnly = false;
    }
  }

  private _lockHandler = (event: Event) => {
    const e = event as CustomEvent<{ cancel: boolean; targetPath?: string }>;

    // When lockPathChangesOnly, allow query/hash-only changes through
    if (this.lockPathChangesOnly && e.detail.targetPath !== undefined) {
      if (e.detail.targetPath === window.location.pathname) {
        return; // path unchanged, allow navigation
      }
    }

    if (!window.confirm(this.message)) {
      e.detail.cancel = true;
    } else {
      this.unlock();
    }
  };

  // eslint-disable-next-line class-methods-use-this
  private _unloadHandler = (event: Event) => {
    event.preventDefault();
  };
}
