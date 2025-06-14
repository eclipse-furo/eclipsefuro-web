// Code generated by furo protoc-gen-open-models. DO NOT EDIT.
// protoc-gen-open-models version: ????

import {
  BOOLEAN,
  FieldNode,
  MAP,
  Registry,
  STRING,
  UINT64,
} from '@furo/open-models/dist/index';

/**
 * @interface IUint64
 *  Furo annotated type wrapper message for `uint64`.  The range constraints are set to Number.MAX_SAFE_INTEGER because of browser limitations
 */
export interface IUint64 {
  /**
   *  The JSON representation for `Uint64Value` is JSON number, range is set to 0 - Number.MAX_SAFE_INTEGER
   */
  value?: string;
  /**
   *  Labels / flags for the value, something like unspecified, empty, confidential, absent,... Can be used for AI, UI, Business Logic,...
   */
  labels?: { [key: string]: boolean };
  /**
   *  Attributes for a value, something like confidential-msg: you are not allowed to see this value
   */
  attributes?: { [key: string]: string };
}

/**
 * @interface TUint64
 *  Furo annotated type wrapper message for `uint64`.  The range constraints are set to Number.MAX_SAFE_INTEGER because of browser limitations
 */
export interface TUint64 {
  /**
   *  The JSON representation for `Uint64Value` is JSON number, range is set to 0 - Number.MAX_SAFE_INTEGER
   */
  value?: string;
  /**
   *  Labels / flags for the value, something like unspecified, empty, confidential, absent,... Can be used for AI, UI, Business Logic,...
   */
  labels?: { [key: string]: boolean };
  /**
   *  Attributes for a value, something like confidential-msg: you are not allowed to see this value
   */
  attributes?: { [key: string]: string };
}

/**
 * Uint64
 *  Furo annotated type wrapper message for `uint64`.  The range constraints are set to Number.MAX_SAFE_INTEGER because of browser limitations
 */
export class Uint64 extends FieldNode {
  //  The JSON representation for `Uint64Value` is JSON number, range is set to 0 - Number.MAX_SAFE_INTEGER
  private _value: UINT64;

  //  Labels / flags for the value, something like unspecified, empty, confidential, absent,... Can be used for AI, UI, Business Logic,...
  private _labels: MAP<string, BOOLEAN, boolean>;

  //  Attributes for a value, something like confidential-msg: you are not allowed to see this value
  private _attributes: MAP<string, STRING, string>;

  public __defaultValues: IUint64;

  constructor(
    initData?: IUint64,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'furo.fat.Uint64';

    this.__meta.nodeFields = [
      {
        fieldName: 'value',
        protoName: 'value',
        FieldConstructor: UINT64,
        constraints: {},
      },
      {
        fieldName: 'labels',
        protoName: 'labels',
        FieldConstructor: MAP<string, BOOLEAN, boolean>,
        ValueConstructor: BOOLEAN,
        constraints: {},
      },
      {
        fieldName: 'attributes',
        protoName: 'attributes',
        FieldConstructor: MAP<string, STRING, string>,
        ValueConstructor: STRING,
        constraints: {},
      },
    ];

    // Initialize the fields
    //  The JSON representation for `Uint64Value` is JSON number, range is set to 0 - Number.MAX_SAFE_INTEGER
    this._value = new UINT64(undefined, this, 'value');

    //  Labels / flags for the value, something like unspecified, empty, confidential, absent,... Can be used for AI, UI, Business Logic,...
    this._labels = new MAP<string, BOOLEAN, boolean>(undefined, this, 'labels');

    //  Attributes for a value, something like confidential-msg: you are not allowed to see this value
    this._attributes = new MAP<string, STRING, string>(
      undefined,
      this,
      'attributes',
    );

    // Set required fields
    [].forEach(fieldName => {
      (this[fieldName as keyof Uint64] as FieldNode).__meta.required = true;
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
      (this[fieldName as keyof Uint64] as FieldNode).__readonly = true;
    });

    this.__meta.isPristine = true;
  }

  //  The JSON representation for `Uint64Value` is JSON number, range is set to 0 - Number.MAX_SAFE_INTEGER
  public get value(): UINT64 {
    return this._value;
  }

  public set value(v: bigint) {
    this.__PrimitivesSetter(this._value, v);
  }

  //  Labels / flags for the value, something like unspecified, empty, confidential, absent,... Can be used for AI, UI, Business Logic,...
  public get labels(): MAP<string, BOOLEAN, boolean> {
    return this._labels;
  }

  public set labels(v: { [key: string]: boolean }) {
    this.__TypeSetter(this._labels, v);
  }

  //  Attributes for a value, something like confidential-msg: you are not allowed to see this value
  public get attributes(): MAP<string, STRING, string> {
    return this._attributes;
  }

  public set attributes(v: { [key: string]: string }) {
    this.__TypeSetter(this._attributes, v);
  }

  fromLiteral(data: IUint64) {
    super.__fromLiteral(data);
  }

  toLiteral(): IUint64 {
    return super.__toLiteral();
  }
}

Registry.register('furo.fat.Uint64', Uint64);
