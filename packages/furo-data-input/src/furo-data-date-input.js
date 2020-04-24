import { LitElement, html, css } from 'lit-element';
import { Theme } from '@furo/framework/src/theme';
import { FBP } from '@furo/fbp';
import '@furo/input/src/furo-date-input';
import { CheckMetaAndOverrides } from './lib/CheckMetaAndOverrides.js';
import { Helper } from './lib/helper.js';

/**
 * `furo-data-date-input`
 * Binds a entityObject field to a furo-date-input field
 *
 *
 * Tags: input
 * @summary Bind a entityObject.field to a date input
 * @customElement
 * @demo demo-furo-data-date-input Data binding
 * @mixes FBP
 */
class FuroDataDateInput extends FBP(LitElement) {
  /**
   * @event value-changed
   * Fired when value has changed from inside the input field.
   *
   * detail payload: {Date} the date value
   *
   * Comes from underlying component furo-date-input. **bubbles**
   */

  constructor() {
    super();
    this.error = false;
    this.disabled = false;

    this._FBPAddWireHook('--valueChanged', val => {
      // by valid input reset meta and constraints

      if (this.field) {
        if (
          this.field._spec.type === 'google.type.Date' ||
          (this.field['@type'] &&
            this.field['@type']._value.replace(/.*\//, '') === 'google.type.Date')
        ) {
          // eslint-disable-next-line no-param-reassign
          val = this._convertStringToDateObj(val, this.field._value);
        }
        // store tmpval to check against loop
        this.tmpval = val;
        this.field._value = val;
      }
    });
  }

  /**
   * flow is ready lifecycle method
   */
  _FBPReady() {
    super._FBPReady();
    // this._FBPTraceWires();
    // check initial overrides
    CheckMetaAndOverrides.UpdateMetaAndConstraints(this);
  }

  /**
   * Updater for the label attr
   * @param value
   */
  set _label(value) {
    Helper.UpdateInputAttribute(this, 'label', value);
  }

  /**
   * Updater for the hint attr
   * @param value
   */
  set _hint(value) {
    Helper.UpdateInputAttribute(this, 'hint', value);
  }

  /**
   * Updater for the leadingIcon attr
   * @param value
   */
  set leadingIcon(value) {
    Helper.UpdateInputAttribute(this, 'leading-icon', value);
  }

  /**
   * Updater for the trailingIcon attr
   * @param value
   */
  set trailingIcon(value) {
    Helper.UpdateInputAttribute(this, 'trailing-icon', value);
  }

  /**
   * Updater for the min => minlength attr*
   * @param value
   */
  set _min(value) {
    Helper.UpdateInputAttribute(this, 'min', value);
  }

  /**
   * Updater for the max attr*
   * @param value
   */
  set _max(value) {
    Helper.UpdateInputAttribute(this, 'max', value);
  }

  /**
   * Updater for the errortext attr
   * @param value
   */
  set errortext(value) {
    Helper.UpdateInputAttribute(this, 'errortext', value);
  }

  /**
   * Updater for the step attr
   * @param value
   */
  set _step(value) {
    Helper.UpdateInputAttribute(this, 'step', value);
  }

  static get properties() {
    return {
      /**
       * Overrides the label text from the **specs**.
       *
       * Use with caution, normally the specs defines this value.
       */
      label: {
        type: String,
        attribute: true,
      },
      /**
       * Overrides the required value from the **specs**.
       *
       * Use with caution, normally the specs defines this value.
       */
      required: {
        type: Boolean,
      },
      /**
       * Overrides the hint text from the **specs**.
       *
       * Use with caution, normally the specs defines this value.
       */
      hint: {
        type: String,
      },
      /**
       * Overrides the min value from the **specs**.
       *
       * Use with caution, normally the specs defines this value.
       */
      min: {
        type: String,
      },
      /**
       * Overrides the max value from the **specs**.
       *
       * Use with caution, normally the specs defines this value.
       */
      max: {
        type: String,
      },
      /**
       * Overrides the step value from the **specs**.
       *
       * Use with caution, normally the specs defines this value.
       */
      step: {
        type: String, // string, because "any" is also a valid step
      },
      /**
       * Overrides the readonly value from the **specs**.
       *
       * Use with caution, normally the specs defines this value.
       */
      readonly: {
        type: Boolean,
      },
      /**
       * A Boolean attribute which, if present, means this field cannot be edited by the user.
       */
      disabled: {
        type: Boolean,
        reflect: true,
      },

      /**
       * Set this attribute to autofocus the input field.
       */
      autofocus: {
        type: Boolean,
      },
      /**
       * Icon on the left side
       */
      leadingIcon: {
        type: String,
        attribute: 'leading-icon',
      },
      /**
       * Icon on the right side
       */
      trailingIcon: {
        type: String,
        attribute: 'trailing-icon',
      },
      /**
       * html input validity
       */
      valid: {
        type: Boolean,
        reflect: true,
      },
      /**
       * The default style (md like) supports a condensed form. It is a little bit smaller then the default
       */
      condensed: {
        type: Boolean,
      },
      /**
       * passes always float the label
       */
      float: {
        type: Boolean,
      },
    };
  }

  /**
   * Sets the field to readonly
   */
  disable() {
    this.disabled = true;
  }

  /**
   * Makes the field writable.
   */
  enable() {
    this.disabled = false;
  }

  /**
   * Bind a entity field to the date-input. You can use the entity even when no data was received.
   * When you use `@-object-ready` from a `furo-data-object` which emits a EntityNode, just bind the field with `--entity(*.fields.fieldname)`
   * @param {Object|FieldNode} fieldNode a Field object
   */
  bindData(fieldNode) {
    Helper.BindData(this, fieldNode);
    this.field.addEventListener('branch-value-changed', () => {
      this._updateFieldBranch();
    });

    // init
    this._updateFieldBranch();
  }

  // eslint-disable-next-line class-methods-use-this
  _updateField() {}

  _updateFieldBranch() {
    // mark incomming error
    if (!this.field._isValid) {
      this.error = true;
      this.errortext = this.field._validity.description;
    }

    let dateValue = this.field._value;

    if (this.tmpval || JSON.stringify(this.field._value) !== JSON.stringify(this.tmpval)) {
      // convert value when date type is google.type.Date
      if (
        this.field._spec.type === 'google.type.Date' ||
        (this.field['@type'] &&
          this.field['@type']._value.replace(/.*\//, '') === 'google.type.Date')
      ) {
        dateValue = this._convertDateObjToString(dateValue);
      }

      this._FBPTriggerWire('--value', dateValue);

      this.requestUpdate();
    }
  }

  // convert google date object to ISO 8601
  // eslint-disable-next-line class-methods-use-this
  _convertDateObjToString(obj) {
    let date = '';

    if (obj && obj.day && obj.month && obj.year) {
      let month = String(obj.month);
      let day = String(obj.day);
      let year = String(obj.year);

      if (month.length < 2) {
        month = `0${month}`;
      }

      if (day.length < 2) {
        day = `0${day}`;
      }

      if (year.length < 4) {
        const l = 4 - year.length;
        for (let i = 0; i < l; i += 1) {
          year = `0${year}`;
        }
      }
      date = `${year}-${month}-${day}`;
    }

    return date;
  }

  // convert date string ISO 8601 to object for google.type.Dates
  // eslint-disable-next-line class-methods-use-this
  _convertStringToDateObj(str, obj) {
    const arr = str.split('-', 3);
    // only override properties: day, month, year
    if (arr.length === 3) {
      // eslint-disable-next-line no-param-reassign
      obj.day = Number(arr[2]);
      // eslint-disable-next-line no-param-reassign
      obj.month = Number(arr[1]);
      // eslint-disable-next-line no-param-reassign
      obj.year = Number(arr[0]);
    } else {
      // eslint-disable-next-line no-param-reassign
      obj.day = null;
      // eslint-disable-next-line no-param-reassign
      obj.month = null;
      // eslint-disable-next-line no-param-reassign
      obj.year = null;
    }

    return obj;
  }

  /**
   *
   * @private
   * @return {CSSResult}
   */
  static get styles() {
    // language=CSS
    return (
      Theme.getThemeForComponent('FuroDataDateInput') ||
      css`
        :host {
          display: inline-block;
          width: 190px;
        }

        :host([hidden]) {
          display: none;
        }

        furo-date-input {
          width: 100%;
        }
      `
    );
  }

  render() {
    // language=HTML
    return html`
      <furo-date-input
        id="input"
        ?autofocus=${this.autofocus}
        ?disabled=${this._readonly || this.disabled}
        ?error="${this.error}"
        ?float="${this.float}"
        ?condensed="${this.condensed}"
        ?required=${this._required}
        @-value-changed="--valueChanged"
        ƒ-set-value="--value"
      ></furo-date-input>
    `;
  }
}

customElements.define('furo-data-date-input', FuroDataDateInput);