import * as Input from '@ui5/webcomponents/dist/Input.js';
// eslint-disable-next-line import/no-extraneous-dependencies
import '@ui5/webcomponents/dist/features/InputSuggestions.js';
import { FieldNodeAdapter } from '@furo/data/src/lib/FieldNodeAdapter.js';

/**
 * The 'furo-ui5-data-password-input' component allows the user to enter and edit password with data binding.
 *
 * It supports all features from the [SAP ui5 Input element](https://sap.github.io/ui5-webcomponents/playground/components/Input/).
 *
 * You can bind any `string` type, like `furo.fat.String` type or the `google.protobuf.StringValue` type.
 *
 * ```html
 *  <furo-ui5-data-password-input
 *     ƒ-bind-data="--daoCountry(*.data.name)"
 *  ></furo-ui5-data-password-input>
 * ```
 *
 * ### Specificity
 * 1. Attributes which are set in the html source will have the highest specificity and will never get overwritten by metas or fat.
 * 2. Attributes set in meta will have the lowest specificity and will be overwritten by attributes from fat.
 *
 * ** meta 	<  fat 	< html 	**
 *
 * ## supported FAT attributes
 *  - **"readonly":"true"** set the element to readonly
 *  - **"required":"true"** set the element to required
 *  - **"disabled":"true"** set the element to disabled
 *  - **"icon":"home"** set the icon
 *  - **"placeholder":"string"** set the placeholder for the element
 *  - **"max":"number"** set the maximum number of characters available in the input field.
 *
 * ## supported meta and constraints
 * - **readonly: true** , set the element to readonly
 * - **placeholder:"some string"** set the placeholder for the element
 * - **max:"number"** set the maximum number of characters available in the input field.
 *
 * The constraint **required** will mark the element as required
 *
 * ## Methods
 * **bind-data(fieldNode)**
 * Bind a entity field. You can use the entity even when no data was received.
 *
 * When you use @-object-ready from a furo-data-object which emits a EntityNode, just bind the field with --entity(*.fields.fieldname)
 *
 * @fires {`text`} change -  Fired when the input operation has finished by pressing Enter or on focusout.
 * @fires {} input -  Fired when the value of the ui5-input changes at each keystroke, and when a suggestion item has been selected.
 * @fires {} xxxx -  All events from the [ui5 Input element](https://sap.github.io/ui5-webcomponents/playground/components/Input/).
 * @fires {String} field-value-changed - Fires the field value when it changes.
 * @fires {MouseEvent} icon-clicked - Fired when icon is clicked
 * @fires {void} password-showed - Fired when the password is showed, after calling the show method.
 * @fires {void} password-hidden - Fired when the password is hidden, after calling the hide() method.
 *
 * @summary data password input field
 * @customElement
 * @demo demo-furo-ui5-data-password-input Basic usage (scalar , fat, wrapper values)
 */
export class FuroUi5PasswordInput extends FieldNodeAdapter(Input.default) {
  constructor() {
    super();

    this.type = 'Password';
    // used to restore the state after a invalidation -> validation change
    this._previousValueState = { state: 'None', message: '' };

    this._attributesFromFNA = {
      readonly: undefined,
      placeholder: undefined,
    };

    this._constraintsFromFNA = {
      required: undefined,
      max: undefined, // maps to maxlength
    };

    this._labelsFromFAT = {
      readonly: undefined,
      disabled: undefined,
      required: undefined,
    };

    this._attributesFromFAT = {
      placeholder: undefined,
      max: undefined, // maps to maxlength
      icon: undefined, // updates the icon
    };

    // a list of privileged attributes. when those attributes are set in password-input components initially.
    // they can not be modified later via response or spec
    // null is used because getAttribute returns null or value
    this._privilegedAttributes = {
      readonly: null,
      placeholder: null,
      required: null,
      disabled: null,
      icon: null,
      maxlength: null,
    };

    this.addEventListener('input', this._updateFNA);

    // changed is fired when the input operation has finished by pressing Enter or on focusout.
    this.addEventListener('change', () => {
      // set 0 for skalar type on blur if value was ""
      if (!this.isFat() && !this.isWrapper() && this.value === '') {
        this.value = '';
      }
    });
  }

