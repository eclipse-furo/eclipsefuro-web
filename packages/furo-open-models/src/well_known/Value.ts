import type { FieldConstraints } from "../FieldConstraints";
import { FieldNode } from "../FieldNode";
import { OPEN_MODELS_OPTIONS } from "../OPEN_MODELS_OPTIONS";
import { Registry } from "../Registry";
import type { JSONValue } from "./Struct";

/**
 * Value represents a dynamically typed value: null, a number, a string, a boolean, a JSON object or
 * a JSON array. It is the field type for a JSON field that takes more than one shape, like OpenAI's
 * `content`, which is either a string or an array of parts.
 *
 * The JSON representation for Value is the JSON value itself.
 *
 * https://protobuf.dev/reference/protobuf/google.protobuf/#value
 */
export class Value extends FieldNode {
  get value(): JSONValue {
    return this._value;
  }

  set value(value: JSONValue) {
    this._value = value;
    if (OPEN_MODELS_OPTIONS.EmitDefaultValues || OPEN_MODELS_OPTIONS.EmitUnpopulated) {
      this.__isEmpty = false;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- runtime data may not match types (REST API input)
      this.__isEmpty = value === null || value === undefined;
    }

    this.__climbUpValidation();
    this.__notifyFieldValueChange(true);
  }

  public _value: JSONValue = null;

  constructor(initData?: JSONValue, parent?: FieldNode, parentAttributeName?: string) {
    super(undefined, parent, parentAttributeName);

    this.__isEmpty = !(OPEN_MODELS_OPTIONS.EmitDefaultValues || OPEN_MODELS_OPTIONS.EmitUnpopulated);

    this._value = initData ?? null;
    this.__meta.typeName = "google.protobuf.Value";
  }

  override __updateWithLiteral(v: JSONValue) {
    this._value = v ?? null;
    if (OPEN_MODELS_OPTIONS.EmitDefaultValues || OPEN_MODELS_OPTIONS.EmitUnpopulated) {
      this.__isEmpty = false;
    } else {
      this.__isEmpty = this._value === null;
    }
    this.__notifyFieldValueChange(false);
  }

  // The keys inside a Value are data, not field names, so they are never renamed.
  // eslint-disable-next-line class-methods-use-this
  override __mapProtoNameJsonToJson(data: string): string {
    return data;
  }

  override __toJson(): JSONValue {
    return this.__toLiteral();
  }

  override __toLiteral() {
    return this._value;
  }

  protected override __checkConstraints(fieldConstraints: FieldConstraints): string[] | undefined {
    for (const [constraint] of Object.entries(fieldConstraints)) {
      if (constraint === "required") {
        if (this._value === null) {
          return ["constraint.violation.required"];
        }
      }
    }

    return undefined;
  }

  override toString(): string {
    if (this._value === null) {
      return "";
    }
    return typeof this._value === "string" ? this._value : JSON.stringify(this._value);
  }

  public override __clear() {
    // only notify when they are changes
    const shouldNotify = this._value !== null;
    this._value = null;
    this.__isEmpty = !(OPEN_MODELS_OPTIONS.EmitDefaultValues || OPEN_MODELS_OPTIONS.EmitUnpopulated);
    if (shouldNotify) {
      this.__notifyFieldValueChange(false);
    }
  }
}

Registry.register("Value", Value);
