// eslint-disable-next-line import/no-extraneous-dependencies
import { css, html, LitElement } from "lit";
// eslint-disable-next-line import/no-extraneous-dependencies
import { property } from "lit/decorators.js";

import { InputElementChannels } from "./channelsConfig";

/**
 * ### Description
 *
 *
 * @author veith
 * @tagname chan-trigger
 * @public
 */
export class ChanTrigger extends LitElement {
  /**
   * Property description
   * @public
   */
  @property({ type: String, attribute: "attr-name", reflect: true })
  attrName: string = "";

  /**
   * Styles
   * @private
   */
  static override styles = css`
    :host {
      display: block;
    }

    :host([hidden]) {
      display: none;
    }
    /* do not show components which are not defined */
    *:not(:defined) {
      display: none;
    }
  `;

  // eslint-disable-next-line class-methods-use-this
  sendClear(): void {
    InputElementChannels.publish("ChannelAsTrigger", undefined);
  }

  /**
   * Template
   * @private
   */
  override render() {
    return html`<button @click="${this.sendClear}">clear</button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "chan-trigger": ChanTrigger;
  }
}

window.customElements.define("chan-trigger", ChanTrigger);