  /**
   * connectedCallback() method is called when an element is added to the DOM.
   * webcomponent lifecycle event
   * @private
   */
  connectedCallback() {
    // eslint-disable-next-line wc/guard-super-call
    super.connectedCallback();
    this.readAttributes();
  }

  /**
   * Adds a div with slot="valueStateMessage" to show
   * field related information if the attribute value-state is set.
   * @returns {HTMLDivElement}
   * @private
   */
  _addValueStateMessage() {
    const EXISTING_VSE = this.querySelector('div[slot="valueStateMessage"]');
    if (EXISTING_VSE !== null) {
      return EXISTING_VSE;
    }
    // we only create the ValueStateContainer if none already exists.
    const VALUE_STATE_MESSAGE_ELEMENT = document.createElement('div');
    VALUE_STATE_MESSAGE_ELEMENT.setAttribute('slot', 'valueStateMessage');
    // eslint-disable-next-line wc/no-constructor-attributes
    this.appendChild(VALUE_STATE_MESSAGE_ELEMENT);
    return VALUE_STATE_MESSAGE_ELEMENT;
  }

  /**
   * Removes <div slot="valueStateMessage"></div>
   * @private
   */
  _removeValueStateMessage() {
    const VALUE_STATE_MESSAGE_ELEMENT = this.querySelector('div[slot="valueStateMessage"]');
    if (VALUE_STATE_MESSAGE_ELEMENT !== null) {
      VALUE_STATE_MESSAGE_ELEMENT.remove();
    }
  }

  // overwrite. fix for ui5 input error under rc14
  //
  //  @private
  //
  // eslint-disable-next-line class-methods-use-this
  get nativeInputAttributes() {
    return {};
  }

  /**
   * Reads the attributes which are set on the component dom.
   * those attributes can be set. `value-state`, `value-state-message`,  `icon`, `placeholder`, `required`,`readonly`,`disabled`
   * Use this after manual or scripted update of the attributes.
   */
  readAttributes() {
    this._previousValueState.state = this.getAttribute('value-state')
      ? this.getAttribute('value-state')
      : 'None';

    // save the original attribute for later usages, we do this, because some components reflect
    Object.keys(this._privilegedAttributes).forEach(attr => {
      this._privilegedAttributes[attr] = this.getAttribute(attr);
    });
    if (this._privilegedAttributes.icon) {
      this.setIcon(this._privilegedAttributes.icon);
    }
  }

  /**
   * Handler function for the input value changes.
   * This is done to be able to remove the event-listeners as a protection for multiple calls
   * @return {(function(): void)|*}
   * @private
   */
  _updateFNA() {
    const { value } = this;
    if (this.isFat()) {
      if (value === '') {
        this._tmpFAT.value = null;
        // add empty state
        if (this._tmpFAT.labels === null) {
          this._tmpFAT.labels = {};
        }
        this._tmpFAT.labels.empty = true;
      } else {
        this._tmpFAT.value = value;
        // remove empty state
        if (this._tmpFAT.labels && this._tmpFAT.labels.empty) {
          delete this._tmpFAT.labels.empty;
        }
        // init labels in_tmpFAT
        if (this._tmpFAT.labels === null) {
          this._tmpFAT.labels = {};
        }
        // set modified on changes
        this._tmpFAT.labels.modified = true;
      }
      this.setFnaFieldValue(this._tmpFAT);
    } else if (this.isWrapper()) {
      this.setFnaFieldValue(value === '' ? null : value);
    } else {
      this.setFnaFieldValue(value === '' ? '' : value);
    }

    const customEvent = new Event('field-value-changed', { composed: true, bubbles: true });
    customEvent.detail = this.value;
    this.dispatchEvent(customEvent);
  }

