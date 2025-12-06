import { FuroBackdrop } from "./impl/FuroBackdrop";

window.customElements.define('furo-backdrop', FuroBackdrop);

declare global {
  interface HTMLElementTagNameMap {
    "furo-backdrop": FuroBackdrop;
  }
}
