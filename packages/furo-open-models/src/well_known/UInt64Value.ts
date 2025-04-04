import { FieldNode } from '../FieldNode';
import { Registry } from '../Registry';
import { FieldConstraints } from '../FieldConstraints';
import { OPEN_MODELS_OPTIONS } from '../OPEN_MODELS_OPTIONS';

export class UInt64Value extends FieldNode {
  get value(): number {
    return this._value;
  }

  set value(value: number) {
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

  public _value: number = 0;

  constructor(
    initData?: number | undefined,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);

    this.__isEmpty = !(
      OPEN_MODELS_OPTIONS.EmitDefaultValues ||
      OPEN_MODELS_OPTIONS.EmitUnpopulated
    );
    this._value = Number.isInteger(initData) ? (initData as number) : 0;
    this.__meta.typeName = 'google.protobuf.UInt64Value';
  }

  __updateWithLiteral(v: number) {
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
  __mapProtoNameJsonToJson(data: number): number {
    return data;
  }

  __toJson(): number | null {
    return this.__toLiteral();
  }

  valueOf(): number {
    return this._value || NaN;
  }

  __toLiteral() {
    return this._value;
  }

  protected __checkTypeBoundaries(): string[] | undefined {
    // check for uint64 min max boundaries
    if (this._value && this._value > Number.MAX_SAFE_INTEGER) {
      return [
        'constraint.violation.range.uint64.max',
        Number.MAX_SAFE_INTEGER.toString(),
      ];
    }
    if (this._value && this._value < 0) {
      return ['constraint.violation.range.uint64.min', '0'];
    }
    return undefined;
  }

  protected __checkConstraints(
    fieldConstraints: FieldConstraints,
  ): string[] | undefined {
    // eslint-disable-next-line guard-for-in
    for (const [constraint, value] of Object.entries(fieldConstraints)) {
      if (constraint === 'maximum') {
        // By default, the minimum and maximum values are included in the range. ">" is used to check.
        if (
          fieldConstraints.exclusive_maximum &&
          this._value !== null &&
          this._value >= value
        ) {
          return ['constraint.violation.exclusive_maximum', value, this._value];
        }
        if (this._value !== null && this._value > value) {
          return ['constraint.violation.maximum', value, this._value];
        }
      }
      if (constraint === 'minimum') {
        // By default, the minimum and maximum values are included in the range. "<" is used to check.
        if (
          fieldConstraints.exclusive_minimum &&
          this._value !== null &&
          this._value <= value
        ) {
          return ['constraint.violation.exclusive_minimum', value, this._value];
        }
        if (this._value !== null && this._value < value) {
          return ['constraint.violation.minimum', value, this._value];
        }
      }
      if (constraint === 'multiple_of') {
        // Use the multiple_of keyword to specify that a number must be the multiple of another number
        // use this to define the step ??
        if (this._value !== null && this._value % value !== 0) {
          return ['constraint.violation.multiple_of', value, this._value];
        }
      }
    }

    return undefined;
  }

  toString(): string {
    if (this._value !== null && !Number.isNaN(this._value)) {
      return this._value.toString();
    }
    return '';
  }

  public __clear(withoutNotification: boolean = false) {
    // only notify when they are changes
    const shouldNotify = this._value !== 0;
    this._value = 0;
    this.__isEmpty = !(
      OPEN_MODELS_OPTIONS.EmitDefaultValues ||
      OPEN_MODELS_OPTIONS.EmitUnpopulated
    );
    if (shouldNotify && !withoutNotification) {
      this.__notifyFieldValueChange(false);
    }
  }
}

Registry.register('UInt64Value', UInt64Value);
