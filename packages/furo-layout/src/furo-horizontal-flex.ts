import { FuroHorizontalFlex } from "./impl/FuroHorizontalFlex";

window.customElements.define("furo-horizontal-flex", FuroHorizontalFlex);

declare global {
  interface HTMLElementTagNameMap {
    "furo-horizontal-flex": FuroHorizontalFlex;
  }
}
