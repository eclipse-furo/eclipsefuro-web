// eslint-disable-next-line import/no-extraneous-dependencies
import {css, html, LitElement} from "lit";

import { InputElementChannels } from "./channelsConfig";

/**
 * ### Description
 * Sends data to the cannel "textEntered" when something was entered in to the input field.
 *
 * @author veith
 * @tagname chan-produce
 * @public
 */
export class ChanProduce extends LitElement {

  /**
   * Styles
   * @private
   */
  static override styles = css`
    :host {
      display: block;
    }

    :host([hidden]){
      display: none;
    }
    /* do not show components which are not defined */
    *:not(:defined) {
      display: none;
    }
  `;

  // eslint-disable-next-line class-methods-use-this
  publish(e:KeyboardEvent){
    InputElementChannels.publish("textEntered",(e.target as HTMLInputElement).value)
  }

  /**
   * Template
   * @private
   */
  override render() {
    return html`<input type='text' @input='${this.publish}'>`;
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'chan-produce': ChanProduce;
  }
}

window.customElements.define('chan-produce', ChanProduce);
