import { FuroPages } from './FuroPages';

/**
 * Page routing component
 *
 * @extends FuroPages
 * @tagname furo-pages
 */
window.customElements.define('furo-pages', FuroPages);

declare global {
  interface HTMLElementTagNameMap {
    "furo-pages": FuroPages;
  }
}
