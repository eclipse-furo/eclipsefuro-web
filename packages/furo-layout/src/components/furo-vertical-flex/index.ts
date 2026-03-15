import { FuroVerticalFlex } from "./FuroVerticalFlex";

window.customElements.define("furo-vertical-flex", FuroVerticalFlex);

declare global {
  interface HTMLElementTagNameMap {
    "furo-vertical-flex": FuroVerticalFlex;
  }
}
