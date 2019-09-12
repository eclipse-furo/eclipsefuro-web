// Code generated by @furo/specs. DO NOT EDIT.
// source: specs/experiment/experiment_collection.type.spec
import {html, css, LitElement} from 'lit-element';
import {FBP} from "@furo/fbp";
import {Theme} from "@furo/framework/theme"
import {i18n} from "@furo/framework/i18n"


import "@furo/data-input";
import "@furo/form";

/**
 * `experiment-experimentcollection-display`
 * ExperimentCollection with repeated ExperimentEntity
 *
 * @customElement
 * @appliesMixin FBP
 */
export class ExperimentExperimentCollectionDisplay extends FBP(LitElement) {
    static get styles() {
        // language=CSS
       return Theme.getThemeForComponent('DisplayBaseTheme') || css`
            :host {
                display: block;
            }
            :host([hidden]) {
                display: none;
            }
            h1 {
                font-size: 24px;
                line-height: 24px;
                letter-spacing: 0;
                margin: 0;
                font-weight: normal;
                margin-bottom: 4px;
            }
            .secondary{
                color: var(--secondary-color, var(--on-primary-light,#777777));
                line-height: 22px;
                font-size: 14px;
                letter-spacing: 0.1px;
            }
        `
    }
    /**
     * Bind here your furo-data-object event @-object-ready
     * @public
     * @param data
     */
    bindData(data) {
        this._FBPTriggerWire('--data', data);
    }

    /**
     * @private
     * @returns {TemplateResult|TemplateResult}
     */
    render() {
        // language=HTML
        return html`
            <!--   -->
            
            
            <furo-form-layouter four>
                <!-- Meta for the response  -->
                <furo-data-display condensed double noborder ƒ-bind-data="--data(*.meta)"></furo-data-display>
                <!-- Hateoas links  -->
                <furo-data-display condensed double noborder ƒ-bind-data="--data(*.links)"></furo-data-display>
                <!-- Contains a experiment.ExperimentEntity repeated  -->
                <furo-data-display condensed double noborder ƒ-bind-data="--data(*.entities)"></furo-data-display>
            </furo-form-layouter>
            
        `;
    }
}

window.customElements.define('experiment-experimentcollection-display', ExperimentExperimentCollectionDisplay);
