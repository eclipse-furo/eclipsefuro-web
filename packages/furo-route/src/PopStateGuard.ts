/**
 * Detail of the cancelable `__beforePopState` event.
 */
export interface BeforePopStateDetail {
  /** Set to true to keep the current location. */
  cancel: boolean;
  /** The path the browser navigated to. */
  targetPath: string;
}

let installed = false;

/** The `popstate` of our own `history.forward()`, which undoes a cancelled traversal. */
let restoring = false;

/**
 * A `popstate` can not be cancelled: when it fires, the browser has already moved. The guard asks the
 * `__beforePopState` listeners (e.g. a locked {@link FuroNavigationLock}) first. A cancelled traversal is
 * hidden from every later `popstate` listener (the `FuroLocation`s, the `FuroWaypoint`s) and undone with
 * `history.forward()`.
 *
 * Every traversal is undone as a back navigation: a page that locks the navigation is usually reached by a
 * push, so there is no forward entry to leave it to.
 */
const onPopState = (event: PopStateEvent) => {
  if (restoring) {
    restoring = false;
    event.stopImmediatePropagation();
    return;
  }
  const beforePopState = new CustomEvent<BeforePopStateDetail>("__beforePopState", {
    detail: { cancel: false, targetPath: window.location.pathname },
  });
  window.dispatchEvent(beforePopState);
  if (beforePopState.detail.cancel) {
    event.stopImmediatePropagation();
    restoring = true;
    window.history.forward();
  }
};

/**
 * Installs the guard once. Called by the `FuroLocation` before it adds its own `popstate` listener:
 * listeners of the same target run in the order they were added, so the guard runs first.
 *
 * @private
 */
export function installPopStateGuard(): void {
  if (installed) return;
  installed = true;
  window.addEventListener("popstate", onPopState, true);
}
