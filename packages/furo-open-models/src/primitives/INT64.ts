import { FieldNode } from '../FieldNode';
import { Registry } from '../Registry';
import { FieldConstraints } from '../FieldConstraints';
import { OPEN_MODELS_OPTIONS } from '../OPEN_MODELS_OPTIONS';

export class INT64 extends FieldNode {
  get value(): bigint {
    return this._value;
  }

  set value(value: bigint) {
    this._value = value;
    this.__isEmpty = false;
    this.__climbUpValidation();
    this.__notifyFieldValueChange(true);
  }

  public _value: bigint;

  constructor(
    initData?: string,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__isPrimitive = true;
    this._value = BigInt(initData || '0');
    this.__meta.typeName = 'primitives.INT64';
  }

  __updateWithLiteral(v: string) {
    this._value = BigInt(v);
    this.__isEmpty = false;
    this.__notifyFieldValueChange(false);
  }

  protected ___updateNotEmptyPath() {
    if (this._value === 0n) {
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
          return ['constraint.violation.maximum', value, this._value];
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
        if (this._value % BigInt(value) !== 0n) {
          return ['constraint.violation.multiple_of', value, this._value];
        }
      }
    }

    return undefined;
  }

  __toJson(): string {
    return this.__toLiteral();
  }

  __toLiteral() {
    return this._value.toString();
  }

  valueOf(): bigint {
    return this._value;
  }

  toString(): string {
    return this._value.toString();
  }

  public __clear(withoutNotification: boolean = false) {
    // only notify when they are changes
    const shouldNotify = this._value !== 0n;
    this._value = 0n;
    if (shouldNotify && !withoutNotification) {
      this.__notifyFieldValueChange(false);
    }
  }
}

Registry.register('int64', INT64);