  /**
   * labels are map <string,bool>, we handle every boolean attribute with the labels
   *
   * @param fatLabels
   * @private
   */
  _updateLabelsFromFat(fatLabels) {
    if (fatLabels === null || fatLabels === undefined) {
      return;
    }
    // this is needed to check the specifity in the onFnaXXXXChanged callback functions
    this._labelsFromFAT.readonly = fatLabels.readonly;
    this._labelsFromFAT.required = fatLabels.required;

    // readonly
    if (this._privilegedAttributes.readonly === null) {
      if (fatLabels.readonly !== undefined) {
        // apply from fat
        this.readonly = fatLabels.readonly;
        // deactivate suggestions
        this.showSuggestions = false;
      } else if (this._attributesFromFNA.readonly !== undefined) {
        // apply from fieldnode (meta)
        this.readonly = this._attributesFromFNA.readonly;
        // deactivate suggestions
        this.showSuggestions = false;
      }
    }

    // CONSTRAINT required
    if (this._privilegedAttributes.required === null) {
      if (fatLabels.required !== undefined) {
        this.required = fatLabels.required;
      } else if (this._constraintsFromFNA.required !== undefined) {
        this.required = this._constraintsFromFNA.required.is === 'true';
      }
    }

    // disabled
    if (this._privilegedAttributes.disabled === null) {
      if (fatLabels.disabled !== undefined) {
        this.disabled = fatLabels.disabled;
      }
    }
  }

  /**
   * sync input attributes according to fat attributes
   * @private
   */
  _updateAttributesFromFat(fatAttributes) {
    if (fatAttributes === null || fatAttributes === undefined) {
      return;
    }

    // this is needed to check the specifity in the onFnaXXXXChanged callback functions
    this._attributesFromFAT.disabled = fatAttributes.disabled;
    this._attributesFromFAT.placeholder = fatAttributes.placeholder;
    this._attributesFromFAT.icon = fatAttributes.icon;
    this._attributesFromFAT.max = fatAttributes.max;

    // placeholder
    if (this._privilegedAttributes.placeholder === null) {
      if (fatAttributes.placeholder !== undefined) {
        this.placeholder = fatAttributes.placeholder;
      } else if (this._attributesFromFNA.placeholder !== undefined) {
        this.placeholder = this._attributesFromFNA.placeholder;
      }
    }

    // value-state and corresponding message
    if (fatAttributes['value-state'] !== undefined) {
      // save state as previous state
      this._previousValueState = {
        state: fatAttributes['value-state'],
        message: fatAttributes['value-state-message'],
      };
      this._setValueStateMessage(
        fatAttributes['value-state'],
        fatAttributes['value-state-message'],
      );
    } else {
      // remove state if fat does not have state, even it is set in the html
      this._previousValueState = { state: 'None', message: fatAttributes['value-state-message'] };
      this._setValueStateMessage('None', fatAttributes['value-state-message']);
    }

    // suggestions
    // see Properties/Attributes from ui5 on https://sap.github.io/ui5-webcomponents/playground/components/Input/
    if (fatAttributes.suggestions !== undefined) {
      if (typeof fatAttributes.suggestions === 'string') {
        this._setSuggestions(JSON.parse(fatAttributes.suggestions));
      } else if (Array.isArray(fatAttributes.suggestions)) {
        this._setSuggestions(fatAttributes.suggestions);
      }
    }

    // icon
    if (this._privilegedAttributes.icon === null && fatAttributes.icon !== undefined) {
      this.setIcon(fatAttributes.icon);
    }

    // maxlength
    if (this._privilegedAttributes.maxlength === null) {
      if (fatAttributes.max !== undefined) {
        this.maxlength = fatAttributes.max;
      } else if (this._constraintsFromFNA.max !== undefined && this._constraintsFromFNA.max.is) {
        this.maxlength = parseInt(this._constraintsFromFNA.max.is, 10);
      }
    }
  }

