// Code generated by furo protoc-gen-open-models. DO NOT EDIT.
// protoc-gen-open-models version: ????

import { FieldNode, Registry, STRING } from '@furo/open-models/dist/index';

/**
 * @interface IStringAttributesEntry
 */
export interface IStringAttributesEntry {
  /**
   *  Furo annotated type wrapper message for `string`.
   */
  key?: string;
  /**
   *  Furo annotated type wrapper message for `string`.
   */
  value?: string;
}

/**
 * @interface TStringAttributesEntry
 */
export interface TStringAttributesEntry {
  /**
   *  Furo annotated type wrapper message for `string`.
   */
  key?: string;
  /**
   *  Furo annotated type wrapper message for `string`.
   */
  value?: string;
}

/**
 * StringAttributesEntry
 */
export class StringAttributesEntry extends FieldNode {
  //  Furo annotated type wrapper message for `string`.
  private _key: STRING;

  //  Furo annotated type wrapper message for `string`.
  private _value: STRING;

  public __defaultValues: IStringAttributesEntry;

  constructor(
    initData?: IStringAttributesEntry,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'furo.fat.String.AttributesEntry';

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
    //  Furo annotated type wrapper message for `string`.
    this._key = new STRING(undefined, this, 'key');

    //  Furo annotated type wrapper message for `string`.
    this._value = new STRING(undefined, this, 'value');

    // Set required fields
    [].forEach(fieldName => {
      (
        this[fieldName as keyof StringAttributesEntry] as FieldNode
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
      (this[fieldName as keyof StringAttributesEntry] as FieldNode).__readonly =
        true;
    });

    this.__meta.isPristine = true;
  }

  //  Furo annotated type wrapper message for `string`.
  public get key(): STRING {
    return this._key;
  }

  public set key(v: string) {
    this.__PrimitivesSetter(this._key, v);
  }

  //  Furo annotated type wrapper message for `string`.
  public get value(): STRING {
    return this._value;
  }

  public set value(v: string) {
    this.__PrimitivesSetter(this._value, v);
  }

  fromLiteral(data: IStringAttributesEntry) {
    super.__fromLiteral(data);
  }

  toLiteral(): IStringAttributesEntry {
    return super.__toLiteral();
  }
}

Registry.register('furo.fat.String.AttributesEntry', StringAttributesEntry);
