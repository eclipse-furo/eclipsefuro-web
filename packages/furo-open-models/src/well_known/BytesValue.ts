import type { FieldConstraints } from '../FieldConstraints';
import { FieldNode } from '../FieldNode';
import { OPEN_MODELS_OPTIONS } from '../OPEN_MODELS_OPTIONS';
import { Registry } from '../Registry';

export class BytesValue extends FieldNode {
  get value(): string {
    return this._value!;
  }

  set value(value: string | null) {
    this._value = value;
    if (
      OPEN_MODELS_OPTIONS.EmitDefaultValues ||
      OPEN_MODELS_OPTIONS.EmitUnpopulated
    ) {
      this.__isEmpty = false;
    } else {
      this.__isEmpty = value === null;
    }

    this.__climbUpValidation();
    this.__notifyFieldValueChange(true);
  }

  public _value: string | null = '';

  constructor(
    initData?: string,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);

    this.__isEmpty = !(
      OPEN_MODELS_OPTIONS.EmitDefaultValues ||
      OPEN_MODELS_OPTIONS.EmitUnpopulated
    );
    this._value = initData || '';
    this.__meta.typeName = 'google.protobuf.BytesValue';
  }

  override __updateWithLiteral(v: string | null) {
    this._value = v;
    if (
      OPEN_MODELS_OPTIONS.EmitDefaultValues ||
      OPEN_MODELS_OPTIONS.EmitUnpopulated
    ) {
      this.__isEmpty = false;
    } else {
      this.__isEmpty = v === null;
    }
    this.__notifyFieldValueChange(false);
  }

  // eslint-disable-next-line class-methods-use-this
  override __mapProtoNameJsonToJson(data: string): string {
    return data;
  }

  override __toJson(): string | null {
    return this.__toLiteral();
  }

  override __toLiteral() {
    return this._value;
  }

  protected override __checkConstraints(
    fieldConstraints: FieldConstraints,
  ): string[] | undefined {
     
    for (const [constraint, value] of Object.entries(fieldConstraints)) {
      if (constraint === 'required') {
        if (this._value === '') {
          return ['constraint.violation.required'];
        }
      }
      if (constraint === 'max_length') {
        // String length can be restricted using minLength and maxLength. ">" is used to check.
        if (this._value !== null && this._value.length > value) {
          return ['constraint.violation.max_length', String(value), this._value];
        }
      }
      if (constraint === 'min_length') {
        // String length can be restricted using minLength and maxLength. "<" is used to check.
        if (this._value !== null && this._value.length < value) {
          return ['constraint.violation.min_length', String(value), this._value];
        }
      }
    }

    return undefined;
  }

  override toString(): string {
    if (this._value !== null) {
      return this._value;
    }
    return '';
  }

  public override __clear(withoutNotification = false) {
    // only notify when they are changes
    const shouldNotify = this._value !== '';
    this._value = '';
    this.__isEmpty = !(
      OPEN_MODELS_OPTIONS.EmitDefaultValues ||
      OPEN_MODELS_OPTIONS.EmitUnpopulated
    );
    if (shouldNotify && !withoutNotification) {
      this.__notifyFieldValueChange(false);
    }
  }
}

Registry.register('BytesValue', BytesValue);
