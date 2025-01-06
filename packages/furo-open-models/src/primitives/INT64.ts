import { FieldNode } from '../FieldNode';
import { Registry } from '../Registry';
import { FieldConstraints } from '../FieldConstraints';
import { OPEN_MODELS_OPTIONS } from '../OPEN_MODELS_OPTIONS';

export class INT64 extends FieldNode {
  get value(): number {
    return this._value;
  }

  set value(value: number) {
    this._value = value;
    this.__isEmpty = false;
    this.__climbUpValidation();
    this.__notifyFieldValueChange(true);
  }

  public _value: number;

  constructor(
    initData?: number,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__isPrimitive = true;
    this._value = Number.isInteger(initData) ? (initData as number) : 0;
    this.__meta.typeName = 'primitives.INT64';
  }

  __updateWithLiteral(v: number) {
    this._value = v;
    this.__isEmpty = false;
    this.__notifyFieldValueChange(false);
  }

  protected ___updateNotEmptyPath() {
    if (this._value === 0) {
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
  __mapProtoNameJsonToJson(data: number): number {
    return data;
  }

  protected __checkTypeBoundaries(): string[] | undefined {
    // check for int64 min max boundaries

    if (this._value > Number.MAX_SAFE_INTEGER) {
      return [
        'constraint.violation.range.int64.max',
        Number.MAX_SAFE_INTEGER.toString(),
      ];
    }
    if (this._value < Number.MIN_SAFE_INTEGER) {
      return [
        'constraint.violation.range.int64.min',
        Number.MIN_SAFE_INTEGER.toString(),
      ];
    }
    return undefined;
  }

  protected __checkConstraints(
    fieldConstraints: FieldConstraints,
  ): string[] | undefined {
    // eslint-disable-next-line guard-for-in
    for (const [constraint, value] of Object.entries(fieldConstraints)) {
      // An int64 has always a value if (constraint === 'required') {}
      if (constraint === 'maximum') {
        // By default, the minimum and maximum values are included in the range. ">" is used to check.
        if (fieldConstraints.exclusive_maximum && this._value >= value) {
          return ['constraint.violation.exclusive_maximum', value, this._value];
        }
        if (this._value > value) {
          return ['constraint.violation.maximum', value];
        }
      }
      if (constraint === 'minimum') {
        // By default, the minimum and maximum values are included in the range. "<" is used to check.
        if (fieldConstraints.exclusive_minimum && this._value <= value) {
          return ['constraint.violation.exclusive_minimum', value, this._value];
        }
        if (this._value < value) {
          return ['constraint.violation.minimum', value, this._value];
        }
      }
      if (constraint === 'multiple_of') {
        // Use the multiple_of keyword to specify that a number must be the multiple of another number
        // use this to define the step ??
        if (this._value % value !== 0) {
          return ['constraint.violation.multiple_of', value, this._value];
        }
      }
    }

    return undefined;
  }

  __toJson(): number {
    return this.__toLiteral();
  }

  __toLiteral() {
    return this._value;
  }

  valueOf(): number {
    return this._value;
  }

  toString(): string {
    return this._value.toString();
  }

  __clear() {
    this._value = 0;
  }
}

Registry.register('int64', INT64);