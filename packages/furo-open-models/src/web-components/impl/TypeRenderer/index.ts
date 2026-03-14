import { TypeRenderer } from './TypeRenderer';

window.customElements.define('furo-type-renderer', TypeRenderer);

declare global {
  interface HTMLElementTagNameMap {
    'furo-type-renderer': TypeRenderer;
  }
}
