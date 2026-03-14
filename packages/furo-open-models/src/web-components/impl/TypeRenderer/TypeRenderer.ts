import { css, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ARRAY } from '@/proxies/ARRAY';
import { FieldNode } from '@/FieldNode';
import { ANY } from '@/well_known/ANY';

interface Bindable<T = FieldNode> extends HTMLElement {
  /**
   * Binds field data to the renderer component.
   * Components should use this method or the `model` PROPERTY to initialize their state and render.
   *
   * @param model - The FieldNode containing the data to display/edit
   */
  bindData(model: T): void;

  model: T;
}

/**
 * Type guard to determine if an HTMLElement has a bindData method.
 * @param elem - The element to test
 * @returns True if the element is bindable
 */
function isBindable(elem: unknown): elem is Bindable {
  return (
    elem instanceof HTMLElement &&
    typeof (elem as Bindable).bindData === 'function'
  );
}

/**
 * The furo-type-renderer is used to display type specific data. It uses **display** as default context and will warn you
 * on the console if the requested `context-[type-name]` does not exist or was not imported.
 *
 * There is a standard set of display components @furo/ui5/src/standard-type-renderers for rendering the individual types.
 *
 * The standard ui5 set can be integrated with the import
 * - import '@furo/ui5/src/standard-type-renderers/display-registry.js'.
 *
 * If you want to implement an individual display of a type, you need your own `context-[type-name]` component and import it.
 *
 * for repeated fields you should write your own context-[type-name]-repeated component and import it.
 * If no context-[type-name]-repeated exists, the renderer will use the display-[type] component as fallback and
 * display it repeatedly, this is ok for a lot of cases.
 *
 * ## Naming convention
 *
 * ```
 * display-google-type-timeofday
 * ------- ---------------------
 *    |             |
 * context      type-name
 *
 * # examples:
 * cell-string
 * celledit-string
 * display-string
 * yourcontext-string
 *
 * The method to evaluate the renderer is built as following:
 *
 * context-[(package.type).replaceAll('.', '-').toLocaleLowerCase()]
 * ```
 *
 *
 *
 * ## Basic Usage
 * ```html
 *   <furo-type-renderer fn-bind-data="--dao(*.data.fieldname)"></furo-type-renderer>
 * ```
 *
 * ## Writing your own renderer
 * The only API you need to implement in your component is the `bindData()` method.
 * You just have to follow the naming convention for your renderer.
 *
 * @summary dynamic type rendering
 * @customElement furo-type-renderer
 */

/**
 * Represents any HTMLElement-based component that can bind to field data.
 * This includes Lit elements and other custom web components that implement
 * a bindData() method to initialize with field node information.
 *
 * @template T - The FieldNode type this renderer expects (usually inferred)
 */
export class TypeRenderer extends LitElement {
  static styles = css`
    :host {
      display: none;
    }
  `;

  /**
   * Set the context if you need another then display.
   *
   * Determines how the component should render or behave.
   *
   * The variable accepts one of several predefined context types
   * (`"display"`, `"form"`, `"edit"`, `"cell-display"`, `"cell-edit"`),
   * or any other string for having custom context.
   *
   * @type {('display' | 'form' | 'edit' | 'cell-display' | 'cell-edit' | string)}
   * @default "display"
   */
  @property()
  context: 'display' | 'form' | 'edit' | 'cell-display' | 'cell-edit' | string =
    'display';

  @property({ type: Boolean })
  disabled = false;

  @state()
  _field: FieldNode | null = null;

  private renderName: string = '';

  /**
   * Reference to the element that was inserted into the DOM.
   *
   * This variable holds a reference to an {@link HTMLElement} that has been
   * added to the document, or `undefined` if no element has yet been inserted.
   *
   * @type {HTMLElement | undefined}
   */
  public insertedElementRef: HTMLElement | undefined;

  /**
   *@private
   */
  static get properties() {
    return {
      /**
       * A Boolean attribute which, if present, means this field is displayed in disabled state.
       * @type Boolean
       */
      disabled: { type: Boolean },
      /**
       * Set the context if you need another then display.
       * Prebuilt context renderers exist for display, cell, celledit.
       * @type String
       */
      context: { type: String },
    };
  }

  private isAnyType = false;

