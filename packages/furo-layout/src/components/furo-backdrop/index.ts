import { FuroBackdrop } from "./FuroBackdrop";
import { FuroBackdropDisplay } from "./FuroBackdropDisplay";

window.customElements.define("furo-backdrop", FuroBackdrop);
window.customElements.define("furo-backdrop-display", FuroBackdropDisplay);

declare global {
  interface HTMLElementTagNameMap {
    "furo-backdrop": FuroBackdrop;
    "furo-backdrop-display": FuroBackdropDisplay;
  }
}
