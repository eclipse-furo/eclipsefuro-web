export class FuroNavigationLock {
  public message: string = 'You have unsaved changes, proceed anyway?';

  private _locked: boolean = false;

  constructor(message?: string) {
    if (message) {
      this.message = message;
    }
  }

  /**
   * Blocks furo-location-updater and furo-app-flow-router from navigating away.
   */
  lock() {
    if (!this._locked) {
      this._lockHandler = this._lockHandler.bind(this);
      window.addEventListener(
        '__beforeReplaceState',
        this._lockHandler as EventListener,
        true,
      );
      window.addEventListener(
        '__beforeHistoryBack',
        this._lockHandler as EventListener,
        true,
      );
      window.addEventListener('beforeunload', this._unloadHandler, true);
      this._locked = true;
    }
  }

  /**
   * Removes the lock.
   */
  unlock() {
    if (this._locked) {
      window.removeEventListener(
        '__beforeReplaceState',
        this._lockHandler as EventListener,
        true,
      );
      window.removeEventListener(
        '__beforeHistoryBack',
        this._lockHandler as EventListener,
        true,
      );
      window.removeEventListener('beforeunload', this._unloadHandler, true);
      this._locked = false;
    }
  }

  /**
   *
   * @param event
   * @private
   */
  private _lockHandler(event: CustomEvent<{ cancel: boolean }>) {
    // eslint-disable-next-line no-alert
    if (!window.confirm(this.message)) {
      // eslint-disable-next-line no-param-reassign
      event.detail.cancel = true;
    } else {
      this.unlock();
    }
  }

  /**
   *
   * @param event
   * @private
   *
   */
  // eslint-disable-next-line class-methods-use-this
  _unloadHandler(event: BeforeUnloadEvent) {
    event.preventDefault();
  }
}
