import { css, html, LitElement } from "lit";
// eslint-disable-next-line import/extensions
import { property } from "lit/decorators.js";

import {ResponsiveLayoutSize} from "@/types/ResponsiveLayoutSize";

/**
 *
 * ### Overview
 *
 * Use the furo-responsive-layout to structure your forms or other content.
 *
 * The heights are given by the highest `cell` in a `row`.
 *
 * > **Deprecation Warning:** The short form attributes (`tripple` instead of `layout-tripple`) will be removed in near future **(end of Q3/24)**
 *
 * It is based on a grid system with the following properties:
 *
 * #### Layout one
 *
 * ```html
 * <furo-responsive-layout layout="one">
 *   <div>Item</div>
 *   <div>Item</div>
 *   <div layout-double>layout-double</div>
 *   <div>Item</div>
 *   <div>Item</div>
 * </furo-responsive-layout>
 * ```
 * <img src="assets/layout-one.png">
 *
 * #### Layout two
 * If the container size is smaller than `breakpoint-big` the layout will collapse in a layout one.
 *
 * <img src="assets/layout-two.png">
 *
 * #### Layout three
 * If the container size is smaller than `breakpoint-big` the layout will collapse in a layout one.
 *
 * <img src="assets/layout-three.png">
 *
 *
 * #### Layout four
 * If the container size is smaller than `breakpoint-big` the layout will collapse in a layout two.
 * If the container size is smaller than `breakpoint-small` the layout will collapse in a layout one.
 *
 * <img src="assets/layout-four.png">
 *
 *
 * #### Layout six
 * If the container size is smaller than `breakpoint-big` the layout will collapse in a layout three.
 * If the container size is smaller than `breakpoint-small` the layout will collapse in a layout one.
 *
 * <img src="assets/layout-six.png">
 *
 * The ResponsiveLayout component is nestable, this means that you can put 2 six column ResponsiveLayouters in a two column ResponsiveLayout component.
 *
 * ### How to set the sizes
 * Set the following  **attributes**  to set the space your item should take.
 *
 * - **layout-double**   Uses 2 columns.
 *
 * - **layout-tripple**   Uses 3 columns.
 *
 * - **layout-full**  Uses the full width.
 *
 * - **layout-newline**   Starts always on a new line.
 *
 * - **layout-end**   Sticks to the end.
 *
 *
 * > This layouter is a clone of the furo-form-layouter component with a slightly different API.
 *
 * ### ES6 Module Import
 *
 * `import "@furo/layout/dist/furo-responsive-layout.js";`
 *
 *
 * @cssprop {1rem} [--GridRowGapSize] - width of row gap
 * @cssprop {1rem} [--GridColumnGapSize] - width of column gap
 *
 * @slot {HTMLElement[]} - slot to add content.
 * @author veith
 * @tagname furo-responsive-layout
 * @public
 */
export class FuroResponsiveLayout extends LitElement {

  /**
   * Defines the layout of the component.
   * Supported values are: one, two, three, four and six.
   *
   * @type {ResponsiveLayoutSize}
   * @typeref ResponsiveLayoutSize - "@furo/layout/dist/types/ResponsiveLayoutSize.js"
   * @defaultvalue one
   * @public
   */
  @property({
    type: ResponsiveLayoutSize,
    reflect: true,
  })
  layout: ResponsiveLayoutSize = ResponsiveLayoutSize.four;

  /**
   * Defines the size for when to switch from six to four.
   *
   * @type {number}
   * @defaultvalue 810
   * @public
   */
  @property({ type: Number, attribute: "breakpoint-six", reflect: true })
  breakpointSix: number = 1250;

  breakpointSixSmall: number = 650;

  /**
   * Defines the size for when to switch from six to three and four to two column layout.
   *
   * @type {number}
   * @defaultvalue 810
   * @public
   */
  @property({ type: Number, attribute: "breakpoint-big", reflect: true })
  breakpointBig: number = 810;

  /**
   * Defines the size for when to switch from three to one or two to one.
   *
   * @type {number}
   * @defaultvalue 405
   * @public
   */
  @property({ type: Number, attribute: "breakpoint-small", reflect: true })
  breakpointSmall: number = 405;

