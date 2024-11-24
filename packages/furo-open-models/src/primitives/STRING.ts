import { FieldNode } from '../FieldNode';
import { Registry } from '../Registry';
import { OPEN_MODELS_OPTIONS } from '../OPEN_MODELS_OPTIONS';
import { FieldConstraints } from '../FieldConstraints';

export class STRING extends FieldNode {
  get value(): string {
    return this._value;
  }

  set value(value: string) {
    this._value = value;
    if (this._value === '') {
      this.__isEmpty = !(
        OPEN_MODELS_OPTIONS.EmitDefaultValues ||
        OPEN_MODELS_OPTIONS.EmitUnpopulated
      );
    } else {
      this.__isEmpty = false;
    }
    this.__climbUpValidation();
    this.__notifyFieldValueChange(true);
  }

  public _value: string;

  constructor(
    initData?: string,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__isPrimitive = true;
    this._value = initData || '';
    this.__meta.typeName = 'primitives.STRING';
    this.__isEmpty = !(
      OPEN_MODELS_OPTIONS.EmitDefaultValues ||
      OPEN_MODELS_OPTIONS.EmitUnpopulated
    );
  }

  __updateWithLiteral(v: string) {
    this._value = v;
    if (this._value === '') {
      this.__isEmpty = !(
        OPEN_MODELS_OPTIONS.EmitDefaultValues ||
        OPEN_MODELS_OPTIONS.EmitUnpopulated
      );
    } else {
      this.__isEmpty = false;
    }
    this.__notifyFieldValueChange(false);
  }

  protected ___updateNotEmptyPath() {
    if (this._value === '') {
      this.___isEmpty = !(
        OPEN_MODELS_OPTIONS.EmitDefaultValues ||
        OPEN_MODELS_OPTIONS.EmitUnpopulated
      );
    } else {
      this.___isEmpty = false;
      super.___updateNotEmptyPath();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  __mapProtoNameJsonToJson(data: string): string {
    return data;
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
        if (this._value.length > value) {
          return ['constraint.violation.max_length', value, this._value];
        }
      }
      if (constraint === 'min_length') {
        // String length can be restricted using minLength and maxLength. "<" is used to check.
        if (this._value.length < value) {
          return ['constraint.violation.min_length', value, this._value];
        }
      }
      if (constraint === 'pattern') {
        // The pattern keyword lets you define a regular expression template for the string value.

        const re = new RegExp(value);
        if (!this._value.match(re)) {
          return ['constraint.violation.pattern', value, this._value];
        }
      }
    }

    return undefined;
  }

  __toJson(): string {
    return this.__toLiteral();
  }

  __toLiteral() {
    return this._value;
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

Registry.register('string', STRING);
