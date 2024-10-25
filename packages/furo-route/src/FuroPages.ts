import {css, html, LitElement} from 'lit';
// eslint-disable-next-line import/extensions
import {property} from 'lit/decorators.js';
import {FuroPage, LocationObject} from './types';

interface FBPElement extends LitElement {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _FBPTriggerWire(wire: string, detailData: any): void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isFuroPage(object: any): object is FuroPage {
  // check for method
  return !!object.onPageActivated;
}

/**
 *
 * Use `furo-pages` to build tabs, views, subviews,...
 *
 *
 * ## preconditions
 * The components used in a furo-page must implement a **aria-hidden** attribute css to set itself to display none.
 *
 * ```css
 * :host([aria-hidden]){
 *    display:none
 *  }
 *```
 *
 * ## usage
 *
 * ```html
 *
 * <furo-pages fn-inject-location="--locationChanged" default="home">
 *    <page-home id="home"></page-home>
 *    <other-page id="more"></other-page>
 *    <view-404 id="404"></view-404>
 * </furo-pages>
 *
 * <furo-location at-location-changed="--locationChanged"></furo-location>
 * ```
 * *If the url is `/` or `/home`, page-home is displayed.*
 * *If the url is `/more`,  other-page is displayed.*
 * *If the url does not match any of the names and a 404 is available, the 404 is displayed.*
 *
 * ## Lifecycle
 * If the inserted page implements the `FuroPage` interface, the following lifecycle method of your page are called:
 *
 * ### `onPageActivated(location: LocationObject): void;`
 * Triggered when the page is initialized, or you moved from another page to this page
 *
 * ### `onPageDeactivated(newLocation: LocationObject): void;`
 * Triggered when you go to a different page.
 *
 * ### `onPageUpdated(location: LocationObject): void;`
 * Triggered when something in the URL of the current page changes, query, hash or subpages path.
 *
 * ### `onPageQueryChanged?(location: LocationObject): void;`
 * Triggered when query params changed.
 *
 * ### `onPageHashChanged?(location: LocationObject): void;`
 * Triggered when hash params change
 *
 * furo-pages provides auto wires, which are automatically triggered in the child elements if
 * they support FBP. Each wire will forward a `locationObject`
 *
 * -  `|--pageActivated` : Is triggered when the element is activated.
 * -  `|--pageDeActivated` : Is triggered when another page is activated. Empty wire.
 * -  `|--pageQueryChanged` : Is triggered when the page query changes.
 * -  `|--pageHashChanged` : Is triggered when the page hash changes.
 * -  `|--pageUpdated` : Is triggered when something in the URL of the current page changes.
 * -  `|--pageReActivated` : Same as pageUpdated, for backward compatibility.
 *
 *
 *
 * @attribute {string} default - Set the default page to show.
 * @attribute {boolean} flex - Enables the flex mode when used in a flex parent like vertical-flex.
 *
 * @slot {HTMLElement [0..n]} default - default slot to add pages.
 * @summary Simple content switcher
 * @tagname furo-pages
 * @customElement
 */
export class FuroPages extends LitElement {
  @property({type: String, attribute: 'default'})
  private defaultPageName: string = 'default';

  @property({type: String, attribute: 'attribute-name-for-select-state'})
  private _attrForSelected: string = 'selected';

  private _lastQP: Map<string, string> = new Map<string, string>();

  private _lastHash: Map<string, string> = new Map<string, string>();

  private _lastPageName: string = '';

  public urlSpaceRegex: string = '';

  private _lastPage: FBPElement | null = null;

  private _page: string = '';

  private _init: boolean = true; // used to send an activated instead of an updated on init

  private _pageRef: Record<string, string> = {}; // ref to removed parts

  /**
   * For simple pages like tabs, set the page by string
   * @param p
   */
  @property({type: String})
  set page(p: string) {
    this.activatePage(p);
    this._page = p;
  }

  get page(): string {
    return this._page;
  }

  /**
   * The `default` mode (recommended) removes your node from the render tree and is the fastest mode. It uses more memory than the `destructive` mode.
   *
   * The state of the disabled element is kept, form fields which are filled, are the same as before you left the page.
   *
   * ---
   *
   * The `destructive` mode removes and destroys the element which is deactivated from the dom
   * and will insert it back to the dom when they are activated (insertAdjacentHTML).
   *
   * The insertAdjacentHTML() method does not reparse the element it is being used on,
   * and thus it does not corrupt the existing elements inside that element.
   * This avoids the extra step of serialization, making it much faster than direct innerHTML manipulation.
   *
   * This `destructive` mode is uses less memory, but **looses the state** of the disabled element and is a little bit slower.
   *
   * Use this if you know what you are doing, because the connectedCallback and disconnectedCallback of every item in your page is also called and everything is built up freshly.
   * @public
   */
  @property({type: String, attribute: 'mode'})
  mode: 'default' | 'destructive' = 'default';

