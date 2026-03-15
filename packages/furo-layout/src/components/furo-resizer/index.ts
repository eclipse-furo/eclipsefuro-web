import { FuroResizer } from "./FuroResizer";

window.customElements.define("furo-resizer", FuroResizer);

declare global {
  interface HTMLElementTagNameMap {
    "furo-resizer": FuroResizer;
  }
}
