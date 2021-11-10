import { LitElement, html, css } from 'lit';
import { FBP } from '@furo/fbp';
// eslint-disable-next-line import/no-extraneous-dependencies
import '@furo/doc-helper/src/component-doc/initWithServices.js';
// eslint-disable-next-line import/no-extraneous-dependencies
import('./src/lib/init.js').then(async () => {
  // import with @furo/... because we are in a monorepo
  // eslint-disable-next-line import/no-extraneous-dependencies,babel/no-unused-expressions
  import('@furo/ui5/src/furo-catalog.js');
  // eslint-disable-next-line babel/no-unused-expressions,import/no-extraneous-dependencies
  import('@furo/doc-helper/src/component-doc/main-stage.js');
  // eslint-disable-next-line babel/no-unused-expressions
  import('./demos/demos.js');
});

/**
 * A minimal dev shell
 *
 * @customElement
 * @appliesMixin FBP
 */
class DevShell extends FBP(LitElement) {
  /**
   *
   * @private
   * @return {CSSResult}
   */
  static get styles() {
    // language=CSS
    return [
      css`
        :host {
          display: block;
          overflow: hidden;
          height: 100vh;
        }
      `,
    ];
  }

  /**
   * @private
   * @returns {TemplateResult}
   */
  render() {
    // language=HTML
    return html`
      <main-stage
        @-app-flow="--flowEvent"
        @-response-error-401="--unauthorized"
        @-unauthorized="--unauthorized"
        @-navigate-back-clicked="--navBack"
      ></main-stage>
    `;
  }
}

window.customElements.define('dev-shell', DevShell);