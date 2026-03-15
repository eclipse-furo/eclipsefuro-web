import { FuroEmptySpacer } from "./FuroEmptySpacer";

window.customElements.define("furo-empty-spacer", FuroEmptySpacer);

declare global {
  interface HTMLElementTagNameMap {
    "furo-empty-spacer": FuroEmptySpacer;
  }
}
