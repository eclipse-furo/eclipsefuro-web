import { css, html, LitElement } from "lit";

/**
 *
 * ### Overview
 *
 * Use this to arrange your content vertically.
 *
 * ### Usage
 *
 * The Elements you place inside the default slot can have the following attributes:
 *
 *  - <b>flex</b>: Makes the element use the "rest" of the space (flex: 1).
 *  - <b>scroll</b>: Makes the element scrollable.
 *  - <b>padding-inline</b>: Applies inline padding.
 *
 *
 * ### Component Import
 * `import "@furo/layout/dist/VerticalFlex.js";`
 *
 *
 * @slot {HTMLElement[]}  - slot to add content.
 *
 * @event {CustomEvent} scroll-down - Fired when the scroll area scrolls down
 * @event {CustomEvent} scroll-up - Fired when the scroll area scrolls up
 * @author Furo
 * @tagname furo-vertical-flex
 * @public
 */
export class FuroVerticalFlex extends LitElement {
  override connectedCallback() {
    super.connectedCallback();
    this.setAttribute("furo-vertical-flex", "");
  }

  /**
   * Themable Styles
   * @private
   * @return {CSSResult}
   */
    // language=CSS
  static override styles = css`
    :host {
      height: 100%;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      -ms-flex-direction: column;
      -webkit-flex-direction: column;
      flex-direction: column;
    }

    :host([hidden]) {
      display: none;
    }

    :host([reverse]) {
      -ms-flex-direction: column-reverse;
      -webkit-flex-direction: column-reverse;
      flex-direction: column-reverse;
    }

    ::slotted(.padding-inline),
    ::slotted(*[padding-inline]) {
      padding-inline-start: var(--MediaSizeIndentationStart, 1rem);
      padding-inline-end: var(--MediaSizeIndentationEnd, 1rem);
    }

    ::slotted(.margin-block),
    ::slotted(*[margin-block]) {
      margin-block-start: var(--MediaSizeIndentationTop, 1rem);
      margin-block-end: var(--MediaSizeIndentationBottom, 1rem);
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

    ::slotted([layout-scroll]),
    ::slotted(.scroll),
    ::slotted([scroll]) {
      height: 100%;
      overflow-y: auto;
    }

    @media print {
      ::slotted([layout-scroll]),
      ::slotted(.scroll),
      ::slotted([scroll]) {
        overflow: unset;
      }
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

