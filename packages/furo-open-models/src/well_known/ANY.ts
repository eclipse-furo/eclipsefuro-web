// scalar and any typeName
import { FieldNode } from "../FieldNode";
import { Registry } from "../Registry";

export interface IAny {
  "@type": string;

  [key: string]: unknown;
}

export class ANY extends FieldNode {
  private _value: FieldNode | undefined;

  private _typeName = "";

  private _originalTypeName = "";

  constructor(
    _initData?: IAny, // Todo: any types with initData ??
    parent?: FieldNode,
    parentAttributeName?: string
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = `google.protobuf.Any`;
  }

  public override __clear() {
    // only notify when they are changes
    const shouldNotify = this._value !== undefined;
    this.__isEmpty = true;
    this._value = undefined;
    if (shouldNotify) {
      this.__notifyFieldValueChange(false);
    }
  }

  // used by broadcast
  public override get __childNodes(): FieldNode[] {
    if (this._value) {
      return [this._value];
    }
    return [];
  }

  get value() {
    return this._value;
  }

  set value(a: FieldNode | undefined) {
    this._value = a;
  }

  get typeName(): string {
    return this._typeName;
  }

  override __toJson(): object | null {
    if (this._value !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- runtime data may not match types (REST API input)
      const d = this._value?.__toJson() as Record<string, unknown>;
      d["@type"] = this._originalTypeName; //  send back the original type name instead of this._value?.__meta.typeName;
      return d;
    }
    return null;
  }

  override __toLiteral(): object | null {
    if (this._value !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- runtime data may not match types (REST API input)
      const d = this._value?.__toLiteral() as Record<string, unknown>;
      d["@type"] = this._originalTypeName; //  send back the original type name instead of this._value?.__meta.typeName;
      return d;
    }
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override __mapProtoNameJsonToJson(data: any): any {
    if ((data as Record<string, unknown>)["@type"] === undefined) {
      console.error(`@type is not defined: ${String((data as Record<string, unknown>)["@type"])}`, data);
      return undefined;
    }

    const originalTypeName = (data as Record<string, unknown>)["@type"] as string;
    // create a dummy object
    const fn = Registry.createInstanceByTypeName(
      originalTypeName.split("/").pop()!, // typename
      data,
      this,
      "value"
    );

    const literal = fn.__mapProtoNameJsonToJson(data) as Record<string, unknown>;
    literal["@type"] = originalTypeName;

    return literal;
  }

  override __updateWithLiteral(data: IAny) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- runtime data may not match types (REST API input)
    if (data["@type"] === undefined) {
      console.error(`@type is not defined: ${String(data["@type"])}`, data);
      return;
    }
    this._originalTypeName = data["@type"];
    const typeName = data["@type"].split("/").pop();
    if (typeName) {
      this._typeName = typeName;
      try {
        this.value = Registry.createInstanceByTypeName(this._typeName, data, this, "value");
        this.value.__meta.isAnyNode = true;
        this.__isEmpty = false;
        this.__notifyFieldValueChange(false);
      } catch (err) {
        console.error(err);
        this.__isEmpty = true;
        this.__notifyFieldValueChange(false);
      }
    } else {
      console.error(`Could not resolve type from empty type field: ${data["@type"]}`, data);
    }
  }
}
