// Code generated by furo protoc-gen-open-models. DO NOT EDIT.
// protoc-gen-open-models version: ????

import { FieldNode, Registry, STRING } from '@furo/open-models/dist/index';

/**
 * @interface IIdentifierAttributesEntry
 */
export interface IIdentifierAttributesEntry {
  key?: string;
  value?: string;
}

/**
 * @interface TIdentifierAttributesEntry
 */
export interface TIdentifierAttributesEntry {
  key?: string;
  value?: string;
}

/**
 * IdentifierAttributesEntry
 */
export class IdentifierAttributesEntry extends FieldNode {
  private _key: STRING;

  private _value: STRING;

  public __defaultValues: IIdentifierAttributesEntry;

  constructor(
    initData?: IIdentifierAttributesEntry,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'furo.type.Identifier.AttributesEntry';

    this.__meta.nodeFields = [
      {
        fieldName: 'key',
        protoName: 'key',
        FieldConstructor: STRING,
        constraints: {},
      },
      {
        fieldName: 'value',
        protoName: 'value',
        FieldConstructor: STRING,
        constraints: {},
      },
    ];

    // Initialize the fields
    this._key = new STRING(undefined, this, 'key');

    this._value = new STRING(undefined, this, 'value');

    // Set required fields
    [].forEach(fieldName => {
      (
        this[fieldName as keyof IdentifierAttributesEntry] as FieldNode
      ).__meta.required = true;
    });

    // Default values from openAPI annotations
    this.__defaultValues = {};

    // Initialize the fields with init data
    if (initData !== undefined) {
      this.__fromLiteral({ ...this.__defaultValues, ...initData });
    } else {
      this.__fromLiteral(this.__defaultValues);
    }

    // Set readonly fields after the init, so child nodes are readonly too
    [].forEach(fieldName => {
      (
        this[fieldName as keyof IdentifierAttributesEntry] as FieldNode
      ).__readonly = true;
    });

    this.__meta.isPristine = true;
  }

  public get key(): STRING {
    return this._key;
  }

  public set key(v: string) {
    this.__PrimitivesSetter(this._key, v);
  }

  public get value(): STRING {
    return this._value;
  }

  public set value(v: string) {
    this.__PrimitivesSetter(this._value, v);
  }

  fromLiteral(data: IIdentifierAttributesEntry) {
    super.__fromLiteral(data);
  }

  toLiteral(): IIdentifierAttributesEntry {
    return super.__toLiteral();
  }
}

Registry.register(
  'furo.type.Identifier.AttributesEntry',
  IdentifierAttributesEntry,
);