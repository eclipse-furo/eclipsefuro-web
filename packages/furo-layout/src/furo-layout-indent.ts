import { FuroLayoutIndent } from "./impl/FuroLayoutIndent";

window.customElements.define("furo-layout-indent", FuroLayoutIndent);

declare global {
  interface HTMLElementTagNameMap {
    "furo-layout-indent": FuroLayoutIndent;
  }
}
