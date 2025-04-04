import { FieldNode } from '../FieldNode';
import { Registry } from '../Registry';
import { FieldConstraints } from '../FieldConstraints';
import { OPEN_MODELS_OPTIONS } from '../OPEN_MODELS_OPTIONS';

export type JSONValue =
  | string
  | number
  | boolean
  | null
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

export type JSONObject = { [x: string]: JSONValue };

/**
 * Struct represents a structured data value, consisting of fields which map to dynamically typed values. In some languages, Struct might be supported by a native representation. For example, in scripting languages like JS a struct is represented as an object. The details of that representation are described together with the proto support for the language.
 *
 * The JSON representation for Struct is JSON object.
 *
 * https://protobuf.dev/reference/protobuf/google.protobuf/#struct
 */
export class Struct extends FieldNode {
  get value(): JSONObject {
    return this._value;
  }

  set value(value: JSONObject) {
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

  public _value: JSONObject = {};

  constructor(
    initData?: JSONObject,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);

    this.__isEmpty = !(
      OPEN_MODELS_OPTIONS.EmitDefaultValues ||
      OPEN_MODELS_OPTIONS.EmitUnpopulated
    );

    this._value = initData || {};
    this.__meta.typeName = 'google.protobuf.Struct';
  }

  __updateWithLiteral(v: JSONObject) {
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
  __mapProtoNameJsonToJson(data: string): string {
    return data;
  }

  __toJson(): JSONObject | null {
    return this.__toLiteral();
  }

  __toLiteral() {
    return this._value;
  }

  protected __checkConstraints(
    fieldConstraints: FieldConstraints,
  ): string[] | undefined {
    // eslint-disable-next-line guard-for-in
    for (const [constraint] of Object.entries(fieldConstraints)) {
      if (constraint === 'required') {
        if (this._value === null) {
          return ['constraint.violation.required'];
        }
      }
    }

    return undefined;
  }

  toString(): string {
    if (this._value !== null) {
      return JSON.stringify(this._value);
    }
    return '';
  }

  public __clear(withoutNotification: boolean = false) {
    // only notify when they are changes
    const shouldNotify = JSON.stringify(this._value) !== '{}';
    this._value = {};
    this.__isEmpty = !(
      OPEN_MODELS_OPTIONS.EmitDefaultValues ||
      OPEN_MODELS_OPTIONS.EmitUnpopulated
    );
    if (shouldNotify && !withoutNotification) {
      this.__notifyFieldValueChange(false);
    }
  }
}

Registry.register('Struct', Struct);
