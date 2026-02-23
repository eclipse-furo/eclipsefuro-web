import { LitElement, html, css } from 'lit';
import { FBP } from '@furo/fbp';
// TODO: Add bind-data method

/**
 * `furo-pretty-json`
 * Pretty json with highlighting
 *
 * ```html
 * <furo-pretty-json
 *   fn-inject-json="--data"></furo-pretty-json>
 * ```
 *
 * @summary pretty prints json data
 * @customElement
 */
export class FuroPrettyJson extends FBP(LitElement) {

  static get styles() {
    // language=CSS
    return (

      css`
        :host {
          display: block;
          font-family: 'Benton Sans', 'Helvetica Neue', helvetica, arial, sans-serif;
          margin: var(--spacing);
          line-height: 1.5;
          background-color: var(--surface);
          padding: 0;
          white-space: pre;
        }

        .string {
          color: #080;
        }

        .number {
          color: darkorange;
        }

        .boolean {
          color: blue;
        }

        .null {
          color: magenta;
        }

        .key {
          color: #606;
        }
      `
    );
  }

  /**
   * Inject JSON data
   * @param {JSON} json - Json literal
   */
  injectData(json) {
    if (json) {
      this.markedText = JSON.stringify(json, null, 2);
      this.markedText = FuroPrettyJson._syntaxHighlight(this.markedText);
      this.shadowRoot.innerHTML = this.markedText;
    } else {
      // clear innerHTML content
      this.shadowRoot.innerHTML = '';
    }
  }

  /**
   *
   * @param json
   * @return {string}
   * @private
   */
  static _syntaxHighlight(json) {
    if (typeof json !== 'string') {
      // eslint-disable-next-line no-param-reassign
      json = JSON.stringify(json, undefined, 2);
    }
    // eslint-disable-next-line no-param-reassign
    json = json
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      match => {
        let cls = 'number';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'key';
          } else {
            cls = 'string';
          }
        } else if (/true|false/.test(match)) {
          cls = 'boolean';
        } else if (/null/.test(match)) {
          cls = 'null';
        }
        return `<span class="${cls}">${match}</span>`;
      },
    );
  }

  render() {
    // language=HTML
    return html`
      <pre id="content"></pre>
    `;
  }
}

window.customElements.define('furo-pretty-json', FuroPrettyJson);
