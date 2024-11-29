import { html, css, LitElement } from 'lit';
// eslint-disable-next-line import/extensions
import { property } from 'lit/decorators.js';
import { LitFBP } from '@furo/fbp/dist/LitFBP';

import '@furo/open-models/dist/protoc-gen-open-models/init.js';

import './form-string.js';
import './form-furo-type-defaults';
import './form-number';
import { Defaults } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Defaults.js';
import { Numeric } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Numeric.js';

/**
 * ### Description
 *
 *
 *
 * @author veith
 * @tagname page-index
 * @public
 */
export class pageIndex extends LitFBP(LitElement) {
  private ftd: Defaults;

  private ftn: Numeric;

  @property({ type: Boolean, attribute: 'invalid', reflect: true })
  // eslint-disable-next-line lit/no-classfield-shadowing
  invalid: boolean = false;

  constructor() {
    super();

    this.ftd = new Defaults();

    this.ftd.repeatedDecimal = [
      { value: '12' },
      { value: '14' },
      { value: '33' },
    ];

    this.ftd.decRange = { start: { value: '12' }, end: { value: '13' } };
    this.ftd.__addEventListener('field-value-changed', () => {
      this.requestUpdate();
    });

    this.ftd.__addEventListener('validity-changed', e => {
      console.log(
        this.ftd.__isValid,
        e.detail.__isValid,
        e.detail.__meta.valueState,
        e.detail.__meta.stateMessage,
        e.detail.__meta.typeName,
      );
      this.invalid = !this.ftd.__isValid;
    });

    console.log(this.ftd.__toJson());
    // numeric
    this.ftn = new Numeric();

    this.ftn.__addEventListener('field-value-changed', () => {
      this.requestUpdate();
    });
  }

  addRepeatedDecimal() {
    this.ftd.repeatedDecimal.add({ value: '0' });
  }

  validateAll() {
    this.ftd.__validate();
  }

  /**
   * FBP lifecycle
   * @private
   */
  protected _FBPReady() {
    super._FBPReady();
  }

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

    .validity {
      margin-top: 0.5rem;
      background-color: aquamarine;
      height: 2px;
    }

    :host([invalid]) .validity {
      background-color: red;
    }
  `;

  /**
   * Template
   * @private
   */
  render() {
    return html`
      <hr>
      ${this.ftd}
      <hr>

      <button @click="${this.validateAll}">validate all</button>
      <div class="validity"></div>
      <hr>
      Numeric <br>
      <form-number .fieldNode="${this.ftn.primitiveInt32}"></form-number>
      <form-number .fieldNode="${this.ftn.primitiveInt32}"></form-number>

      ${this.ftn.repeatedPrimitiveInt32.map(
        v => html` <form-number .fieldNode="${v}"></form-number> `,
      )}

      ${this.ftn.repeatedPrimitiveInt32.map(
        v => html` <form-number .fieldNode="${v}"></form-number> `,
      )}

      <button @click="${() => {
        this.ftn.repeatedPrimitiveInt32.add(0);
      }}">add
      </button>

      <hr>
      ${this.ftd.id.__label}: <br>
      <form-string .fieldNode="${this.ftd.id}"></form-string>
      <form-string .fieldNode="${this.ftd.id}"></form-string>
      <form-furo-type-defaults .fieldNode="${this.ftd}"></form-furo-type-defaults>


      <hr>
      <table>
        <tr>
          <td>
            <ul>
              ${this.ftd.repeatedDecimal.map(
                v => html`
                  <li>
                    <form-number .fieldNode="${v}"></form-number>
                  </li>
                `,
              )}
            </ul>
          </td>
          <td>
            <ul>
              ${this.ftd.repeatedDecimal.map(
                v =>
                  html` <li>
                    <form-number .fieldNode="${v}"></form-number>
                  </li>`,
              )}</li>
            </ul>
          </td>
        </tr>
      </table>

      <button @click="${this.addRepeatedDecimal}">add</button>
    `;
  }
}

window.customElements.define('page-index', pageIndex);
