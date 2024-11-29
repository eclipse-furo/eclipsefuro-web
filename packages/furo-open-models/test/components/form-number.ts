import { html, css, LitElement } from 'lit';
// eslint-disable-next-line import/extensions
import { property } from 'lit/decorators.js';

import { LitFBP } from '@furo/fbp/dist/LitFBP';
// import { INT32 } from '@furo/open-models/dist/';
import { Decimal } from '@furo/open-models/dist/protoc-gen-open-models/furo/type/Decimal';
import { INT32 } from '@furo/open-models/dist';

/**
 * ### Description
 *
 *
 * @author veith
 * @tagname form-number
 * @public
 */
export class formNumber extends LitFBP(LitElement) {
  /**
   * Property description
   * @public
   */
  @property({ type: String })
  // eslint-disable-next-line lit/no-classfield-shadowing
  public value: string = '';

  private _fieldNode: Decimal | INT32 | undefined;

  @property({ type: String })
  // eslint-disable-next-line lit/no-classfield-shadowing
  private stateMessage: string = '';

  get fieldNode(): Decimal | INT32 | undefined {
    return this._fieldNode;
  }

  set fieldNode(value: Decimal | INT32) {
    this.bindData(value);
  }

  private bindData(value: Decimal | INT32) {
    this._fieldNode = value;

    this._fieldNode.__addEventListener('field-value-changed', () => {
      this.assignValue();
      this.requestUpdate();
    });

    this._fieldNode.__addEventListener('state-changed', e => {
      this.setAttribute('value-state', e.detail.__meta.valueState);
      this.stateMessage = e.detail.__meta.stateMessage;
    });

    this.assignValue();

    this.requestUpdate();
  }

  private assignValue() {
    switch (this._fieldNode!.__meta.typeName) {
      case 'furo.type.Decimal':
        this.value = (this._fieldNode as Decimal).value.value;
        break;
      case 'primitives.INT32':
        this.value = (this._fieldNode as INT32).value.toString();
        break;

      default:
        console.warn(
          'Unsupported field node type',
          this._fieldNode!.__meta.typeName,
        );
    }
  }

  applyChanges(e: InputEvent) {
    if (this._fieldNode === undefined) {
      console.warn('No bindings');
    }

    const v = parseInt((e.target as HTMLInputElement).value, 10);
    switch (this._fieldNode!.__meta.typeName) {
      case 'furo.type.Decimal':
        (this._fieldNode as Decimal).value = (
          e.target as HTMLInputElement
        ).value;
        break;

      case 'primitives.INT32':
        if (Number.isNaN(v)) {
          (this._fieldNode as INT32).value = 0;
        } else {
          (this._fieldNode as INT32).value = v;
        }

        break;

      default:
        console.warn(
          'Unsupported field node type',
          this._fieldNode!.__meta.typeName,
        );
    }
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
      display: inline-block;
    }

    :host([hidden]) {
      display: none;
    }

    :host([value-state='Error']) {
      border-bottom: 2px solid red;
    }
  `;

  /**
   * Template
   * @private
   */
  render() {
    return html` <input
        type="number"
        .value="${this.value}"
        @input="${this.applyChanges}"
      />
      ${this.stateMessage}`;
  }
}

window.customElements.define('form-number', formNumber);