  /**
   * rewrite get accInfo function
   * initiate _inputAccInfo in order to avoid error
   * @private
   * @returns {*}
   */
  get accInfo() {
    if (this._inputAccInfo === undefined) {
      this._inputAccInfo = [];
    }
    return super.accInfo;
  }

  /**
   * overwrite to fix error
   * @private
   * @returns {*|{}}
   */
  get valueStateMessage() {
    return super.valueStateMessage || {};
  }

  /**
   * overwrite to fix error
   * @private
   * @returns {*|[]}
   */
  get suggestionItems() {
    return super.suggestionItems || [];
  }

  /**
   * overwrite to fix error
   * @private
   * @returns {*|[]}
   */
  get icon() {
    return super.icon || [];
  }

  /**
   * overwrite onFnaFieldValueChanged
   * @private
   * @param val
   */
  onFnaFieldValueChanged(val) {
    if (this.isFat()) {
      this._tmpFAT = val;
      this.value = val.value;
      // set empty value when label empty was given
      if (this._tmpFAT.labels && this._tmpFAT.labels.empty) {
        this.value = '';
      }
      this._updateAttributesFromFat(this._tmpFAT.attributes);
      this._updateLabelsFromFat(this._tmpFAT.labels);
    } else {
      this.value = val;
    }
  }

  /**
   * overwrite onFnaPlaceholderChanged function
   * @private
   * @param placeholder
   */
  onFnaPlaceholderChanged(placeholder) {
    this._attributesFromFNA.placeholder = placeholder;
    if (
      this._privilegedAttributes.placeholder === null &&
      this._attributesFromFAT.placeholder === undefined
    ) {
      this.placeholder = placeholder;
    }
  }

  /**
   * overwrite onFnaReadonlyChanged function
   * @private
   * @param readonly
   */
  onFnaReadonlyChanged(readonly) {
    this._attributesFromFNA.readonly = readonly;
    if (
      this._privilegedAttributes.readonly === null &&
      this._labelsFromFAT.readonly === undefined
    ) {
      this.readonly = readonly;
      // deactivate suggestions
      this.showSuggestions = false;
    }
  }

  /**
   * overwrite onFnaOptionsChanged function
   * @private
   * @param options
   */
  onFnaOptionsChanged(options) {
    if (options && options.list) {
      this._setSuggestions(options.list);
    }
  }

  /**
   * overwrite onFnaConstraintsChanged function
   * @private
   * @param constraints
   */
  onFnaConstraintsChanged(constraints) {
    // required
    if (constraints.required !== undefined) {
      this._constraintsFromFNA.required = constraints.required;
      if (
        this._privilegedAttributes.required === null &&
        this._labelsFromFAT.required === undefined
      ) {
        this.required = constraints.required.is === 'true';
      }
    }

    if (constraints.max !== undefined) {
      this._constraintsFromFNA.max = constraints.max;
      if (this._privilegedAttributes.maxlength === null) {
        this.maxlength = parseInt(constraints.max.is, 10);
      }
    }
  }

  /**
   * overwrite onFnaFieldNodeBecameInvalid function
   * @private
   * @param validity
   */
  onFnaFieldNodeBecameInvalid(validity) {
    if (validity.description) {
      // this value state should not be saved as a previous value state
      this._setValueStateMessage('Error', validity.description);
    } else {
      this.valueState = 'Error';
    }
  }

  /**
   * overwrite onFnaFieldNodeBecameValid function
   * @private
   */
  onFnaFieldNodeBecameValid() {
    this._resetValueStateMessage();
  }

