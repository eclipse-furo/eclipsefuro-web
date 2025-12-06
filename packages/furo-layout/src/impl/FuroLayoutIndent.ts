import { css, html, LitElement } from "lit";
// eslint-disable-next-line import/extensions
import { property } from "lit/decorators.js";

import { BackgroundDesign} from "@/types/BackgroundDesign";

/**
 * ### Description
 * `furo-layout-indent` is a layout component for adding the responsive spacing.
 *
 * By default, the indentation are set for block and inline.
 *
 * #### ES6 Module Import
 *
 * `import "@furo/webcomponents/dist/LayoutIndent.js";`
 *
 * @slot {HTMLElement[]}  - Place your components here
 *
 * @author FURO Furo
 * @tagname furo-layout-indent
 * @public
 */
export class FuroLayoutIndent extends LitElement {
  /**
   * Chose a background design.
   * @public
   * @typeref BackgroundDesign - "../types/BackgroundDesign"
   */
  @property({
    type: BackgroundDesign,
    attribute: "background-design",
    reflect: true,
  })
  backgroundDesign: BackgroundDesign = BackgroundDesign.Transparent;

  /**
   * Adds indentation on block (top/bottom) only.
   * @public
   */
  @property({ type: Boolean, reflect: true, attribute: "block" })
  public block: boolean = false;

  /**
   * Adds indentation on block-start  only.
   * @public
   */
  @property({ type: Boolean, reflect: true, attribute: "block-start" })
  public blockStart: boolean = false;

  /**
   * Adds indentation on block-end  only.
   * @public
   */
  @property({ type: Boolean, reflect: true, attribute: "block-end" })
  public blockEnd: boolean = false;

  /**
   * Adds indentation on inline (left/right) only.
   * @public
   */
  @property({ type: Boolean, reflect: true, attribute: "inline" })
  public inline: boolean = false;

  /**
   * Adds indentation on inline-start only.
   * @public
   */
  @property({ type: Boolean, reflect: true, attribute: "inline-start" })
  public inlineStart: boolean = false;

  /**
   * Adds indentation on inline-start only.
   * @public
   */
  @property({ type: Boolean, reflect: true, attribute: "inline-end" })
  public inlineEnd: boolean = false;

  /**
   * Adds scrolling behaviour if used inside a `furo-vertical-flex`
   * @public
   */
  @property({ type: Boolean, reflect: true, attribute: "scroll" })
  public scrolls: boolean = false;

  /**
   * Set flex behaviour if used inside a `furo-vertical-flex` / `furo-horizontal-flex`
   * @public
   */
  @property({ type: Boolean, reflect: true, attribute: "flex" })
  public flex: boolean = false;

  override render() {
    return html` <slot></slot>`;
  }

  static override styles = css`
    :host {
      display: block;
    }

    :host(:not([inline]):not([block]):not([inline-start]):not([block-start]):not([inline-end]):not([block-end])) {
      padding: var(--MediaSizeIndentation, 1rem 2rem 0.5rem 2rem);
    }

    /* BackgroundDesign */

    :host([background-design="Solid"]) {
      background: var(--sapGroup_ContentBackground, white);
    }

    :host([background-design="List"]) {
      background-color: var(--sapList_Background);
    }

    /* Paddings */

    :host([inline]) {
      padding-inline-end: var(--MediaSizeIndentationEnd, 2rem);
      padding-inline-start: var(--MediaSizeIndentationStart, 2rem);
    }

    :host([inline-start]) {
      padding-inline-start: var(--MediaSizeIndentationStart, 2rem);
    }

    :host([inline-end]) {
      padding-inline-end: var(--MediaSizeIndentationEnd, 2rem);
    }

    :host([block]) {
      padding-block-start: var(--MediaSizeIndentationTop, 1rem);
      padding-block-end: var(--MediaSizeIndentationBottom, 0.5rem);
    }

    :host([block-start]) {
      padding-block-start: var(--MediaSizeIndentationTop, 1rem);
    }

    :host([block-end]) {
      padding-block-end: var(--MediaSizeIndentationBottom, 0.5rem);
    }
  `;
}
