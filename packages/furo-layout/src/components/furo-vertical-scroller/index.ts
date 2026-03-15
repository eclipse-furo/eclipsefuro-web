import { FuroVerticalScroller } from "./FuroVerticalScroller";

window.customElements.define("furo-vertical-scroller", FuroVerticalScroller);

declare global {
  interface HTMLElementTagNameMap {
    "furo-vertical-scroller": FuroVerticalScroller;
  }
}