  connectedCallback() {
    super.connectedCallback();
    // set all to aria-hidden
    let l = this.children.length - 1;
    for (l; l >= 0; l -= 1) {
      if(this.children[l].getAttribute(this._attrForSelected) === null){
        this.children[l].setAttribute('aria-hidden', '');
      }
    }
  }


  /**
   * Activate a page by name
   * @param {string} pageName
   */
  activatePage(pageName: string) {
    /**
     * imitate a location object like furo-location would send, to have a consistent behavior
     * @type {{pathSegments: [*]}}
     */
    const hashString = window.decodeURIComponent(window.location.hash.slice(1));
    const queryString = window.location.search.slice(1);
    const pseudolocation: LocationObject = {
      host: window.location.host,
      path: window
        .decodeURIComponent(window.location.pathname)
        .replace(new RegExp(this.urlSpaceRegex), ''),
      pathSegments: [pageName],
      hashString,
      hash: {},
      query: {},
      queryString,
    };

    // build the hash object
    if (hashString.length > 0) {
      hashString.split('&').forEach(qstr => {
        const p = qstr.split('=');
        // eslint-disable-next-line prefer-destructuring
        pseudolocation.hash[p[0]] = p[1];
      });
    }
    // build the query object
    if (queryString.length > 0) {
      queryString.split('&').forEach(qstr => {
        const p = qstr.split('=');
        // eslint-disable-next-line prefer-destructuring
        pseudolocation.query[p[0]] = p[1];
      });
    }

    return this.injectLocation(pseudolocation);
  }

  /**
   * Inject the location Object from furo-location. The page which is defined in location.pathSegments[0] will get activated.
   *
   * To meke "sub" pages do not forget to enable the `url-space-regex` property on the *furo-location* component which feeds this component.
   *
   * If the page/view does not exist, and you have a page "404" defined, the 404 will be shown
   *
   * If the page/view does not exist AND 404 does not exist, the default page gets activated.
   *
   * @param location
   * @public
   */
  injectLocation(location: LocationObject): boolean {
    const page = location.pathSegments[0] || this.defaultPageName;
    if (page === null) {
      // eslint-disable-next-line no-console
      console.error('No page defined');
      return false;
    }
    if (this._lastPage && page !== this._lastPageName) {
      if (this.isWebComponent(this._lastPage.localName)) {
        const f = this._lastPage as FBPElement;
        customElements.whenDefined(this._lastPage.localName).then(() => {
          if (f._FBPTriggerWire !== undefined) {
            f._FBPTriggerWire('|--pageDeactivated', location);
          }
        });
      }

      if (
        this.isWebComponent(this._lastPage.localName) &&
        isFuroPage(this._lastPage)
      ) {
        const lp = this._lastPage as FuroPage;
        customElements.whenDefined(this._lastPage.localName).then(() => {
          lp.onPageDeactivated(location);
        });
      }

      this._lastPage.setAttribute('aria-hidden', '');
      this._lastPage.removeAttribute(this._attrForSelected);
      // we do not remove every page upfront because we expect lazy loading
      // remove from dom
      if (this.mode === 'destructive') {
        this._pageRef[this._lastPageName] = this._lastPage.outerHTML;
        this._lastPage.remove();
      }
    }

    // remove from dom
    if (this.mode === 'destructive') {
      if (this._pageRef.hasOwnProperty(page)) {
        this.insertAdjacentHTML('afterbegin', this._pageRef[page]);
      }
    }

    this._lastPage = this.querySelector(`*[id="${page}"]`);

    if (!this._lastPage) {
      // 404
      this._lastPage = this.querySelector('*[id="404"]');
      if (!this._lastPage) {
        // fallback is the default page
        this._lastPage = this.querySelector(`*[id=${this.defaultPageName}]`);
      }
    }

    if (this._lastPage) {

      this._lastPage.removeAttribute('aria-hidden');
      this._lastPage.setAttribute(this._attrForSelected, '');

      // send pageActivated on init
      // activate if a different page is selected, otherwise notify
      if (this._lastPageName !== page || this._init) {
        this._notifyPageActivated(location);
        this._init = false;
      } else {
        this._notifyPageUpdated(location);
      }

      this._lastPageName = page;
      // QP
      if (this._lastQP.get(page) !== location.queryString) {
        this._lastQP.set(page, location.queryString);
        this._notifyPageQueryParamChanges(location);
      }

      // Hash
      if (this._lastHash.get(page) !== location.hashString) {
        this._lastHash.set(page, location.hashString);
        this._notifyPageHashChanges(location);
      }

      return true;
    }

    // Activate Default
    if (!this._lastPageName) {
      this.activatePage(this.defaultPageName);
      return true;
    } else {
      // eslint-disable-next-line no-console
      console.warn('default page not found and 404 page not found');
      return false;
    }


  }

