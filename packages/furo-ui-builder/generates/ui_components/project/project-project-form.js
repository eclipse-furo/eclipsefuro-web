// Code generated by @furo/ui-builder. DO NOT EDIT.
import {  LitElement, html, css  } from 'lit';
import { Theme } from '@furo/framework/src/theme.js';
import { FBP } from '@furo/fbp';

// eslint-disable-next-line no-unused-vars
import { i18n } from '@furo/framework/src/i18n.js';

import "@furo/data-input";
import "@furo/form";
import "../person/person-person-repeat.js";

/**
 * Project description
 *
 * @summary todo: write summary
 * @customElement
 * @polymer
 * @appliesMixin FBP
 */
export class ProjectProjectForm extends FBP(LitElement) {


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

          <!-- field: start -->
          <furo-data-date-input condensed double ƒ-bind-data="--data(*.start)" ƒ-focus="--focused"></furo-data-date-input>

          <!-- field: end -->
          <furo-data-date-input condensed double ƒ-bind-data="--data(*.end)"></furo-data-date-input>

          <!-- field: description -->
          <furo-data-text-input condensed double ƒ-bind-data="--data(*.description)"></furo-data-text-input>

          <!-- field: members -->
          <person-person-repeat condensed double header-text="${i18n.t('form.project.project.members.header.text')}" secondary-text="${i18n.t('form.project.project.members.secondary.text')}" ƒ-bind-data="--data(*.members)"></person-person-repeat>

          <!-- field: cost_limit -->
          <furo-data-money-input align-right ƒ-bind-data="--data(*.cost_limit)"></furo-data-money-input>

          <!-- field: update_mask -->
          <furo-data-text-input condensed double ƒ-bind-data="--data(*.update_mask)"></furo-data-text-input>
        </furo-form-layouter>
      </furo-form>
    `;
  }
}

window.customElements.define('project-project-form', ProjectProjectForm);

