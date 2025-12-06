import { FuroResponsiveLayout } from "./impl/FuroResponsiveLayout";

window.customElements.define("furo-responsive-layout", FuroResponsiveLayout);

declare global {
  interface HTMLElementTagNameMap {
    "furo-responsive-layout": FuroResponsiveLayout;
  }
}