  /**
   * set suggestions as the ui5-suggestion-item element
   * ui5 suggestions sample data: [{"text":"Spain","icon":"world","type":"Active","infoState":"None","group":false,"key":0},.. ]
   * furo.Fieldoption as suggestions: [{"id": 1,"display_name":"show 1"}, ..]
   * if the suggestion item has icon , the ui5 icons should be imported in your ui component
   *
   * @private
   * @param arr
   */
  _setSuggestions(arr) {
    if (!this.readonly && !this.disabled) {
      // remove previous suggestion items.
      this.querySelectorAll('ui5-suggestion-item').forEach(e => {
        e.remove();
      });

      if (Array.isArray(arr) && arr.length > 0) {
        this.showSuggestions = true;
        this.highlight = true;

        // add current suggestion items
        arr.forEach(e => {
          const suggestion = document.createElement('ui5-suggestion-item');

          // suggestions from furo.optionItem
          if (e.id !== undefined) {
            suggestion.text = e.id;
          }

          // suggestions from furo.optionItem
          if (e.display_name !== undefined && e.display_name !== e.id) {
            suggestion.description = e.display_name;
          }

          // suggestions from fat attribute
          if (e.text !== undefined) {
            suggestion.text = e.text;
          }

          // appends only when suggestion text exists
          // see Properties/Attributes on https://sap.github.io/ui5-webcomponents/playground/components/Input/
          if (suggestion.text !== undefined) {
            if (e.icon !== undefined) {
              suggestion.icon = e.icon;
            }
            if (e.iconEnd !== undefined) {
              suggestion.iconEnd = e.iconEnd;
            }
            if (e.image !== undefined) {
              suggestion.image = e.image;
            }
            if (e.info !== undefined) {
              suggestion.info = e.info;
            }
            if (e.type !== undefined) {
              suggestion.type = e.type;
            }
            if (e.infoState !== undefined) {
              suggestion.infoState = e.infoState;
            }
            if (e.group !== undefined) {
              suggestion.group = e.group;
            }
            if (e.key !== undefined) {
              suggestion.key = e.key;
            }

            this.appendChild(suggestion);
          }
        });
      }
    }
  }

  /**
   * update the value state and the value state message on demand
   *
   * @param valueState
   * @param message
   * @private
   */
  _setValueStateMessage(valueState, message) {
    const VSE = this._addValueStateMessage();
    this.valueState = valueState;
    if (VSE !== null) {
      VSE.innerText = message || '';
    }
  }

  /**
   * resets value-state and valueStateMessage to previous value state
   * If no previous message is set, the valueStateMessage container is removed.
   * @private
   */
  _resetValueStateMessage() {
    this.valueState = this._previousValueState.state;

    if (this._previousValueState?.message?.length) {
      this._setValueStateMessage(this._previousValueState.state, this._previousValueState.message);
    } else {
      this._removeValueStateMessage();
    }
  }

  /**
   * set ui5 icon
   * @param icon
   * @private
   */
  setIcon(icon) {
    if (this._icon) {
      this._icon.remove();
    }
    this.querySelectorAll('ui5-icon').forEach(e => {
      e.remove();
    });
    if (icon) {
      this._icon = document.createElement('ui5-icon');
      this._icon.slot = 'icon';
      this._icon.name = icon;
      this._icon.addEventListener('click', e => {
        const customEvent = new Event('icon-clicked', { composed: true, bubbles: true });
        customEvent.detail = e;
        this.dispatchEvent(customEvent);
      });
      this.appendChild(this._icon);
    }
  }

  /**
   * show password
   */
  show() {
    this.type = 'Text';

    const customEvent = new Event('password-showed', { composed: true, bubbles: true });
    this.dispatchEvent(customEvent);
  }

  /**
   * hide password
   */
  hide() {
    this.type = 'Password';

    const customEvent = new Event('password-hidden', { composed: true, bubbles: true });
    this.dispatchEvent(customEvent);
  }

  /**
   * toggle visibility of the password. (show/hide) password
   */
  toggleVisibility() {
    if (this.type === 'Text') {
      this.hide();
    } else {
      this.show();
    }
  }
}

window.customElements.define('furo-ui5-data-password-input', FuroUi5PasswordInput);
