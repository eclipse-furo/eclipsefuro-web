import { LitElement, html, css } from 'lit';


/**
 * `form-string`
 *  is js implementation of a renderer for a primitives.STRING
 *
 * @summary  shortdescription
 * @customElement
 * @appliesMixin FBP
 */
class FormString extends (LitElement) {

  set fieldNode(fn){
    this._fieldNode = fn;
    if(this._fieldNode.__meta.required){
      this.setAttribute('required', true);
    }

    fn.__addEventListener('field-value-changed',()=>{
      this.value = this._fieldNode.value;
      this.requestUpdate()
    })

    fn.__addEventListener('state-changed',(e)=>{
      this.setAttribute('value-state', e.detail.__meta.valueState);
      this.stateMessage = e.detail.__meta.stateMessage;
      this.requestUpdate()
    })

    this.value = this._fieldNode.value;
    this.requestUpdate()

  }

  valueChanged(e) {
    this._fieldNode.value = e.target.value;
  }


  /**
   * @private
   * @return {Object}
   */
  static get properties() {
    return {
      /**
       * Description
       */
      stateMessage: { type: String }
    };
  }


  /**
   * Themable Styles
   * @private
   * @return {CSSResult}
   */
  static get styles() {
    // language=CSS
    return css`
        :host {
            display: inline-block;
        }

        :host([hidden]) {
            display: none;
        }
        :host([value-state="Error"])  {
            border-bottom: 2px solid red;
        }
        :host([value-state="Warning"])  {
            border-bottom: 2px solid #FEA234;
        }
    `;
  }


  /**
   * @private
   * @returns {TemplateResult}
   * @private
   */
  render() {
    // language=HTML
    return html`
      <input type="text" .value="${this.value}" @input="${this.valueChanged}">
      ${this.stateMessage}
    `;
  }
}

window.customElements.define('form-string', FormString);
