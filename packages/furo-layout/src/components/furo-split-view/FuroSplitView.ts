import { LitFBP } from "@furo/fbp/dist/LitFBP";
import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";

/**
 * `furo-split-view`
 * is a layout component to visualise main / detail views (left right layout for master detail views).
 * You can add the attribute scroll on the detail view to make the content scrollable.
 *
 * ```html
 * <furo-split-view>
 *   <div slot="master">Master</div>
 *   <big-component scroll> </big-component>
 * </furo-split-view>
 * ```
 *
 * @cssprop {N/A} [--split-master-width=270px] - width of the master slot
 *
 * @slot {HTMLElement [0..n]} master - default slot to add content to the main section.
 * @slot {HTMLElement [0..n]} - default slot to add content to the detail section.
 *
 * @summary splitted layout
 * @customElement
 * @demo demo-furo-split-view Basic usage
 * @appliesMixin FBP
 */
export class FuroSplitView extends LitFBP(LitElement) {

  @property({ type: Boolean })
  /**
   * flip the left and right side
   *
   * @type Boolean
   */
  reverse: boolean = false;

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
          height: inherit;
        }

        :host([hidden]) {
          display: none;
        }

        .master {
          height: inherit;
          width: var(--split-master-width, 270px);
          min-width: var(--split-master-width, 270px);
        }

        .detail {
          height: 100%;
          position: relative;
        }

        furo-horizontal-flex {
          height: 100%;
        }

        ::slotted([scroll]) {
          height: 100%;
          overflow-y: auto;
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
      <furo-horizontal-flex ?reverse='${this.reverse}'>
        <div class='master'>
          <slot name='master'></slot>
        </div>
        <div flex class='detail'>
          <slot></slot>
        </div>
      </furo-horizontal-flex>
    `;
  }
}
