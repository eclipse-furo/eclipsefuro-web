import { FieldNode } from "../FieldNode";
import { Registry } from "../Registry";

export class EMPTY extends FieldNode {
  get value(): Record<string, never> {
    return this._value;
  }

  set value(_value: Record<string, never>) {
    this.__isEmpty = true;
  }

  public _value: Record<string, never> = {};

  constructor(_initData?: Record<string, never>, parent?: FieldNode, parentAttributeName?: string) {
    super(undefined, parent, parentAttributeName);

    this.__isEmpty = true;
    this.__meta.typeName = "google.protobuf.Empty";
  }

  override __updateWithLiteral(_: Record<string, never>) {
    this.__isEmpty = false;
  }

  // eslint-disable-next-line class-methods-use-this
  override __mapProtoNameJsonToJson(data: number): number {
    return data;
  }

  override __toJson(): Record<string, never> | null {
    return this.__toLiteral();
  }

  override valueOf(): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- runtime data may not match types (REST API input)
    return this._value ? 1 : 0;
  }

  override __toLiteral() {
    return this._value;
  }

  override toString(): string {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- runtime data may not match types (REST API input)
    if (this._value !== null) {
      return JSON.stringify(this._value);
    }
    return "";
  }

  public override __clear() {
    this._value = {};
    this.__isEmpty = true;
    // empty never changes
  }
}

Registry.register("google.protobuf.Empty", EMPTY);
