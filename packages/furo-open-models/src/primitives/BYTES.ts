import type { FieldConstraints } from "../FieldConstraints";
import { FieldNode } from "../FieldNode";
import { OPEN_MODELS_OPTIONS } from "../OPEN_MODELS_OPTIONS";
import { Registry } from "../Registry";

export class BYTES extends FieldNode {
  get value(): Uint8Array {
    return this._value;
  }

  set value(value: Uint8Array) {
    this._value = value;
    if (this._value.length === 0) {
      this.__isEmpty = !(OPEN_MODELS_OPTIONS.EmitDefaultValues || OPEN_MODELS_OPTIONS.EmitUnpopulated);
    } else {
      this.__isEmpty = false;
    }
    this.__climbUpValidation();
    this.__notifyFieldValueChange(true);
  }

  public _value: Uint8Array;

  constructor(initData?: Uint8Array, parent?: FieldNode, parentAttributeName?: string) {
    super(undefined, parent, parentAttributeName);
    this.__isPrimitive = true;
    this._value = initData ?? new Uint8Array();
    this.__meta.typeName = "primitives.BYTES";
    this.__isEmpty = !(OPEN_MODELS_OPTIONS.EmitDefaultValues || OPEN_MODELS_OPTIONS.EmitUnpopulated);
  }

  override __updateWithLiteral(v: Uint8Array) {
    this._value = v;
    if (this._value.length === 0) {
      this.__isEmpty = !(OPEN_MODELS_OPTIONS.EmitDefaultValues || OPEN_MODELS_OPTIONS.EmitUnpopulated);
    } else {
      this.__isEmpty = false;
    }
    this.__notifyFieldValueChange(false);
  }

  protected override ___updateNotEmptyPath() {
    if (this._value.length === 0) {
      this.___isEmpty = !(OPEN_MODELS_OPTIONS.EmitDefaultValues || OPEN_MODELS_OPTIONS.EmitUnpopulated);
    } else {
      this.___isEmpty = false;
      super.___updateNotEmptyPath();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  override __mapProtoNameJsonToJson(data: Uint8Array): Uint8Array {
    return data;
  }

  protected override __checkConstraints(fieldConstraints: FieldConstraints): string[] | undefined {
    for (const [constraint, value] of Object.entries(fieldConstraints)) {
      if (constraint === "required") {
        if (this._value.length === 0) {
          return ["constraint.violation.required"];
        }
      }
      if (constraint === "max_length") {
        // String length can be restricted using minLength and maxLength. ">" is used to check.
        if (this._value.length > value) {
          return ["constraint.violation.max_length", String(value), String(this._value)];
        }
      }
      if (constraint === "min_length") {
        // String length can be restricted using minLength and maxLength. "<" is used to check.
        if (this._value.length < value) {
          return ["constraint.violation.min_length", String(value), String(this._value)];
        }
      }
      if (constraint === "pattern") {
        // The pattern keyword lets you define a regular expression template for the Uint8Array value.

        const re = new RegExp(value as string);
        if (!this._value.toString().match(re)) {
          return ["constraint.violation.pattern", String(value), String(this._value)];
        }
      }
    }

    return undefined;
  }

  override __toJson(): Uint8Array {
    return this.__toLiteral();
  }

  override __toLiteral(): Uint8Array {
    return this._value;
  }

  override toString(): string {
    return this._value.toString();
  }

  public override __clear(withoutNotification = false) {
    // only notify when they are changes
    const shouldNotify = this._value.length;
    this._value = new Uint8Array();
    this.__isEmpty = !(OPEN_MODELS_OPTIONS.EmitDefaultValues || OPEN_MODELS_OPTIONS.EmitUnpopulated);
    if (shouldNotify && !withoutNotification) {
      this.__notifyFieldValueChange(false);
    }
  }
}

Registry.register("Uint8Array", BYTES);
