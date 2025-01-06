// Code generated by furo protoc-gen-open-models. DO NOT EDIT.
// protoc-gen-open-models version: ????

import {
  BOOLEAN,
  FieldNode,
  Registry,
  STRING,
} from '@furo/open-models/dist/index';

/**
 * @interface IBytesLabelsEntry
 */
export interface IBytesLabelsEntry {
  /**
   *  Furo annotated type wrapper message for `bytes`.
   */
  key?: string;
  /**
   *  Furo annotated type wrapper message for `bytes`.
   */
  value?: boolean;
}

/**
 * @interface TBytesLabelsEntry
 */
export interface TBytesLabelsEntry {
  /**
   *  Furo annotated type wrapper message for `bytes`.
   */
  key?: string;
  /**
   *  Furo annotated type wrapper message for `bytes`.
   */
  value?: boolean;
}

/**
 * BytesLabelsEntry
 */
export class BytesLabelsEntry extends FieldNode {
  //  Furo annotated type wrapper message for `bytes`.
  private _key: STRING;

  //  Furo annotated type wrapper message for `bytes`.
  private _value: BOOLEAN;

  public __defaultValues: IBytesLabelsEntry;

  constructor(
    initData?: IBytesLabelsEntry,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'furo.fat.Bytes.LabelsEntry';

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
        FieldConstructor: BOOLEAN,
        constraints: {},
      },
    ];

    // Initialize the fields
    //  Furo annotated type wrapper message for `bytes`.
    this._key = new STRING(undefined, this, 'key');

    //  Furo annotated type wrapper message for `bytes`.
    this._value = new BOOLEAN(undefined, this, 'value');

    // Set required fields
    [].forEach(fieldName => {
      (this[fieldName as keyof BytesLabelsEntry] as FieldNode).__meta.required =
        true;
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
      (this[fieldName as keyof BytesLabelsEntry] as FieldNode).__readonly =
        true;
    });

    this.__meta.isPristine = true;
  }

  //  Furo annotated type wrapper message for `bytes`.
  public get key(): STRING {
    return this._key;
  }

  public set key(v: string) {
    this.__PrimitivesSetter(this._key, v);
  }

  //  Furo annotated type wrapper message for `bytes`.
  public get value(): BOOLEAN {
    return this._value;
  }

  public set value(v: boolean) {
    this.__PrimitivesSetter(this._value, v);
  }

  fromLiteral(data: IBytesLabelsEntry) {
    super.__fromLiteral(data);
  }

  toLiteral(): IBytesLabelsEntry {
    return super.__toLiteral();
  }
}

Registry.register('furo.fat.Bytes.LabelsEntry', BytesLabelsEntry);