import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";

/**
 * `furo-resizer`
 *  container which let you resize its width.
 *
 *  Double-click on the handler to reset the width.
 *  You need a counterpart which flexes.
 *
 *
 *```html
 *   <furo-horizontal-flex>
 *     <div flex> the flexible part </div>
 *     <!-- you have to set at leas one handle to resize the content -->
 *     <furo-resizer righthandle remember="logv" minwidth="280" maxwidth="780">
 *       <some-content></some-content>
 *     </furo-resizer>
 *   </furo-horizontal-flex>
 *```
 *
 * @attribute {void} righthandle - add a handle to the right side.
 * @attribute {void} lefthandle - add a handle to the left side.
 * @slot {HTMLElement [0..n]} - default slot to add content.
 * @summary resizable box
 * @demo demo-furo-resizer  Basic usage
 * @customElement
 * @appliesMixin FBP
 */
export class FuroResizer extends LitElement {
  /**
   * remember the size after resizing.
   * Give the id for the rememberer, you can use the id on different views
   *
   */
  @property({ type: String, attribute: "remember-id" })
  public remember: string | undefined;

  /**
   * Set the maximal width of the resizer
   */
  @property({ type: Number })
  public maxwidth: number | undefined;

  /**
   * Set the minimal width of the resizer
   */
  @property({ type: Number })
  minwidth: number | undefined;

  private _positions: { x: number } = { x: 0 };

  /**
   * remove the listeners
   */
  private _unregister = () => {
    window.removeEventListener("mousemove", this._movementHandler);
    window.removeEventListener("mouseup", this._unregister);
    // set cursor to avoid flickering
    (this.parentNode as HTMLElement).style.cursor = "";
  };

  /**
   * capture the mouse movement and resize the width
   * @param e MouseEvent
   * @private
   */
  private _movementHandler = (e: MouseEvent) => {
    const delta = (e.screenX - this._positions.x) * this._handleLRM;

    requestAnimationFrame(() => {
      let width = this._startwidth + delta;

      if (this.minwidth && width + 3 < this.minwidth) {
        width = this.minwidth;
        this._unregister();
        this.style.opacity = "0.6";
        setTimeout(() => {
          this.style.opacity = "1";
        }, 200);
      }
      if (this.maxwidth && width - 3 > this.maxwidth) {
        width = this.maxwidth;
        this._unregister();
        this.style.opacity = "0.6";
        setTimeout(() => {
          this.style.opacity = "1";
        }, 200);
      }

      this.style.width = `${width}px`;
      if (this.remember) {
        localStorage.setItem(this.remember, `${width}`);
      }
    });
  };

  private contentVisible: boolean = true;

  /**
   * register the left handler
   * @param e
   * @private
   */
  private _startTrackingLeft(e: MouseEvent) {
    this._handleLRM = -1;
    this._startTracking(e);
  }

  /**
   * register the right handler
   * @param e
   * @private
   */
  private _startTrackingRight(e: MouseEvent) {
    this._handleLRM = 1;
    this._startTracking(e);
  }

  /**
   * Start mouse move tracking
   * @param e
   * @private
   */
  private _startTracking = (e: MouseEvent) => {
    e.preventDefault();
    window.addEventListener("mousemove", this._movementHandler);
    window.addEventListener("mouseup", this._unregister);
    this._positions.x = e.screenX;
    this._startwidth = this.getBoundingClientRect().width;

    // set cursor to avoid flickering
    (this.parentNode as HTMLElement).style.cursor = "col-resize";
  };

  /**
   * removes remember and set to the initial size
   */
  resetSize() {
    if (this.initialWidthSetByStyle) {
      this.style.width = `${this.initialWidthSetByStyle}`;
    } else {
      this.style.removeProperty("width");
    }

    if (this.remember) {
      localStorage.removeItem(this.remember);
    }
  }

  private leftHandle: HTMLDivElement | undefined;

  private rightHandle: HTMLDivElement | undefined;

  private initialWidthSetByStyle: string | undefined;

  private _startwidth: number = 0;

  private _handleLRM: number = 1;

