import type { FieldConstraints } from "../FieldConstraints";
import { FieldNode } from "../FieldNode";
import { OPEN_MODELS_OPTIONS } from "../OPEN_MODELS_OPTIONS";
import { Registry } from "../Registry";

export class Int64Value extends FieldNode {
  get value(): bigint | null {
    return this._value!;
  }

  set value(value: bigint | null) {
    this._value = value;
    if (OPEN_MODELS_OPTIONS.EmitDefaultValues || OPEN_MODELS_OPTIONS.EmitUnpopulated) {
      this.__isEmpty = false;
    } else {
      this.__isEmpty = value === null;
    }

    this.__climbUpValidation();
    this.__notifyFieldValueChange(true);
  }

  public _value: bigint | null = null;

  constructor(initData?: string, parent?: FieldNode, parentAttributeName?: string) {
    super(undefined, parent, parentAttributeName);

    this.__isEmpty = !(OPEN_MODELS_OPTIONS.EmitDefaultValues || OPEN_MODELS_OPTIONS.EmitUnpopulated);
    if (initData !== undefined) {
      this._value = BigInt(initData);
    }

    this.__meta.typeName = "google.protobuf.Int64Value";
  }

  override __updateWithLiteral(v: string | null) {
    this._value = v !== null ? BigInt(v) : null;
    if (OPEN_MODELS_OPTIONS.EmitDefaultValues || OPEN_MODELS_OPTIONS.EmitUnpopulated) {
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

  override __toJson(): string | null {
    return this.__toLiteral();
  }

  override valueOf() {
    return this._value ?? NaN;
  }

  override __toLiteral() {
    return this._value!.toString();
  }

  protected override __checkConstraints(fieldConstraints: FieldConstraints): string[] | undefined {
    for (const [constraint, value] of Object.entries(fieldConstraints)) {
      if (constraint === "maximum") {
        // By default, the minimum and maximum values are included in the range. ">" is used to check.
        if (fieldConstraints.exclusive_maximum && this._value !== null && this._value >= value) {
          return ["constraint.violation.exclusive_maximum", String(value), String(this._value)];
        }
        if (this._value !== null && this._value > value) {
          return ["constraint.violation.maximum", String(value), String(this._value)];
        }
      }
      if (constraint === "minimum") {
        // By default, the minimum and maximum values are included in the range. "<" is used to check.
        if (fieldConstraints.exclusive_minimum && this._value !== null && this._value <= value) {
          return ["constraint.violation.exclusive_minimum", String(value), String(this._value)];
        }
        if (this._value !== null && this._value < value) {
          return ["constraint.violation.minimum", String(value), String(this._value)];
        }
      }
      if (constraint === "multiple_of") {
        // Use the multiple_of keyword to specify that a number must be the multiple of another number
        // use this to define the step ??
        if (this._value !== null && this._value % BigInt(value as string | number | bigint | boolean) !== 0n) {
          return ["constraint.violation.multiple_of", String(value), String(this._value)];
        }
      }
      if (constraint === "required") {
        if (this._value === null) {
          return ["constraint.violation.required"];
        }
      }
    }

    return undefined;
  }

  override toString(): string {
    if (this._value !== null && !Number.isNaN(this._value)) {
      return this._value.toString();
    }
    return "";
  }

  public override __clear() {
    // only notify when they are changes
    const shouldNotify = this._value !== 0n;
    this._value = 0n;
    this.__isEmpty = !(OPEN_MODELS_OPTIONS.EmitDefaultValues || OPEN_MODELS_OPTIONS.EmitUnpopulated);
    if (shouldNotify) {
      this.__notifyFieldValueChange(false);
    }
  }
}

Registry.register("Int64Value", Int64Value);
