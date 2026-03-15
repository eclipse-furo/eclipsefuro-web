import { LitFBP } from "@furo/fbp/dist/LitFBP";
import { css,html, LitElement } from 'lit';

/**
 * `furo-vertical-scroller`
 *
 * ```html
 * <furo-vertical-scroller>
 *   <your-content></your-content>
 * </furo-vertical-scroller>
 * ```
 * @cssprop {N/A} [--surface=white] - Background color scrollbar
 * @cssprop {N/A} [--on-surface=black] - Background color of the draggable scrolling element
 *
 * @slot {HTMLElement [0..n]} - default slot to add content.
 *
 * @summary vertical scroll
 * @customElement
 * @demo demo-furo-vertical-scroller Basic usage
 * @appliesMixin FBP
 */
export class FuroVerticalScroller extends LitFBP(LitElement) {
  /**
   *
   * @private
   * @return {CSSResult}
   */
  static override get styles() {
    // language=CSS
    return (

      css`
        :host {
          display: block;
          height: 100%;
          overflow-y: auto;
        }

        :host([hidden]) {
          display: none;
        }
      `
    );
  }

  /**
   * @private
   * @returns {TemplateResult}
   */
  override render() {
    // language=HTML
    return html`
      <slot></slot>
    `;
  }
}
