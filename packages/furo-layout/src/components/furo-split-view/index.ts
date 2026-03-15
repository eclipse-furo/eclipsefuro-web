import { FuroSplitView } from "./FuroSplitView";

window.customElements.define("furo-split-view", FuroSplitView);

declare global {
  interface HTMLElementTagNameMap {
    "furo-split-view": FuroSplitView;
  }
}
