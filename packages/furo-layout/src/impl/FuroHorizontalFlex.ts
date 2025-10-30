import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";

/**
 *
 * ### Overview
 * With the HorizontalFlex component, any elements can be aligned horizontally. Similar to css flex.
 * The attribute "flex" must be set for growing elements.
 * The component takes up 100% of the space.
 *
 *
 *
 *  Tags: layout
 *
 * For the `furo-horizontal-flex`
 * ### ES6 Module Import
 *
 * `import "@furo/layout/dist/HorizontalFlex.js";`
 *
 * @slot {HTMLElement[]} default - slot to add content.
 * @slot {HTMLElement[]}  - slot to add content.
 * @slot {HTMLElement[]}  - slot to add content.
 *
 * @cssprop {N/A} [--furo-horizontal-flex-space=0.5rem] - default spacing. If not set --MediaSizeIndentationBottom is used.
 * @attribute {bool} space - Give inner spacing to the elements.
 * @attribute {bool} v-align-start - Aligns the elements vertically at position start.
 * @attribute {bool} v-align-center - Aligns the elements vertically at position center.
 * @attribute {bool} v-align-end - Aligns the elements vertically at position end.
 *
 * @cssprop {0.5rem} --furo-horizontal-flex-space - Spacing between the elements.
 * @constructor
 * @summary horizontal alignment
 * @tagname furo-horizontal-flex
 * @public
 */
export class FuroHorizontalFlex extends LitElement {
  override connectedCallback() {
    super.connectedCallback();
    this.setAttribute("furo-horizontal-flex", "");
  }

  /**
   * A query selector which should match with navigation items.
   * "button, ui5-button, icon"
   *
   * @attr {string} navigation-item-selector
   */
  @property({ type: String, attribute: "navigation-item-selector" })
  public navigationItemSelector: string = "*";

  /**
   * Set this to true, to add spacing between the elements. The default value of the spacing is 0.5 rem. Use the `--furo-horizontal-flex-space` css prop to override.
   */
  @property({ type: Boolean })
  public space: boolean = false;

  /**
   * Aligns the elements vertically at the position `start`
   * @attr {boolean} v-align-start
   */
  @property({ type: Boolean, attribute: "v-align-start" })
  public vAlignStart: boolean = false;

  /**
   * Aligns the elements vertically at the position `center`
   * @attr {boolean} v-align-center
   */
  @property({ type: Boolean, attribute: "v-align-center" })
  public vAlignCenter: boolean = false;

  /**
   * Aligns the elements vertically at the position `end`
   * @attr {boolean} v-align-end
   */
  @property({ type: Boolean, attribute: "v-align-end" })
  public vAlignEnd: boolean = false;

  /**
   * Themable Styles
   * @private
   * @return {CSSResult}
   */
    // language=CSS
  static override styles = css`
    :host {
      width: 100%;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      -ms-flex-direction: row;
      -webkit-flex-direction: row;
      flex-direction: row;
    }

    :host([v-align-start]) {
      align-items: start;
    }

    :host([v-align-start]) ::slotted(*) {
      align-content: start;
    }

    :host([v-align-center]) {
      align-items: center;
    }

    :host([v-align-center]) ::slotted(*) {
      align-content: center;
    }

    :host([v-align-end]) {
      align-items: end;
    }

    :host([v-align-end]) ::slotted(*) {
      align-content: end;
    }

    :host([reverse]) {
      -ms-flex-direction: row-reverse;
      -webkit-flex-direction: row-reverse;
      flex-direction: row-reverse;
    }

    ::slotted(.flex),
    ::slotted(*[layout-flex]),
    ::slotted(*[flex]) {
      -ms-flex: 1 1 0.000000001px;
      -webkit-flex: 1;
      flex: 1;
      -webkit-flex-basis: 0.000000001px;
      flex-basis: 0.000000001px;
    }

    :host([hidden]) {
      display: none;
    }

    :host([space]) ::slotted(*:not(:first-child)) {
      margin-left: var(--furo-horizontal-flex-space, 0.5rem);
    }

    :host([space]) ::slotted(*:not(:last-child)) {
      margin-right: var(--furo-horizontal-flex-space, 0.5rem);
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

declare global {
  interface HTMLElementTagNameMap {
    "furo-horizontal-flex": FuroHorizontalFlex;
  }
}