  private _notifyPageHashChanges(location: LocationObject) {
    if (!this._lastPage) {
      return;
    }
    if (this.isWebComponent(this._lastPage.localName)) {
      // fire --pageParamsChanged if we have a fbp component
      const f = this._lastPage as FBPElement;
      customElements.whenDefined(this._lastPage.localName).then(() => {
        if (f._FBPTriggerWire !== undefined) {
          f._FBPTriggerWire('|--pageHashChanged', location);
        }
      });
    }
    if (
      this.isWebComponent(this._lastPage.localName) &&
      isFuroPage(this._lastPage)
    ) {
      customElements.whenDefined(this._lastPage.localName).then(() => {
        if (isFuroPage(this._lastPage)) {
          const lp = this._lastPage as FuroPage;
          if (lp.onPageHashChanged !== undefined) {
            lp.onPageHashChanged(location);
          }
        }
      });
    }
  }

  private _notifyPageQueryParamChanges(location: LocationObject) {
    if (!this._lastPage) {
      return;
    }

    if (this.isWebComponent(this._lastPage.localName)) {
      const f = this._lastPage as FBPElement;
      customElements.whenDefined(this._lastPage.localName).then(() => {
        if (f._FBPTriggerWire !== undefined) {
          f._FBPTriggerWire('|--pageQueryChanged', location);
        }
      });
    }

    if (
      this.isWebComponent(this._lastPage.localName) &&
      isFuroPage(this._lastPage)
    ) {
      customElements.whenDefined(this._lastPage.localName).then(() => {
        if (isFuroPage(this._lastPage)) {
          const lp = this._lastPage as FuroPage;
          if (lp.onPageQueryChanged !== undefined) {
            lp.onPageQueryChanged(location);
          }
        }
      });
    }
  }

  private _notifyPageUpdated(location: LocationObject) {
    if (!this._lastPage) {
      return;
    }
    if (this.isWebComponent(this._lastPage.localName)) {
      const f = this._lastPage as FBPElement;
      customElements.whenDefined(this._lastPage.localName).then(() => {
        if (f._FBPTriggerWire !== undefined) {
          // for backward compatibility
          f._FBPTriggerWire('|--pageReActivated', location);
          f._FBPTriggerWire('|--pageUpdated', location);
        }
      });
    }

    if (
      this.isWebComponent(this._lastPage.localName) &&
      isFuroPage(this._lastPage)
    ) {
      customElements.whenDefined(this._lastPage.localName).then(() => {
        if (isFuroPage(this._lastPage)) {
          const lp = this._lastPage as FuroPage;
          lp.onPageUpdated(location);
        }
      });
    }
  }

  private _notifyPageActivated(location: LocationObject) {
    if (!this._lastPage) {
      return;
    }
    if (this.isWebComponent(this._lastPage.localName)) {
      const f = this._lastPage as FBPElement;
      customElements.whenDefined(this._lastPage.localName).then(() => {
        if (f._FBPTriggerWire !== undefined) {
          f._FBPTriggerWire('|--pageActivated', location);
        }
      });
    }

    if (this.isWebComponent(this._lastPage.localName)) {
      customElements.whenDefined(this._lastPage.localName).then(() => {
        if (isFuroPage(this._lastPage)) {
          const lp = this._lastPage as FuroPage;
          lp.onPageActivated(location);
        }
      });
    }
  }

  /**
   *
   * @private
   */
  static get styles() {
    // language=CSS
    return css`
      :host {
        display: block;
      }

      ::slotted(*[aria-hidden]) {
        display: none;
      }
    `;
  }

  /**
   * Checks if a node is a web component.
   * @param localName
   *
   */
  // eslint-disable-next-line class-methods-use-this
  isWebComponent(localName: string): boolean {
    return localName.includes('-');
  }

  /**
   * @private
   */
  render() {
    // language=HTML
    return html`
      <slot></slot> `;
  }
}