  override connectedCallback() {
    // eslint-disable-next-line wc/guard-super-call
    super.connectedCallback();
    let startClosed = false;
    const openCloseState = localStorage.getItem(`${this.remember}_oc`);
    if (openCloseState === "show") {
      startClosed = false;
      this.removeAttribute("hide");
    } else {
      startClosed = this.getAttribute("hide") !== null;
    }

    if (openCloseState === "hide" || startClosed) {
      this.contentVisible = false;
      const w = this.style.width || `${this.getAttribute("minwidth")}px`;
      this.style.width = "0";
      this.setAttribute("hide", "");

      this.updateComplete.then(() => {
        const contentArea = this.shadowRoot!.getElementById("content")!;
        contentArea.style.width = w;
        this.initialWidthSetByStyle = w;
        contentArea.setAttribute("hide", "");
      });
    }
  }

  override firstUpdated(){
    this.leftHandle = this.shadowRoot!.getElementById("lefthandle") as HTMLDivElement;
    this.leftHandle.addEventListener("mousedown", this._startTrackingLeft.bind(this));
    this.leftHandle.addEventListener("dblclick", this.resetSize.bind(this));

    this.rightHandle = this.shadowRoot!.getElementById("righthandle") as HTMLDivElement;
    this.rightHandle.addEventListener("mousedown", this._startTrackingRight.bind(this));
    this.rightHandle.addEventListener("dblclick", this.resetSize.bind(this));

    this.initialWidthSetByStyle = this.style.width;
    /**
     if (this.minwidth) {
     this.style.minWidth = `${this.minwidth}px`;
     }
     */

    // restore remembered value
    if (this.remember) {
      const width = localStorage.getItem(this.remember);
      const oc = localStorage.getItem(`${this.remember}_oc`);
      if (width && !(oc === "hide")) {
        this.style.width = `${width}px`;
      }
    }
  }

  public toggle() {
    if (this.contentVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  public show(): void {
    this.contentVisible = true;
    const contentArea = this.shadowRoot!.getElementById("content")!;
    this.style.width = `${contentArea.clientWidth}px`;
    contentArea.removeAttribute("hide");
    setTimeout(() => {
      this.removeAttribute("hide");
      contentArea.style.removeProperty("width");
      if (this.remember) {
        localStorage.setItem(`${this.remember}_oc`, `show`);
      }
    }, 450);
  }

  public hide() {
    this.contentVisible = false;
    const contentArea = this.shadowRoot!.getElementById("content")!;
    contentArea.style.width = `${contentArea.clientWidth}px`;
    contentArea.setAttribute("hide", "");
    // for the width anim duration
    this.setAttribute("hide", "");
    this.style.width = "0";

    setTimeout(() => {
      if (this.remember) {
        localStorage.setItem(`${this.remember}_oc`, `hide`);
      }
    }, 450);
  }

  /**
   * Themable Styles
   * @private
   * @return {CSSResult}
   */
  static override get styles() {
    // language=CSS
    return css`
      :host {
        display: block;
        position: relative;

        transition:
          opacity 150ms linear,
          width 75ms linear;
      }

      :host([hide]) {
        transition:
          opacity 150ms linear,
          width 450ms linear;
      }

      :host([hidden]) {
        display: none;
      }

      #content {
        height: 100%;
        transition: transform 450ms linear;
      }

      :host([lefthandle][hide]) #lefthandle {
        display: none;
      }

      :host([righthandle][hide]) #righthandle {
        display: none;
      }

      :host([righthandle]) #content[hide] {
        transform: translateX(-100%);
      }

      #lefthandle:hover,
      #righthandle:hover {
        cursor: col-resize;
      }

      #lefthandle {
        position: absolute;
        left: -1rem;
        width: 1rem;
        top: 0;
        bottom: 0;
        display: none;
      }

      #righthandle {
        position: absolute;
        right: -1rem;
        width: 1rem;
        top: 0;
        bottom: 0;
        display: none;
      }

      :host([lefthandle]) #lefthandle {
        display: block;
      }

      :host([righthandle]) #righthandle {
        display: block;
      }
    `;
  }

  /**
   * @private
   * @returns {TemplateResult}
   * @private
   */
  override render() {
    // language=HTML
    return html`
      <div id="lefthandle"></div>
      <div style="overflow: hidden; height: 100%">
        <div id="content"><slot></slot></div>
      </div>
      <div id="righthandle"></div>
    `;
  }
}
