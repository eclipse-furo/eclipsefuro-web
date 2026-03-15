import { LitFBP } from '@furo/fbp/dist/LitFBP';
import { css,LitElement } from 'lit';

// eslint-disable-next-line no-use-before-define
export type BackdropEvent = { handle: FuroBackdrop }

/**
 * `furo-backdrop`
 *
 * Displays content with a backdrop.
 *
 * The element you place in to furo-backdrop will be displayed centered.
 *
 *
 * ```html
 * <furo-backdrop at-opened="--BackdropFocus" at-closed="--backdropClosed"
 *   fn-show="--expandIconClicked"
 *   fn-close="--closeRequested, --recordSelected">
 *      <any-component at-item-selected="--recordSelected" style="width: 90vw; height: 90vh"></any-component>
 * </furo-backdrop>
 *
 * ```
 *
 * You can wire and use the elements in furo-backrop as if they were local elements.
 *
 * Do not forget to add the furo-backdrop-display somewhere in the parent dom.
 *
 * @fires { FuroBackdrop } opened - The **opened** event will be fired when the content is visible on the backdrop.
 * Tipp: you can use this to focus something on the shown content.
 * Event.details {FuroBackdrop} is the reference to the emiting DOM node.
 *
 *
 * @fires { FuroBackdrop } closed - The **closed** event will be fired when the displayed content is invisible and the backdrop is closed.
 * Tipp: Maybe you want to use this event to refocus the initiator.
 * Event.details {FuroBackdrop} is the reference to the emiting DOM node.
 *
 * @fires { FuroBackdrop } register-backdrop - Internal event to move the contents to the backdrop-display.
 * Event.details {FuroBackdrop} is the reference to the emiting DOM node.
 *
 * @summary show content with backdrop
 * @demo demo-furo-backdrop Basic usage
 * @customElement
 * @appliesMixin FBP
 */
export class FuroBackdrop extends LitFBP(LitElement) {

  displayHandle:HTMLDivElement | undefined

  /**
   *
   * @private
   */
  override _FBPReady() {
    // move the content to the backdrop display
    const customEvent = new CustomEvent<BackdropEvent>('register-backdrop', { composed: true, bubbles: true, detail: { handle: this } });
    this.dispatchEvent(customEvent);

    super._FBPReady();
  }

  /**
   * Initiates the backdrop and shows the content on top of the backdrop area.
   */
  show() {
    const customEvent = new CustomEvent<BackdropEvent>('show-backdrop-requested', { composed: true, bubbles: true, detail: { handle: this }  });
    this.dispatchEvent(customEvent);
  }

  /**
   * Hides the display.
   *
   * **Note:** The display will also get closed when the user clicks on the backdrop.
   */
  close() {
    const customEvent = new CustomEvent<BackdropEvent>('close-backdrop-requested', { composed: true, bubbles: true, detail: { handle: this }  });
    this.dispatchEvent(customEvent);
  }

  /**
   * Themable Styles
   * @private
   * @return {CSSResult}
   */
  static override get styles() {
    // language=CSS
    return (

      css`
        :host {
          display: none;
        }
      `
    );
  }
}

