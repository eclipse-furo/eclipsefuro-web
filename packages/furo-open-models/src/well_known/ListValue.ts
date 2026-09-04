import type { FieldConstraints } from "../FieldConstraints";
import { FieldNode } from "../FieldNode";
import { OPEN_MODELS_OPTIONS } from "../OPEN_MODELS_OPTIONS";
import { Registry } from "../Registry";
import type { JSONValue } from "./Struct";

/**
 * ListValue is a wrapper around a repeated field of values.
 *
 * The JSON representation for ListValue is JSON array.
 *
 * https://protobuf.dev/reference/protobuf/google.protobuf/#list-value
 */
export class ListValue extends FieldNode {
  get value(): JSONValue[] {
    return this._value;
  }

  set value(value: JSONValue[]) {
    this._value = value;
    if (OPEN_MODELS_OPTIONS.EmitDefaultValues || OPEN_MODELS_OPTIONS.EmitUnpopulated) {
      this.__isEmpty = false;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- runtime data may not match types (REST API input)
      this.__isEmpty = value === null;
    }

    this.__climbUpValidation();
    this.__notifyFieldValueChange(true);
  }

  public _value: JSONValue[] = [];

  constructor(initData?: JSONValue[], parent?: FieldNode, parentAttributeName?: string) {
    super(undefined, parent, parentAttributeName);

    this.__isEmpty = !(OPEN_MODELS_OPTIONS.EmitDefaultValues || OPEN_MODELS_OPTIONS.EmitUnpopulated);

    this._value = initData ?? [];
    this.__meta.typeName = "google.protobuf.ListValue";
  }

  override __updateWithLiteral(v: JSONValue[]) {
    this._value = v;
    if (OPEN_MODELS_OPTIONS.EmitDefaultValues || OPEN_MODELS_OPTIONS.EmitUnpopulated) {
      this.__isEmpty = false;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- runtime data may not match types (REST API input)
      this.__isEmpty = v === null;
    }
    this.__notifyFieldValueChange(false);
  }

  // eslint-disable-next-line class-methods-use-this
  override __mapProtoNameJsonToJson(data: string): string {
    return data;
  }

  override __toJson(): JSONValue[] | null {
    return this.__toLiteral();
  }

  override __toLiteral() {
    return this._value;
  }

  protected override __checkConstraints(fieldConstraints: FieldConstraints): string[] | undefined {
    for (const [constraint] of Object.entries(fieldConstraints)) {
      if (constraint === "required") {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- runtime data may not match types (REST API input)
        if (this._value === null) {
          return ["constraint.violation.required"];
        }
      }
    }

    return undefined;
  }

  override toString(): string {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- runtime data may not match types (REST API input)
    if (this._value !== null) {
      return JSON.stringify(this._value);
    }
    return "";
  }

  public override __clear() {
    // only notify when they are changes
    const shouldNotify = JSON.stringify(this._value) !== "[]";
    this._value = [];
    this.__isEmpty = !(OPEN_MODELS_OPTIONS.EmitDefaultValues || OPEN_MODELS_OPTIONS.EmitUnpopulated);
    if (shouldNotify) {
      this.__notifyFieldValueChange(false);
    }
  }
}

Registry.register("ListValue", ListValue);