  /**
   *
   * @private
   */
  _fireResize() {
    this.dispatchEvent(
      new CustomEvent("layout-changed", {
        detail: this,
        bubbles: true,
        composed: true,
      }),
    );
  }

  /**
   *
   * @param width
   * @private
   */
  _checkSize(width: number) {
    if (width > 0 && width < this.breakpointSix && width > this.breakpointBig && this.layout === "six") {
      this.setAttribute("six-to-four", "");
      this.removeAttribute("six-to-two");
      this.removeAttribute("narrow");
      this.removeAttribute("narrower");
      this._fireResize();
    } else if (width > 0 && width < this.breakpointBig && width < this.breakpointSixSmall && width > this.breakpointSmall && this.layout === "six") {
      this.setAttribute("six-to-two", "");
      this.removeAttribute("six-to-four");
      this.removeAttribute("narrow");
      this.removeAttribute("narrower");
      this._fireResize();
    } else if (width > 0 && width < this.breakpointBig && width > this.breakpointSmall) {
      this.setAttribute("narrow", "");
      this.removeAttribute("six-to-four");
      this.removeAttribute("six-to-two");

      this.removeAttribute("narrower");
      this._fireResize();
    } else if (width > 0 && width <= this.breakpointSmall) {
      this.setAttribute("narrower", "");
      this.removeAttribute("six-to-four");
      this.removeAttribute("six-to-two");
      this.removeAttribute("narrow");
      this._fireResize();
    } else {
      this.removeAttribute("six-to-two");
      this.removeAttribute("six-to-four");
      this.removeAttribute("narrow");
      this.removeAttribute("narrower");
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(entries => {
        window.requestAnimationFrame(() => {
          this._checkSize(entries[0].contentRect.width);
        });
      });
      ro.observe(this);
    } else {
      // fallback, just listen to the resize event
      setTimeout(() => {
        const cr = this.getBoundingClientRect();
        this._checkSize(cr.width);
      }, 1);

      window.addEventListener("resize", this._resizeListener, true);
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("resize", this._resizeListener, true);
  }

  /**
   * @private
   */
  _resizeListener = () => {
    const cr = this.getBoundingClientRect();
    this._checkSize(cr.width);
  };

  /**
   * Themable Styles
   * @private
   * @return {CSSResult}
   */
  // language=CSS
  static override styles = css`
    :host {
      display: grid;
      grid-row-gap: var(--GridRowGapSize, 1rem);
      grid-column-gap: var(--GridColumnGapSize, 1rem);
      grid-template-columns: repeat(1, 1fr);
      align-items: start;
    }

    :host([hidden]) {
      display: none;
    }

    ::slotted(*) {
      width: 100%;
      min-width: 0;
    }

    :host([narrow]) {
      grid-template-columns: repeat(1, 1fr);
    }

    :host([narrow]) > ::slotted(*[layout-full]),
    :host([narrow]) > ::slotted(*[full]) {
      grid-column: 1 / auto;
    }

    :host([narrow-fix]) {
      grid-template-columns: repeat(1, 1fr);
    }

    :host([layout="two"]) {
      grid-template-columns: repeat(2, 1fr);
    }

    :host([layout="two"]) ::slotted(*[layout-double]),
    :host([layout="two"]) ::slotted(*[double]) {
      grid-column: span 2 / auto;
    }

    :host([layout="two"]) ::slotted(*[layout-newline]),
    :host([layout="two"]) ::slotted(*[newline]) {
      grid-column-start: 1;
      grid-column-end: 1;
    }

    :host([layout="two"]) ::slotted(*[layout-newline][layout-double]),
    :host([layout="two"]) ::slotted(*[newline][double]) {
      grid-column-start: 1;
      grid-column-end: 2;
    }

    :host([layout="two"]) ::slotted(*[layout-full]),
    :host([layout="two"]) ::slotted(*[full]) {
      grid-column: span 2 / auto;
    }

    :host([layout="two"][narrow]) > ::slotted(*),
    :host([layout="two"][narrow]) > ::slotted(*[layout-full]),
    :host([layout="two"][narrow]) > ::slotted(*[full]) {
      grid-column: 1 / auto;
    }

    :host([layout="two"][narrow]) {
      grid-template-columns: repeat(1, 1fr);
    }

    :host([layout="two"][narrow-fix]) {
      grid-template-columns: repeat(1, 1fr);
    }

    :host([layout="two"][narrow-fix]) ::slotted(*) {
      grid-column: span 1 / auto;
    }

    :host([layout="three"]) {
      grid-template-columns: repeat(3, 1fr);
    }

    :host([layout="three"]) ::slotted(*[layout-double]),
    :host([layout="three"]) ::slotted(*[double]) {
      grid-column: span 2 / auto;
    }

    :host([layout="three"]) ::slotted(*[layout-newline]),
    :host([layout="three"]) ::slotted(*[newline]) {
      grid-column-start: 1;
      grid-column-end: 2;
    }

    :host([layout="three"]) ::slotted(*[layout-newline][layout-double]),
    :host([layout="three"]) ::slotted(*[newline][double]) {
      grid-column-start: 1;
      grid-column-end: 3;
    }

    :host([layout="three"]) ::slotted(*[layout-tripple]),
    :host([layout="three"]) ::slotted(*[layout-full]),
    :host([layout="three"]) ::slotted(*[full]) {
      grid-column: span 3 / auto;
    }

    :host([layout="three"][narrow]) > ::slotted(*[layout-tripple]),
    :host([layout="three"][narrow]) > ::slotted(*[tripple]),
    :host([layout="three"][narrow]) > ::slotted(*[layout-full]),
    :host([layout="three"][narrow]) > ::slotted(*[full]) {
      grid-column: 1 / auto;
    }

    :host([layout="three"][narrow]) ::slotted(*[layout-double]),
    :host([layout="three"][narrow]) ::slotted(*[double]) {
      grid-column: span 1 / auto;
    }

    :host([layout="three"][narrow]) {
      grid-template-columns: repeat(1, 1fr);
    }

    :host([layout="three"][narrow-fix]) {
      grid-template-columns: repeat(1, 1fr);
    }

    :host([layout="three"][narrow-fix]) ::slotted(*) {
      grid-column: span 1 / auto;
    }

    :host([layout="four"]) {
      grid-template-columns: repeat(4, 1fr);
    }

    :host([layout="four"]) ::slotted(*[layout-double]),
    :host([layout="four"]) ::slotted(*[double]) {
      grid-column: span 2 / auto;
    }

    :host([layout="four"]) ::slotted(*[layout-tripple]),
    :host([layout="four"]) ::slotted(*[tripple]) {
      grid-column: span 3 / auto;
    }

    ::slotted(*[layout-end]),
    ::slotted(*[end]) {
      grid-column-end: -1;
    }

    :host([layout="four"]) ::slotted(*[layout-newline]),
    :host([layout="four"]) ::slotted(*[newline]) {
      grid-column-start: 1;
      grid-column-end: 2;
    }

    :host([layout="four"]) ::slotted(*[layout-newline][layout-double]),
    :host([layout="four"]) ::slotted(*[newline][double]) {
      grid-column-start: 1;
      grid-column-end: 3;
    }

    :host([layout="four"]) ::slotted(*[layout-newline][layout-tripple]),
    :host([layout="four"]) ::slotted(*[newline][tripple]) {
      grid-column-start: 1;
      grid-column-end: 4;
    }

    :host([layout="four"]) ::slotted(*[layout-full]),
    :host([layout="four"]) ::slotted(*[full]) {
      grid-column: span 4 / auto;
    }

    :host([layout="four"][narrow]) > ::slotted(*[layout-full]),
    :host([layout="four"][narrow]) > ::slotted(*[full]) {
      grid-column: span 2 / auto;
    }

    :host([layout="four"][narrow]) {
      grid-template-columns: repeat(2, 1fr);
    }

    :host([layout="four"][narrow-fix]) {
      grid-template-columns: repeat(2, 1fr);
    }

    :host([layout="four"][narrow-fix]) > ::slotted(*) {
      grid-column: span 1 / auto;
    }

    :host([layout="four"][narrow-fix]) > ::slotted(*[layout-double]),
    :host([layout="four"][narrow-fix]) > ::slotted(*[double]) {
      grid-column: span 2 / auto;
    }

    :host([layout="four"][narrow-fix]) > ::slotted(*[layout-full]),
    :host([layout="four"][narrow-fix]) > ::slotted(*[full]) {
      grid-column: span 2 / auto;
    }

    :host([layout="six"]) {
      grid-template-columns: repeat(6, 1fr);
    }

    :host([layout="six"]) ::slotted(*[layout-double]),
    :host([layout="six"]) ::slotted(*[double]) {
      grid-column: span 2 / auto;
    }

    :host([layout="six"]) ::slotted(*[layout-end][layout-double]),
    :host([layout="six"]) ::slotted(*[end][double]) {
      grid-column-start: -3;
      grid-column-end: -1;
    }

    :host([layout="six"]) ::slotted(*[layout-end][layout-tripple]),
    :host([layout="six"]) ::slotted(*[end][tripple]) {
      grid-column-start: -4;
      grid-column-end: -1;
    }

    :host([layout="six"]) ::slotted(*[layout-tripple]),
    :host([layout="six"]) ::slotted(*[tripple]) {
      grid-column: span 3 / auto;
    }

    :host([layout="six"]) ::slotted(*[layout-newline]),
    :host([layout="six"]) ::slotted(*[newline]) {
      grid-column-start: 1;
      grid-column-end: 2;
    }

    :host([layout="six"]) ::slotted(*[newline][double]),
    :host([layout="six"]) ::slotted(*[layout-newline][layout-double]) {
      grid-column-start: 1;
      grid-column-end: 3;
    }

    :host([layout="six"]) ::slotted(*[newline][tripple]),
    :host([layout="six"]) ::slotted(*[layout-newline][layout-tripple]) {
      grid-column-start: 1;
      grid-column-end: 4;
    }

    :host([layout="six"]) ::slotted(*[layout-full]),
    :host([layout="six"]) ::slotted(*[full]) {
      grid-column: span 6 / auto;
    }

    :host([layout="six"][narrow]) > ::slotted(*[layout-full]),
    :host([layout="six"][narrow]) > ::slotted(*[full]) {
      grid-column: span 3 / auto;
    }

    :host([layout="six"][six-to-four]) {
      grid-template-columns: repeat(4, 1fr);
    }

    :host([layout="six"][six-to-four]) > ::slotted(*[layout-full]),
    :host([layout="six"][six-to-four]) > ::slotted(*[full]) {
      grid-column: span 4 / auto;
    }

    :host([layout="six"][six-to-two]) {
      grid-template-columns: repeat(2, 1fr);
    }

    :host([layout="six"][six-to-two]) > ::slotted(*[layout-full]),
    :host([layout="six"][six-to-two]) > ::slotted(*[full]),
    :host([layout="six"][six-to-two]) > ::slotted(*[tripple]),
    :host([layout="six"][six-to-two]) > ::slotted(*[layout-tripple]),
    :host([layout="six"][six-to-two]) > ::slotted(*[double]),
    :host([layout="six"][six-to-two]) > ::slotted(*[layout-double]) {
      grid-column: span 2 / auto;
    }

    :host([layout="six"][narrow]) {
      grid-template-columns: repeat(3, 1fr);
    }

    :host([layout="six"][narrow-fix]) {
      grid-template-columns: repeat(3, 1fr);
    }

    :host([layout="six"][narrow-fix]) > ::slotted(*) {
      grid-column: span 1 / auto;
    }

    :host([layout="six"][narrow-fix]) ::slotted(*[layout-newline]),
    :host([layout="six"][narrow-fix]) ::slotted(*[newline]) {
      grid-column-start: 1;
      grid-column-end: 2;
    }

    :host([layout="six"][narrow-fix]) > ::slotted(*[layout-double]),
    :host([layout="six"][narrow-fix]) > ::slotted(*[double]) {
      grid-column: span 1 / auto;
    }

    :host([layout="six"][narrow-fix]) > ::slotted(*[layout-full]),
    :host([layout="six"][narrow-fix]) > ::slotted(*[full]) {
      grid-column: span 3 / auto;
    }

    :host([layout="four"][narrow]) > ::slotted(*[layout-tripple]),
    :host([layout="four"][narrow]) > ::slotted(*[tripple]) {
      grid-column: span 2 / auto;
    }

    :host([narrower]) {
      grid-template-columns: repeat(1, 1fr);
    }

    :host([narrower]) ::slotted(*[layout-double]),
    :host([narrower]) ::slotted(*[double]) {
      grid-column: 1 / auto;
    }

    :host([narrower][layout="six"]) ::slotted(*[layout-end][layout-double]),
    :host([narrower][layout="six"]) ::slotted(*[end][double]) {
      grid-column: 1 / auto;
    }

    :host([narrower][layout="six"]) ::slotted(*[layout-end][layout-tripple]),
    :host([narrower][layout="six"]) ::slotted(*[end][tripple]) {
      grid-column: 1 / auto;
    }

    :host([narrower]) ::slotted(*[layout-full]),
    :host([narrower]) ::slotted(*[full]) {
      grid-column: 1 / auto;
    }

    :host([narrower]) > ::slotted(*) {
      grid-column: 1 / auto;
    }

    :host([narrower]) > ::slotted([end]),
    :host([narrower]) > ::slotted(*[layout-end]),
    :host([narrower]) > ::slotted(*[layout-tripple]),
    :host([narrower]) > ::slotted([tripple]) {
      grid-column: 1 / auto;
    }

    :host([narrower-fix]) {
      grid-template-columns: repeat(1, 1fr);
    }

    :host([narrower-fix][layout="two"]) {
      grid-template-columns: repeat(1, 1fr);
    }

    :host([narrower-fix][layout="three"]) {
      grid-template-columns: repeat(1, 1fr);
    }

    :host([narrower-fix][layout="four"]) {
      grid-template-columns: repeat(1, 1fr);
    }

    :host([narrower-fix][layout="six"]) {
      grid-template-columns: repeat(1, 1fr);
    }

    :host([narrower-fix]) ::slotted(*[layout-double]),
    :host([narrower-fix]) ::slotted(*[double]) {
      grid-column: 1 / auto;
    }

    :host([narrower-fix][layout="two"]) ::slotted(*[layout-double]),
    :host([narrower-fix][layout="two"]) ::slotted(*[double]) {
      grid-template-columns: repeat(1, 1fr);
      grid-column: 1 / auto;
    }

    :host([narrower-fix][layout="three"]) ::slotted(*[layout-double]),
    :host([narrower-fix][layout="three"]) ::slotted(*[double]) {
      grid-template-columns: repeat(1, 1fr);
      grid-column: 1 / auto;
    }

    :host([narrower-fix][layout="four"]) ::slotted(*[layout-double]),
    :host([narrower-fix][layout="four"]) ::slotted(*[double]) {
      grid-template-columns: repeat(1, 1fr);
      grid-column: 1 / auto;
    }

    :host([narrower-fix][layout="six"]) ::slotted(*[layout-double]),
    :host([narrower-fix][layout="six"]) ::slotted(*[double]) {
      grid-template-columns: repeat(1, 1fr);
      grid-column: 1 / auto;
    }

    :host([narrower-fix]) > ::slotted(*[layout-full]),
    :host([narrower-fix]) > ::slotted(*[full]) {
      grid-column: 1 / auto;
    }

    :host([narrower-fix][layout="two"]) ::slotted(*[layout-full]),
    :host([narrower-fix][layout="two"]) ::slotted(*[full]) {
      grid-template-columns: repeat(1, 1fr);
      grid-column: 1 / auto;
    }

    :host([narrower-fix][layout="three"]) ::slotted(*[layout-full]),
    :host([narrower-fix][layout="three"]) ::slotted(*[full]) {
      grid-template-columns: repeat(1, 1fr);
      grid-column: 1 / auto;
    }

    :host([narrower-fix][layout="four"]) ::slotted(*[layout-full]),
    :host([narrower-fix][layout="four"]) ::slotted(*[full]) {
      grid-template-columns: repeat(1, 1fr);
      grid-column: 1 / auto;
    }

    :host([narrower-fix][layout="six"]) ::slotted(*[layout-full]),
    :host([narrower-fix][layout="six"]) ::slotted(*[full]) {
      grid-template-columns: repeat(1, 1fr);
      grid-column: 1 / auto;
    }

    :host([narrower-fix]) > ::slotted(*) {
      grid-column: 1 / auto;
    }
  `;

  /**
   * @private
   * @returns {TemplateResult}
   * @private
   */
  override render() {
    // language=HTML
    return html` <slot></slot> `;
  }
}
