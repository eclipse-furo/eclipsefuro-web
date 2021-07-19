// Code generated by @furo/ui-builder. DO NOT EDIT.
import {  LitElement, html, css  } from 'lit-element';
import { Theme } from '@furo/framework/src/theme.js';
import { FBP } from '@furo/fbp';

// eslint-disable-next-line no-unused-vars
import { i18n } from '@furo/framework/src/i18n.js';

import "@furo/data-input";
import "@furo/form";

/**
 * Represents an amount of money with its currency type. https://github.com/googleapis/googleapis/blob/master/google/money.proto
 *
 * @summary todo: write summary
 * @customElement
 * @polymer
 * @appliesMixin FBP
 */
export class GoogleTypeMoneyForm extends FBP(LitElement) {


  /**
   * @private
   * @return {Object}
   */
  static get properties() {
    return {

      // Header text to label the form
      headerText: {
        type: String,
        attribute: "header-text",
      },
      // Secondary text for a detailed description
      secondaryText: {
        type: String,
        attribute: "secondary-text",
      },
    }
  }

  // Fokus
  focus(d) {
    this._FBPTriggerWire('--focused', d)
  }


  /**
   * flow is ready lifecycle method
   * @private
   */
  _FBPReady() {
    super._FBPReady();
    // this._FBPTraceWires()
  }


  /**
   *  Bind your furo-data-object event @-object-ready
   * @public
   * @param data
   */
  bindData(data) {
    this._FBPTriggerWire('--data', data);
    this.field = data;
  }


  /**
   * Themable Styles
   * @private
   * @return {CSSResult}
   */
  static get styles() {
    // language=CSS
    return Theme.getThemeForComponent("FormBaseTheme") || css`

      :host {
        display: block;
      }

      :host(.in-repeater) {
        border-bottom: 1px solid var(--separator, #FAFAFA);
      }

      :host([hidden]) {
        display: none;
      }

    `
  }


  /**
   * @private
   * @returns {TemplateResult}
   * @private
   */
  render() {
    // language=HTML
    return html`

      <!-- It is a good practice to set a description -->
      <furo-form header-text="${this.headerText?this.headerText:""}" secondary-text="${this.secondaryText?this.secondaryText:""}">

        <!-- It is a good practice to set a description -->
        <furo-form-layouter four>

          <!-- field: currency_code -->
          <furo-data-text-input condensed double ƒ-bind-data="--data(*.currency_code)" ƒ-focus="--focused"></furo-data-text-input>

          <!-- field: units -->
          <furo-data-number-input condensed double ƒ-bind-data="--data(*.units)"></furo-data-number-input>

          <!-- field: nanos -->
          <furo-data-number-input condensed double ƒ-bind-data="--data(*.nanos)"></furo-data-number-input>
        </furo-form-layouter>
      </furo-form>
    `;
  }
}

window.customElements.define('google-type-money-form', GoogleTypeMoneyForm);

