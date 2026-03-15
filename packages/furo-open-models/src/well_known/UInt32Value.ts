import { FieldConstraints } from '../FieldConstraints';
import { FieldNode } from '../FieldNode';
import { OPEN_MODELS_OPTIONS } from '../OPEN_MODELS_OPTIONS';
import { Registry } from '../Registry';

export class UInt32Value extends FieldNode {
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

  public _value = 0;

  constructor(
    initData?: number  ,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);

    this.__isEmpty = !(
      OPEN_MODELS_OPTIONS.EmitDefaultValues ||
      OPEN_MODELS_OPTIONS.EmitUnpopulated
    );
    this._value = Number.isInteger(initData) ? (initData!) : 0;
    this.__meta.typeName = 'google.protobuf.UInt32Value';
  }

  override __updateWithLiteral(v: number) {
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
  override __mapProtoNameJsonToJson(data: number): number {
    return data;
  }

  override __toJson(): number | null {
    return this.__toLiteral();
  }

  override valueOf(): number {
    return this._value || NaN;
  }

  override __toLiteral() {
    return this._value;
  }

  protected override __checkTypeBoundaries(): string[] | undefined {
    // check for int32 min max boundaries
    if (this._value && this._value > 4294967295) {
      return ['constraint.violation.range.uint32.max', '4294967295'];
    }
    if (this._value && this._value < 0) {
      return ['constraint.violation.range.uint32.min', '0'];
    }
    return undefined;
  }

  protected override __checkConstraints(
    fieldConstraints: FieldConstraints,
  ): string[] | undefined {
     
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

  override toString(): string {
    if (this._value !== null && !Number.isNaN(this._value)) {
      return this._value.toString();
    }
    return '';
  }

  public override __clear(withoutNotification = false) {
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

Registry.register('UInt32Value', UInt32Value);
