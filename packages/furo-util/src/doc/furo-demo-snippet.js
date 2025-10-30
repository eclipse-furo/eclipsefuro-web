import { LitElement, html, css } from 'lit';
import { FBP } from '@furo/fbp';
import '@furo/layout/VerticalFlex';
import '../furo-markdown.js';
import '@furo/fbp/src/empty-fbp-node.js';
import './graph/furo-show-flow.js';

/**
 * `furo-demo-snippet`
 *  This is a documentation helper to show a example, the flow and the source of an example.
 *
 * @summary documentation helper
 * @customElement

 * @appliesMixin FBP
 */
export class FuroDemoSnippet extends FBP(LitElement) {
  constructor() {
    super();

    // eslint-disable-next-line wc/no-constructor-attributes
    const t = this.querySelector('template');
    this.template = t.content;
    // eslint-disable-next-line
    this.markdown = "```html\n"  + t.innerHTML + "\n```";

    this.icon = '# ';
    this.addEventListener('source', () => {
      this.source = true;
      this.demo = false;
      this.flow = false;
      this._FBPTriggerWire('--markdown', this.markdown);
      // eslint-disable-next-line wc/no-constructor-attributes
      const md = this.shadowRoot.querySelector('furo-markdown');
      md.style.width = `${this.offsetWidth}px`;
    });

    this.addEventListener('demo', () => {
      this.source = false;
      this.demo = true;
      this.flow = false;
    });

    this.addEventListener('flow', () => {
      this.source = false;
      this.demo = false;
      this.flow = true;
      this._FBPTriggerWire('--template', this.template);
    });
  }

  firstUpdated(v) {
    super.firstUpdated(v);
    const md = this.shadowRoot.querySelector('furo-markdown');
    md.style.width = `${this.offsetWidth}px`;
  }

  /**
   * @private
   * @return {Object}
   */
  static get properties() {
    return {
      /**
       * Show the source tab
       * @type Boolean
       */
      source: { type: Boolean, reflect: true },
      /**
       * Show the demo tab
       * @type Boolean
       */
      demo: { type: Boolean, reflect: true },
      /**
       * Show the flow tab
       * @type Boolean
       */
      flow: { type: Boolean, reflect: true },
      /**
       * @private
       */
      fullscreen: { type: Boolean, reflect: true },
      /**
       * hide the demo tab
       * @private
       */
      noDemo: { type: Boolean, reflect: true, attribute: 'no-demo' },
    };
  }

  /**
   * flow is ready lifecycle method
   * @private
   */
  _FBPReady() {
    super._FBPReady();
    // check if demo is disabled
    const demo = this.shadowRoot.querySelector('#demo');
    if (!this.noDemo) {
      const elem = document.createElement('empty-fbp-node');
      elem.attachShadow({ mode: 'open' });
      elem.shadowRoot.appendChild(this.template.cloneNode(true));
      elem._appendFBP(elem.shadowRoot);
      elem._FBPTraceWires();
      demo.appendChild(elem.shadowRoot);
    } else {
      demo.innerText = 'Demo is disabled';
    }

    if (!this.source && !this.flow) {
      this.demo = true;
    }

    if (this.source) {
      this._FBPTriggerWire('--markdown', this.markdown);
    }
    if (this.flow) {
      this._FBPTriggerWire('--template', this.template);
    }

    /**
     * Register hook on wire --fullscreen to
     * toggle fullscreen of the demo
     */
    this._FBPAddWireHook('--fullscreen', () => {
      if (!this.fullscreen) {
        this.requestFullscreen();
        this.fullscreen = true;
        this.icon = 'exit';
        this.requestUpdate();
      } else {
        document.exitFullscreen();
        this.fullscreen = false;
        this.icon = '#';
        this.requestUpdate();
      }
    });
  }

  /**
   * Themable Styles
   * @private
   * @return {CSSResult}
   */
  static get styles() {
    // language=CSS
    return [
      css`
        :host {
          display: block;
          height: 320px;
          box-sizing: border-box;
          overflow: hidden;

        }

        :host([hidden]) {
          display: none;
        }

        :host([fullscreen]) .nav {
          background-color: #f3f3f3;
          padding: 16px;
        }

        :host([fullscreen]) .nav span {
          border-bottom-color: #f3f3f3;
        }

        :host([fullscreen]) {
          height: 100vh;
        }

        furo-markdown {
          background-color: #f3f3f3;
          height: 100%;
          overflow: auto;
        }
        furo-show-flow {
          background-color: #f3f3f3;
        }

        #flow {
          height: 100%;
        }
        #demo {
          height: 100%;
          padding: 1rem;
          box-sizing: border-box;
          background: inherit;
        }

        :host(:not([demo])) #demo {
          display: none;
        }

        :host(:not([flow])) #flow {
          display: none;
        }

        :host(:not([source]))   #source {
          display: none;
        }

        div.flexbody {
          height: inherit;
          overflow: hidden;
        }

        span {
          cursor: pointer;
        }

        .nav {
          background-color: #f3f3f3;
          color: #444444;
        }

        .nav span {
          display: inline-block;
          border-bottom: 1px solid #f3f3f3;
          cursor: pointer;
        }

        .nav furo-icon {
          cursor: pointer;
        }
        :host([flow]) .flow {
          font-weight: 800;
          border-bottom: 1px solid #444444;
        }

        :host([demo]) .demo {
          font-weight: 800;
          border-bottom: 1px solid #444444;
        }

        :host([no-demo]) .demo {
          display: none;
        }

        :host([source]) .source {
          font-weight: 800;
          border-bottom: 1px solid #444444;
        }
      `
    ];
  }

  /**
   * @private
   * @returns {TemplateResult}
   */
  render() {
    // language=HTML
    return html`
      <furo-vertical-flex>
        <div class="nav">
          <span class="demo" at-click="-^demo">demo</span> |
          <span class="source" at-click="-^source">source</span> |
          <span class="flow" at-click="-^flow">flow</span> |
          <span style="float:right" at-click="--fullscreen">${this.icon}</span>
        </div>

        <div flex class="flexbody">
          <div id="demo" flex></div>
          <furo-show-flow id="flow" fn-parse-template="--template"></furo-show-flow>
          <furo-markdown id="source" fn-parse-markdown="--markdown"></furo-markdown>
        </div>
      </furo-vertical-flex>
    `;
  }
}

window.customElements.define('furo-demo-snippet', FuroDemoSnippet);
