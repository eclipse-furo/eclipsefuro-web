// Code generated by @furo/specs. DO NOT EDIT.
// source: specs/tree/navigationnode.type.spec
import {html, css, LitElement} from 'lit-element';
import {FBP} from "@furo/fbp";
import {Theme} from "@furo/framework/theme"
import {i18n} from "@furo/framework/i18n"


import "@furo/data-input";
import "@furo/form";

/**
 * `tree-navigationnode-form`
 * Item of the navigationtree
 *
 * @customElement
 * @appliesMixin FBP
 */
export class TreeNavigationnodeForm extends FBP(LitElement) {
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
                <!-- Id of the node  -->
                <furo-data-text-input condensed double ƒ-bind-data="--data(*.id)"></furo-data-text-input>
                <!-- Secondary text of the node  -->
                <furo-data-text-input condensed double ƒ-bind-data="--data(*.secondary_text)"></furo-data-text-input>
                <!-- description of the node  -->
                <furo-data-text-input condensed double ƒ-bind-data="--data(*.description)"></furo-data-text-input>
                <!-- icon of the node  -->
                <furo-data-text-input condensed double ƒ-bind-data="--data(*.icon)"></furo-data-text-input>
                <!-- key words of the node  -->
                <furo-data-text-input condensed double ƒ-bind-data="--data(*.key_words)"></furo-data-text-input>
                <!-- if node has error  -->
                <furo-data-text-input condensed double ƒ-bind-data="--data(*.has_error)"></furo-data-text-input>
                <!-- node is open or not  -->
                <furo-data-text-input condensed double ƒ-bind-data="--data(*.open)"></furo-data-text-input>
                <!-- Deeplink information of this node  -->
                <furo-data-text-input condensed double ƒ-bind-data="--data(*.link)"></furo-data-text-input>
                <!-- This node is a group label  -->
                <furo-data-text-input condensed double ƒ-bind-data="--data(*.is_group_label)"></furo-data-text-input>
                <!-- Children of this node  -->
                <furo-data-text-input condensed double ƒ-bind-data="--data(*.children)"></furo-data-text-input>
            </furo-form-layouter>
            
        `;
    }
}

window.customElements.define('tree-navigationnode-form', TreeNavigationnodeForm);
