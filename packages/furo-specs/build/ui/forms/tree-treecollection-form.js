// Code generated by @furo/specs. DO NOT EDIT.
// source: specs/tree/tree_collection.type.spec
import {html, css, LitElement} from 'lit-element';
import {FBP} from "@furo/fbp";
import {Theme} from "@furo/framework/theme"
import {i18n} from "@furo/framework/i18n"


import "@furo/data-input";
import "@furo/form";

/**
 * `tree-treecollection-form`
 * TreeCollection with repeated TreeEntity
 *
 * @customElement
 * @appliesMixin FBP
 */
export class TreeTreeCollectionForm extends FBP(LitElement) {
    static get styles() {
        // language=CSS
       return Theme.getThemeForComponent('FormBaseTheme') || css`
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
                <furo-data-text-input condensed double ƒ-bind-data="--data(*.meta)"></furo-data-text-input>
                <!-- Hateoas links  -->
                <furo-data-text-input condensed double ƒ-bind-data="--data(*.links)"></furo-data-text-input>
                <!-- Contains a tree.TreeEntity repeated  -->
                <furo-data-text-input condensed double ƒ-bind-data="--data(*.entities)"></furo-data-text-input>
            </furo-form-layouter>
            
        `;
    }
}

window.customElements.define('tree-treecollection-form', TreeTreeCollectionForm);
