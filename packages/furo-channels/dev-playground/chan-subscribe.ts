// eslint-disable-next-line import/no-extraneous-dependencies
import { css, html, LitElement } from "lit";
import { state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

import { InputElementChannels } from "./channelsConfig";

import type { SubscriptionToken } from "@/ChannelAPI";

/**
 * ### Description
 *
 *
 * @author veith
 * @tagname chan-subscribe
 * @public
 */
export class ChanSubscribe extends LitElement {
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

  @state()
  dataChunks: string[] = [];

  private token: SubscriptionToken | undefined;

  override connectedCallback() {
    super.connectedCallback();
    this.subscribe();
    InputElementChannels.subscribe("ChannelAsTrigger", () => {
      this.dataChunks = [];
    });
  }

  unsubscribe() {
    if (this.token) {
      InputElementChannels.unsubscribe(this.token);
      this.token = undefined;
    }
  }

  subscribe() {
    if (this.token === undefined) {
      this.token = InputElementChannels.subscribe("textEntered", data => {
        this.dataChunks.unshift(data);
        this.requestUpdate();
      });
    }
  }

  /**
   * Template
   * @private
   */
  override render() {
    return html`
      <button @click="${this.unsubscribe}">unsubscribe</button>
      <button @click="${this.subscribe}">subscribe</button>
      <ul>
        ${repeat(
          this.dataChunks,
          (_, index) => index,
          st => html` <li>${st}</li> `
        )}
      </ul>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "chan-subscribe": ChanSubscribe;
  }
}

window.customElements.define("chan-subscribe", ChanSubscribe);
