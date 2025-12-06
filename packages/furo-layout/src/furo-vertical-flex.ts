import { FuroVerticalFlex } from "./impl/FuroVerticalFlex";

window.customElements.define("furo-vertical-flex", FuroVerticalFlex);

declare global {
  interface HTMLElementTagNameMap {
    "furo-vertical-flex": FuroVerticalFlex;
  }
}
