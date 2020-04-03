// Code generated by @furo/ui-builder. DO NOT EDIT.
import {  html, css  } from 'lit-element';
import {  Theme  } from '@furo/framework/theme.js';

// eslint-disable-next-line no-unused-vars
import {  i18n  } from '@furo/framework/i18n.js';
import {  BasePanel  } from '@furo/route/src/lib/BasePanel.js';

import "@furo/layout/src/furo-vertical-flex.js";
import "@furo/layout/src/furo-panel.js";
import "@furo/navigation/src/furo-panel-head.js";
import "@furo/data/furo-entity-agent.js";
import "@furo/data/furo-data-object.js";
import "../experiment/experiment-experiment-form.js";
import "./experiment-experiment-update-action.js";

/**
 * service specs for the experiment api
 *
 * @summary todo: write summary
 * @customElement
 * @polymer
 * @appliesMixin FBP
 */
export class ExperimentExperimentUpdatePanel extends BasePanel {



  // Inject HATEOAS Link Object for the specific service.
  htsIn(d) {
    this._FBPTriggerWire('--htsIn', d)
  }


  /**
   * flow is ready lifecycle method
   */
  _FBPReady() {
    super._FBPReady();
    // this._FBPTraceWires()
  }



  /**
   * Themable Styles
   * @private
   * @return {CSSResult}
   */
  static get styles() {
    // language=CSS
    return Theme.getThemeForComponent("ExperimentExperimentUpdatePanel") || css`
      
      :host {
        background-color: var(--update-panel-background, var(--surface, white));
        color: var(--on-update-panel-background, var(--on-surface, black));
        display: block;
        height: 100%;
        overflow: hidden;
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

      <!-- controlls the flexing and scrolling -->
      <furo-vertical-flex>

        <!--   -->
        <furo-panel no-margin>

          <!-- This will show the display_name and a description -->
          <furo-panel-head ƒ-bind-data="--entity(*.data)"></furo-panel-head> 
        </furo-panel> 

        <!-- The main panel, this panel scrolls -->
        <furo-panel no-margin flex scroll>

          <!-- The form for the type experiment.Experiment -->
          <experiment-experiment-form ƒ-bind-data="--entity(*.data)"></experiment-experiment-form> 
        </furo-panel> 

        <!-- This panel stays on the bottom of the page -->
        <furo-panel no-margin>

          <!-- The events of the updateaction are mostly wired to the entity-agent below -->
          <experiment-experiment-update-action @-delete-req="--deleteReq" @-reset-req="--resetReq" @-self-req="--selfReq" @-update-req="--updateReq" ƒ-bind-entity="--entity" ƒ-disable-all="--requestStarted" ƒ-enable-all="--response, --responseError"></experiment-experiment-update-action> 
        </furo-panel> 
      </furo-vertical-flex> 

      <!-- Trigger the banner on errors -->
      <furo-banner dismiss-button-text="${i18n.t('banner.action.close')}" icon="error-outline" ƒ-parse-grpc-status="--error" ƒ-show="--error"></furo-banner> 

      <!-- Agent for the service ExperimentService -->
      <furo-entity-agent load-on-hts-in service="ExperimentService" @-fatal-error="--error, ^^activity-stopped" @-request-started="--requestStarted, ^^activity-started" @-response="--response, ^^activity-stopped" @-response-error="--error, ^^activity-stopped" ƒ-bind-request-data="--entity(*.data)" ƒ-delete="--deleteReq" ƒ-hts-in="--navNode(*._value.link), --htsIn" ƒ-load="--selfReq" ƒ-put="--updateReq"></furo-entity-agent> 

      <!-- DAO for type experiment.ExperimentEntity -->
      <furo-data-object type="experiment.ExperimentEntity" @-object-ready="--entity" ƒ-inject-raw="--response" ƒ-reset="--resetReq"></furo-data-object> 
    `;
  }
}

window.customElements.define('experiment-experiment-update-panel', ExperimentExperimentUpdatePanel);

