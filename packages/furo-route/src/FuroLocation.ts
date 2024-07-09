import { LocationObject } from './types';

type EventType =
  | 'location-path-changed'
  | 'location-hash-changed'
  | 'location-query-changed'
  | 'location-changed'
  | 'url-space-entered';

interface CustomEventListener {
  (evt: CustomEvent<LocationObject>): void;
}

export class FuroLocation {
  /**
   * A regexp pattern that defines the set of URLs that should be considered part
   * of this web app.
   *
   * Clicking on a link that matches this pattern won't result in a full page
   * navigation, but will instead just update the URL state in place.
   *
   * This regexp is given everything after the origin in an absolute
   * URL. So to match just URLs that start with /app/ do:
   *     url-space-regex="^/app/"
   *
   * If you plan to work in subdirectories, you may set **url-space-regex="^${window.APP_ROOT}/additional/path"**.
   * Keep in mind to put an "url-space-regex" on every furo-location. Otherwise, you can not switch between apps in different
   * folders using a link.
   *
   * @type {string}
   */
  private urlSpaceRegex: string = '';

  private __eventListener: Map<string, any[]> = new Map();

  private location: LocationObject = {
    host: window.location.host,
    query: {},
    hash: {},
    path: '/detail',
    pathSegments: [],
    hashString: '',
    queryString: '',
  };

  private locationChangeNotifier: () => void;

  constructor(urlSpaceRegex: string) {
    this.urlSpaceRegex = urlSpaceRegex;

    this.locationChangeNotifier = () => {
      let sendHashChanged = false;
      let sendQueryChanged = false;
      let sendPathChanged = false;

      // ignore links outside urlSpaceRegex
      if (this.urlSpaceRegex !== '') {
        if (window.location.pathname.match(this.urlSpaceRegex) === null) {
          return;
        }

        if (
          window.location.search === '' &&
          window.location.hash === '' &&
          window.location.pathname.match(`${this.urlSpaceRegex}$`)
        ) {
          this.dispatchEvent(
            new CustomEvent('url-space-entered', {
              composed: false,
              bubbles: false,
              detail: this.location,
            })
          );
        }
      }

      // register empty objects for later usage
      this.location.query = {};
      this.location.hash = {};

      // path-changed
      // cut of urlSpaceRegex
      const newPath = window
        .decodeURIComponent(window.location.pathname)
        .replace(new RegExp(this.urlSpaceRegex), '');
      if (this.location.path !== newPath) {
        sendPathChanged = true;
      }
      this.location.path = newPath;

      // path segments
      this.location.pathSegments = [];
      let m;
      const rgx =  /\/([^/]*)/gi
      // eslint-disable-next-line no-cond-assign
      while ((m = rgx.exec(newPath)) !== null) {
        this.location.pathSegments.push(m[1]);
      }

      // hash-changed
      const newHash = window.decodeURIComponent(window.location.hash.slice(1));
      if (this.location.hashString !== newHash) {
        sendHashChanged = true;
      }
      this.location.hashString = newHash;
      this.location.hash = {};
      if (newHash.length > 0) {
        newHash.split('&').forEach(qstr => {
          const p = qstr.split('=');
          // eslint-disable-next-line prefer-destructuring
          this.location.hash[p[0]] = p[1];
        });
      }

      // query-changed
      const newQuery = window.location.search.slice(1);
      if (this.location.queryString !== newQuery) {
        sendQueryChanged = true;
      }
      this.location.queryString = newQuery;
      this.location.query = {};
      if (newQuery.length > 0) {
        newQuery.split('&').forEach(qstr => {
          const p = qstr.split('=');
          // eslint-disable-next-line prefer-destructuring
          this.location.query[p[0]] = p[1];
        });
      }

      if (sendPathChanged) {
        this.dispatchEvent(
          new CustomEvent('location-path-changed', {
            composed: true,
            bubbles: false,
            detail: this.location,
          })
        );
      }

      if (sendHashChanged) {
        this.dispatchEvent(
          new CustomEvent('location-hash-changed', {
            composed: true,
            bubbles: false,
            detail: this.location,
          })
        );
      }

      if (sendQueryChanged) {
        this.dispatchEvent(
          new CustomEvent('location-query-changed', {
            composed: true,
            bubbles: false,
            detail: this.location,
          })
        );
      }

      // location-changed
      this.dispatchEvent(
        new CustomEvent('location-changed', {
          composed: true,
          bubbles: false,
          detail: this.location,
        })
      );
    };
    this.connect();
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

  connect() {
    window.addEventListener(
      '__furoLocationChanged',
      this.locationChangeNotifier,
      true
    );
    window.addEventListener('popstate', this.locationChangeNotifier, true);

    // initial notyfier
    setTimeout(() => {
      this.locationChangeNotifier();
    }, 0);
  }

  disconnect() {
    window.removeEventListener(
      '__furoLocationChanged',
      this.locationChangeNotifier,
      true
    );
    window.removeEventListener('popstate', this.locationChangeNotifier, true);
  }
}
