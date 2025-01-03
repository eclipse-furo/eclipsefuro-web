// Code generated by furo protoc-gen-open-models. DO NOT EDIT.
// protoc-gen-open-models version: ????

import {
  BOOLEAN,
  FieldNode,
  Registry,
  STRING,
} from '@furo/open-models/dist/index';

/**
 * @interface IBoolLabelsEntry
 */
export interface IBoolLabelsEntry {
  /**
   *  Furo annotated type wrapper message for `bool`.
   */
  key?: string;
  /**
   *  Furo annotated type wrapper message for `bool`.
   */
  value?: boolean;
}

/**
 * @interface TBoolLabelsEntry
 */
export interface TBoolLabelsEntry {
  /**
   *  Furo annotated type wrapper message for `bool`.
   */
  key?: string;
  /**
   *  Furo annotated type wrapper message for `bool`.
   */
  value?: boolean;
}

/**
 * BoolLabelsEntry
 */
export class BoolLabelsEntry extends FieldNode {
  //  Furo annotated type wrapper message for `bool`.
  private _key: STRING;

  //  Furo annotated type wrapper message for `bool`.
  private _value: BOOLEAN;

  public __defaultValues: IBoolLabelsEntry;

  constructor(
    initData?: IBoolLabelsEntry,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'furo.fat.Bool.LabelsEntry';

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
    //  Furo annotated type wrapper message for `bool`.
    this._key = new STRING(undefined, this, 'key');

    //  Furo annotated type wrapper message for `bool`.
    this._value = new BOOLEAN(undefined, this, 'value');

    // Set required fields
    [].forEach(fieldName => {
      (this[fieldName as keyof BoolLabelsEntry] as FieldNode).__meta.required =
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
      (this[fieldName as keyof BoolLabelsEntry] as FieldNode).__readonly = true;
    });

    this.__meta.isPristine = true;
  }

  //  Furo annotated type wrapper message for `bool`.
  public get key(): STRING {
    return this._key;
  }

  public set key(v: string) {
    this.__PrimitivesSetter(this._key, v);
  }

  //  Furo annotated type wrapper message for `bool`.
  public get value(): BOOLEAN {
    return this._value;
  }

  public set value(v: boolean) {
    this.__PrimitivesSetter(this._value, v);
  }

  fromLiteral(data: IBoolLabelsEntry) {
    super.__fromLiteral(data);
  }

  toLiteral(): IBoolLabelsEntry {
    return super.__toLiteral();
  }
}

Registry.register('furo.fat.Bool.LabelsEntry', BoolLabelsEntry);