  /**
   * Bind a fieldnode of any type
   * @param fieldNode {FieldNode} Fieldnode of any type
   */
  bindData(fieldNode: FieldNode) {
    /**
     * Evaluates the component name
     * Special treatment for google.protobuf.Any
     */

    this._field = fieldNode;

    if (this._field) {
      if (this._field instanceof ANY) {
        this.isAnyType = true;
      }

      let typename = this._field.__meta.typeName;
      if (this.isAnyType) {
        // any types are fully available when it has data with the type information
        typename = (this._field as ANY).typeName.replace(/.*\//, '');
        if (!(this._field as ANY).value) {
          this._field.__addEventListener('field-value-updated', () => {
            typename = (this._field as ANY).typeName.replace(/.*\//, '');
            this._setRenderNameFromTypeName(typename);
            this._createDisplay();
          });
        }
      }
      this._setRenderNameFromTypeName(typename);

      if (this._field.__meta.typeName !== 'primitives.ARRAY<>') {
        this._createDisplay();
      } else {
        this._createRepeatedDisplay();
      }
    }
  }

  private _setRenderNameFromTypeName(typename: string) {
    // Todo: add handling for MAP types
    this.renderName = `${this.context}-${typename
      .replaceAll('primitives.', '')
      .replaceAll('.', '-')
      .replaceAll('_', '-')
      .replaceAll(
        /([a-z0-9])([A-Z])/g,
        (_, p1, p2) => `${p1}-${p2.toLowerCase()}`,
      )
      .toLocaleLowerCase()}`;
  }

  /**
   * Creates the component for single fields
   * @private
   */
  _createDisplay() {
    // if the component is not defined after 1500ms, we consider it as not existing
    Promise.race([
      window.customElements.whenDefined(this.renderName),
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), 1500);
      }),
    ])
      .then(() => {
        const renderComponent = document.createElement(this.renderName);
        if (isBindable(renderComponent)) {
          this._addElement(renderComponent);
        } else {
          this._warningUnbindableRenderer(renderComponent);
        }
      })
      .catch(() => {
        this._warningNoSpecificRendererAvailable();
      });
  }

  /**
   * Creates the component for repeated fields
   * Component naming: [package-type]-repeated
   *
   * Fallback: if no -repeated component is available, a div is used...
   * @private
   */
  _createRepeatedDisplay() {
    const fieldDescriptor = this._field!.__parentNode!.__meta.nodeFields.find(
      f => f.fieldName === this._field!.__meta.fieldName,
    );
    const Constructor: new () => unknown = fieldDescriptor?.FieldConstructor;
    const fn = new Constructor() as FieldNode;
    this._setRenderNameFromTypeName(fn.__meta.typeName);

    const repeatRenderer = document.createElement(
      `${this.renderName}-repeated`,
    );
    if (isBindable(repeatRenderer)) {
      this._addElement(repeatRenderer);
    } else {
      Promise.race([
        window.customElements.whenDefined(this.renderName),
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout')), 1500);
        }),
      ])
        .then(() => {
          const renderComponent = document.createElement(this.renderName);
          if (isBindable(renderComponent)) {
            // fallback , display the display-[type] component repeatedly
            const container = document.createElement('div');
            // add classes for styling
            container.classList.add('repeated', 'ftr');

            (this._field as ARRAY<FieldNode, unknown>).forEach(
              (field: FieldNode) => {
                const el = document.createElement(this.renderName) as Bindable;
                if (this.isAnyType) {
                  el.bindData((field as ANY).value as FieldNode);
                }
                el.bindData(field);
                this.insertedElementRef = this.parentNode!.insertBefore(
                  el,
                  this,
                );
              },
            );
          } else {
            this._warningUnbindableRenderer(renderComponent);
          }
        })
        .catch(() => {
          this._warningNoSpecificRendererAvailable();
        });
    }
  }

  /**
   * Attribute handling
   * Adding to DOM
   * @param el
   * @private
   */
  _addElement(el: Bindable) {
    const l = this.attributes.length;

    for (let i = 0; i < l; i += 1) {
      const nodeName = this.attributes.item(i)!.nodeName!;
      const nodeValue = this.attributes.item(i)?.nodeValue;
      if (
        !(
          nodeName.startsWith('fn-') ||
          nodeName.startsWith('at-') ||
          nodeName === 'context'
        )
      ) {
        el.setAttribute(nodeName, nodeValue || '');
      }
    }
    this.insertedElementRef = this.parentNode!.insertBefore(el, this);

    if (this.isAnyType) {
      // any types have the data in the field `value`
      el.bindData((this._field as ANY).value as FieldNode);
    } else {
      el.bindData(this._field as FieldNode);
    }
  }

  /**
   * forward the focus to the created element
   */
  focus() {
    setTimeout(() => {
      if (this.insertedElementRef) {
        this.insertedElementRef.focus();
      }
    }, 16);
  }

  /**
   * Remove the inserted element, if the type renderer itself is removed
   * @private
   */
  disconnectedCallback() {
    if (this.insertedElementRef) {
      this.insertedElementRef.remove();
    }
    // eslint-disable-next-line wc/guard-super-call
    super.disconnectedCallback();
  }

  /**
   * Append when reconnect
   */
  connectedCallback() {
    // reconnect
    if (this.insertedElementRef) {
      this.parentNode!.insertBefore(this.insertedElementRef, this);
    }

    // eslint-disable-next-line wc/guard-super-call
    super.connectedCallback();
  }

  private _warningUnbindableRenderer(renderComponent: HTMLElement) {
    console.error(
      renderComponent,
      `is not bindable. Fieldname:${this._field!.__fieldPath}`,
    );
  }

  private _warningNoSpecificRendererAvailable() {
    console.warn(
      `No type specific renderer ${this.renderName} loaded \n. Check your imports.\n`,
      this._field?.__meta.typeName,
      this._field!.__fieldPath,
    );
  }
}
