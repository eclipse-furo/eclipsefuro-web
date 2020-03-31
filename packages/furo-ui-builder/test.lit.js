// Code generated by @furo/ui-builder. DO NOT EDIT.

import {  LitElement, html, css  } from 'lit-element';
import { Theme } from '@furo/framework/theme';
import { FBP } from '@furo/fbp';

import "@furo/form/furo-form.js";
import "@furo/input/furo-button.js";
import "@furo/input/furo-password-input.js";
import "@furo/input/furo-text-input.js";
import "@furo/layout/furo-horizontal-flex.js";
import "@furo/util/src/furo-keydown.js";

/**
 * Einfaches Anmeldeformular.
 *
 * @summary Ein Anmeldeformular
 * @customElement
 * @polymer
 * @appliesMixin FBP
 */
export class LoginForm extends FBP(LitElement) {


  /**
   * @private
   * @return {Object}
   */
  static get properties() {
    return {

      // Das Kennwort. Kann auch ein TOTP sein...
      password: {
        type: String,
        reflect: true,
        attribute: "passwd",
      },
      // Der Benutzername
      username: {
        type: String,
      },
    }
  }

  //Setze den Fokus
  focus(d) {
    this._FBPTriggerWire('--focused', d)
  }


  /**
   * flow is ready lifecycle method
   */
  _FBPReady() {
    super._FBPReady();
    //this._FBPTraceWires()
  }


  /**
   * Use ƒ-bind-data to bind your data object
   * und so
   */
  bindData(field) {    this.field = field;
    this._FBPTriggerWire('--field-injected', field);

    this.field.addEventListener('field-value-changed', e => {
      if (e.detail._name === 'type') {
        this._FBPTriggerWire('--htsUpdated', this.field.link._value);
      }
      console.info("string");
    });
  }


  /**
   * Themable Styles
   * @private
   * @return {CSSResult}
   */
  static get styles() {
    // language=CSS
    return Theme.getThemeForComponent(this.component_name) || css`
      
      :host {
        display: block;
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

      <!-- Anmeldemaske mit auto-zentrierung -->
      <furo-form four label="Anmeldumg" style="width:300px;margin:100px auto; border-top:5px solid #FEA248;">
        <furo-text-input label="Username" value="${this.username}" ƒ-focus="--ButtonClicked"></furo-text-input> 

        <!-- Könnten wir noch einen zeige kennwort implementieren? Falls es nicht zu schwierig ist... -->
        <furo-password-input label="Passowort" value="${this.password}"></furo-password-input> 

        <!-- Bin mir nicht sicher ob es den überhaupt braucht -->
        <furo-horizontal-flex>
          <furo-button label="Login" @-click="--ButtonClicked"></furo-button> 
        </furo-horizontal-flex> 
      </furo-form> 

      
    
      <furo-keydown ctrl key="x" @-key="--shortcutLPressed"></furo-keydown>
    
    `;
  }
}

window.customElements.define('login-form', LoginForm);

