import type { FieldConstraints } from "../FieldConstraints";
import { FieldNode } from "../FieldNode";
import { OPEN_MODELS_OPTIONS } from "../OPEN_MODELS_OPTIONS";
import { Registry } from "../Registry";

export class STRING extends FieldNode {
  get value(): string {
    return this._value;
  }

  set value(value: string) {
    // guard for API responses which sometimes send a null instead of an empty string
    if (typeof value !== "string") {
      value = "";
    }

    this._value = value;
    if (this._value === "") {
      this.__isEmpty = !(OPEN_MODELS_OPTIONS.EmitDefaultValues || OPEN_MODELS_OPTIONS.EmitUnpopulated);
    } else {
      this.__isEmpty = false;
    }
    this.__climbUpValidation();
    this.__notifyFieldValueChange(true);
  }

  public _value: string;

  constructor(initData?: string, parent?: FieldNode, parentAttributeName?: string) {
    super(undefined, parent, parentAttributeName);
    this.__isPrimitive = true;
    this._value = initData ?? "";
    this.__meta.typeName = "primitives.STRING";
    this.__isEmpty = !(OPEN_MODELS_OPTIONS.EmitDefaultValues || OPEN_MODELS_OPTIONS.EmitUnpopulated);
  }

  override __updateWithLiteral(v: string) {
    // guard for API responses which sometimes send a null instead of an empty string
    if (typeof v !== "string") {
      v = "";
    }
    this._value = v;
    if (this._value === "") {
      this.__isEmpty = !(OPEN_MODELS_OPTIONS.EmitDefaultValues || OPEN_MODELS_OPTIONS.EmitUnpopulated);
    } else {
      this.__isEmpty = false;
    }
    this.__notifyFieldValueChange(false);
  }

  protected override ___updateNotEmptyPath() {
    if (this._value === "") {
      this.___isEmpty = !(OPEN_MODELS_OPTIONS.EmitDefaultValues || OPEN_MODELS_OPTIONS.EmitUnpopulated);
    } else {
      this.___isEmpty = false;
      super.___updateNotEmptyPath();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  override __mapProtoNameJsonToJson(data: string): string {
    return data;
  }

  protected override __checkConstraints(fieldConstraints: FieldConstraints): string[] | undefined {
    for (const [constraint, value] of Object.entries(fieldConstraints)) {
      if (constraint === "required") {
        if (this._value === "") {
          return ["constraint.violation.required"];
        }
      }
      if (constraint === "max_length") {
        // String length can be restricted using minLength and maxLength. ">" is used to check.
        if (this._value.length > value) {
          return ["constraint.violation.max_length", String(value), this._value];
        }
      }
      if (constraint === "min_length") {
        // String length can be restricted using minLength and maxLength. "<" is used to check.
        if (this._value.length < value) {
          return ["constraint.violation.min_length", String(value), this._value];
        }
      }
      if (constraint === "pattern") {
        // The pattern keyword lets you define a regular expression template for the string value.

        const re = new RegExp(value as string);
        if (!this._value.match(re)) {
          return ["constraint.violation.pattern", String(value), this._value];
        }
      }
    }

    return undefined;
  }

  override __toJson(): string {
    return this.__toLiteral();
  }

  override __toLiteral() {
    return this._value;
  }

  override toString(): string {
    return this._value;
  }

  public override __clear(withoutNotification = false) {
    // only notify when they are changes
    const shouldNotify = this._value.length;
    this._value = "";
    this.__isEmpty = !(OPEN_MODELS_OPTIONS.EmitDefaultValues || OPEN_MODELS_OPTIONS.EmitUnpopulated);
    if (shouldNotify && !withoutNotification) {
      this.__notifyFieldValueChange(false);
    }
  }
}

Registry.register("string", STRING);
