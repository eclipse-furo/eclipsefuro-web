import { FieldNode } from '../FieldNode';
import { Registry } from '../Registry';
import { FieldConstraints } from '../FieldConstraints';
import { OPEN_MODELS_OPTIONS } from '../OPEN_MODELS_OPTIONS';

export class BytesValue extends FieldNode {
  get value(): string {
    return this._value;
  }

  set value(value: string) {
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

  public _value: string = '';

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

  __updateWithLiteral(v: string) {
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
  __mapProtoNameJsonToJson(data: string): string {
    return data;
  }

  __toJson(): string {
    return this.__toLiteral();
  }

  __toLiteral() {
    return this._value;
  }

  protected __checkConstraints(
    fieldConstraints: FieldConstraints,
  ): string[] | undefined {
    // eslint-disable-next-line guard-for-in
    for (const [constraint, value] of Object.entries(fieldConstraints)) {
      if (constraint === 'required') {
        if (this._value === '') {
          return ['constraint.violation.required'];
        }
      }
      if (constraint === 'max_length') {
        // String length can be restricted using minLength and maxLength. ">" is used to check.
        if (this._value !== null && this._value.length > value) {
          return ['constraint.violation.max_length', value, this._value];
        }
      }
      if (constraint === 'min_length') {
        // String length can be restricted using minLength and maxLength. "<" is used to check.
        if (this._value !== null && this._value.length < value) {
          return ['constraint.violation.min_length', value, this._value];
        }
      }
    }

    return undefined;
  }

  toString(): string {
    return this._value;
  }

  __clear() {
    this._value = '';
    this.__isEmpty = !(
      OPEN_MODELS_OPTIONS.EmitDefaultValues ||
      OPEN_MODELS_OPTIONS.EmitUnpopulated
    );
  }
}

Registry.register('BytesValue', BytesValue);
