import { html, css, LitElement } from 'lit';
// eslint-disable-next-line import/extensions
import { property } from 'lit/decorators.js';
import { Defaults } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Defaults';

/**
 * ### Description
 *
 *
 * @slot {HTMLElement[]} slot-name - slot description
 * @event {MouseEvent} event-name - event description
 *
 * @author veith
 * @public
 */
export class formFuroTypeDefaults extends LitElement {
  set fieldNode(fn: Defaults) {
    this.data = fn;
    this.data.__addEventListener('field-value-changed', () => {
      this.requestUpdate();
    });
    this.requestUpdate();
  }

  /**
   * Property description
   * @public
   */
  @property({ type: Defaults })
  public data: Defaults = new Defaults();

  /**
   * Styles
   * @private
   */
  static styles = css`
    :host {
      display: block;
    }

    :host([hidden]) {
      display: none;
    }
    /* do not show components which are not defined */
    *:not(:defined) {
      display: none;
    }
  `;

  /**
   * Template
   * @private
   */
  render() {
    return html`${this.data.id}
      <hr /> `;
  }
}

window.customElements.define('form-furo-type-defaults', formFuroTypeDefaults);
