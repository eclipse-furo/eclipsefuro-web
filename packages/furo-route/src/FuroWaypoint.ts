import { DocumentTitle } from './types';

type EventType = 'waypoint-pushed' | 'waypoint-canceled';

interface CustomEventListener {
  (evt: CustomEvent): void;
}

export class FuroWaypoint {
  private _prefix: string = '';

  private _documentTitle: string = '';

  private _suffix: string = '';

  private _inPreStage: boolean = false;

  private __eventListener: Map<string, any[]> = new Map();

  constructor(
    documentTitle: string,
    prefix?: string,
    suffix?: string
  ) {
    this._documentTitle = documentTitle;

    if (prefix != null) {
      this._prefix = prefix;
    }

    if (suffix != null) {
      this._suffix = suffix;
    }
  }

  get prefix(): string {
    return this._prefix;
  }

  set prefix(value: string) {
    this._prefix = value;
    this._setDocumentTitle();
  }

  get documentTitle(): string {
    return this._documentTitle;
  }

  set documentTitle(value: string) {
    this._documentTitle = value;
    this._setDocumentTitle();
  }

  get suffix(): string {
    return this._suffix;
  }

  set suffix(value: string) {
    this._suffix = value;
    this._setDocumentTitle();
  }


  // setMarker() {}

  setWaypoint(stateData?: any) {
    /**
     * Waypoints are set in a staging (PreStage) and pushed to the history when
     * something in the url changes.
     */
    this._setDocumentTitle();

    /**
     * This will push the waypoint to the browser history and clear the listeners for cancelation and popstate
     */
    const pushState = () => {
      window.removeEventListener('__beforeReplaceState', pushState, true);
      // eslint-disable-next-line no-use-before-define
      window.removeEventListener('popstate', cancelPre, true);

      window.history.pushState(stateData, document.title, window.location.href);
      this._inPreStage = false;

      this.dispatchEvent(
        new CustomEvent('waypoint-pushed', {
          composed: true,
          bubbles: true,
          detail: stateData,
        })
      );
    };

    /**
     * This will cancel the staged waypoint
     */
    const cancelPre = () => {
      window.removeEventListener('__beforeReplaceState', pushState, true);
      window.removeEventListener('popstate', cancelPre, true);
      this._inPreStage = false;

      this.dispatchEvent(
        new CustomEvent('waypoint-canceled', { composed: true, bubbles: true })
      );
    };

    /**
     * Put the waypoint in to the staging
     */
    if (!this._inPreStage) {
      this._inPreStage = true;
      window.addEventListener('__beforeReplaceState', pushState, true);
      // cancel pre on navigate back
      window.addEventListener('popstate', cancelPre, true);
    }
  }

  /**
   * Set the document title with the currentPage prefix title suffix. Without setting a waypoint.
   *
   */
  activate() {
    this._setDocumentTitle();
  }

  /**
   * Renders the title and set it as document title
   * @private
   */
  async _setDocumentTitle() {
    document.title = this._prefix + this._documentTitle + this._suffix;

    window.dispatchEvent(
      new CustomEvent<DocumentTitle>('document-title-changed', {
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
   * Add a handler to a node
   * @param type
   * @param handler
   * @param options
   */
  public addEventListener(
    type: EventType,
    handler: CustomEventListener,
    options?: boolean | AddEventListenerOptions
  ): void {
    if (!this.__eventListener.has(type)) {
      this.__eventListener.set(type, []);
    }
    this.__eventListener.get(type)!.push({ cb: handler, options });
  }

  public dispatchEvent(event: CustomEvent): void {
    if (
      this.__eventListener.has(event.type) &&
      this.__eventListener.get(event.type)!.length > 0
    ) {
      this.__eventListener.get(event.type)!.forEach((t, i, listenerArray) => {
        t.cb(event);
        if (t.options?.once) {
          // eslint-disable-next-line no-param-reassign
          delete listenerArray[i];
        }
      });
    }
  }
}
