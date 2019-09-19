// Code generated by @furo/specs. DO NOT EDIT.
// source: project.project.referencesearch.spec
import { LitElement, html, css } from 'lit-element';
import {Theme} from "@furo/framework/theme"
import {FBP} from "@furo/fbp";
import "@furo/data"
import "@furo/data-input"



/**
 * `project-project-reference-search`
 *  Complete reference searcher for project.Project
 *
 *  
 *
 * @summary search project.Project
 * @customElement
 * @appliesMixin FBP
 */
class ProjectProjectReferenceSearch extends FBP(LitElement) {

  bindData(field){
    this._FBPTriggerWire("--field-injected", field);
  }
  /**
   * Themable Styles
   * @private
   * @return {CSSResult}
   */
  static get styles() {
    // language=CSS
    return Theme.getThemeForComponent('ReferenceBaseTheme') || css`
        :host {
            display: block;
        }

        :host([hidden]) {
            display: none;
        }
        furo-data-reference-search{
            width:100%;
        }
    `
  }

  static get properties() {
    return {
      /**
       * The default style (md like) supports a condensed form. It is a little bit smaller then the default
       */
      condensed: {
        type: Boolean
      }
    };
  }
  /**
   * @private
   * @returns {TemplateResult}
   * @private
   */
  render() {
    // language=HTML
    return html`
      <furo-data-reference-search ƒ-bind-data="--field-injected"
                                  @-search="--term"
                                  ?condensed="${this.condensed}"
                                  ƒ-collection-in="--collection">
      </furo-data-reference-search>
      <furo-collection-agent
              service="ProjectService"
              ƒ-hts-in="--field-injected(*.link.value)"
              ƒ-search="--term"
              @-response="--collection">
      </furo-collection-agent>
    `;
  }
}

window.customElements.define('project-project-reference-search', ProjectProjectReferenceSearch);
