// Code generated by furo protoc-gen-open-models. DO NOT EDIT.
// protoc-gen-open-models version: ????

import {
  BoolValue,
  BytesValue,
  DoubleValue,
  FieldNode,
  FloatValue,
  Int32Value,
  Int64Value,
  Registry,
  StringValue,
  UInt32Value,
  UInt64Value,
} from '@furo/open-models/dist/index';

/**
 * @interface IWrappers
 */
export interface IWrappers {
  stringValue?: string;
  int32Value?: number;
  int64Value?: number;
  floatValue?: number;
  doubleValue?: number;
  boolValue?: boolean;
  uint32Value?: number;
  uint64Value?: number;
  bytesValue?: string;
}

/**
 * @interface TWrappers
 */
export interface TWrappers {
  string_value?: string;
  int32_value?: number;
  int64_value?: number;
  float_value?: number;
  double_value?: number;
  bool_value?: boolean;
  uint32_value?: number;
  uint64_value?: number;
  bytes_value?: string;
}

/**
 * Wrappers
 */
export class Wrappers extends FieldNode {
  private _stringValue: StringValue;

  private _int32Value: Int32Value;

  private _int64Value: Int64Value;

  private _floatValue: FloatValue;

  private _doubleValue: DoubleValue;

  private _boolValue: BoolValue;

  private _uint32Value: UInt32Value;

  private _uint64Value: UInt64Value;

  private _bytesValue: BytesValue;

  public __defaultValues: IWrappers;

  constructor(
    initData?: IWrappers,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'furo.cube.Wrappers';

    this.__meta.nodeFields = [
      {
        fieldName: 'stringValue',
        protoName: 'string_value',
        FieldConstructor: StringValue,
        constraints: {},
      },
      {
        fieldName: 'int32Value',
        protoName: 'int32_value',
        FieldConstructor: Int32Value,
        constraints: {},
      },
      {
        fieldName: 'int64Value',
        protoName: 'int64_value',
        FieldConstructor: Int64Value,
        constraints: {},
      },
      {
        fieldName: 'floatValue',
        protoName: 'float_value',
        FieldConstructor: FloatValue,
        constraints: {},
      },
      {
        fieldName: 'doubleValue',
        protoName: 'double_value',
        FieldConstructor: DoubleValue,
        constraints: {},
      },
      {
        fieldName: 'boolValue',
        protoName: 'bool_value',
        FieldConstructor: BoolValue,
        constraints: {},
      },
      {
        fieldName: 'uint32Value',
        protoName: 'uint32_value',
        FieldConstructor: UInt32Value,
        constraints: {},
      },
      {
        fieldName: 'uint64Value',
        protoName: 'uint64_value',
        FieldConstructor: UInt64Value,
        constraints: {},
      },
      {
        fieldName: 'bytesValue',
        protoName: 'bytes_value',
        FieldConstructor: BytesValue,
        constraints: {},
      },
    ];

    // Initialize the fields
    this._stringValue = new StringValue(undefined, this, 'stringValue');

    this._int32Value = new Int32Value(undefined, this, 'int32Value');

    this._int64Value = new Int64Value(undefined, this, 'int64Value');

    this._floatValue = new FloatValue(undefined, this, 'floatValue');

    this._doubleValue = new DoubleValue(undefined, this, 'doubleValue');

    this._boolValue = new BoolValue(undefined, this, 'boolValue');

    this._uint32Value = new UInt32Value(undefined, this, 'uint32Value');

    this._uint64Value = new UInt64Value(undefined, this, 'uint64Value');

    this._bytesValue = new BytesValue(undefined, this, 'bytesValue');

    // Set required fields
    [].forEach(fieldName => {
      (this[fieldName as keyof Wrappers] as FieldNode).__meta.required = true;
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
      (this[fieldName as keyof Wrappers] as FieldNode).__readonly = true;
    });

    this.__meta.isPristine = true;
  }

  public get stringValue(): StringValue {
    return this._stringValue;
  }

  public set stringValue(v: string | null) {
    this.__TypeSetter(this._stringValue, v);
  }

  public get int32Value(): Int32Value {
    return this._int32Value;
  }

  public set int32Value(v: number | null) {
    this.__TypeSetter(this._int32Value, v);
  }

  public get int64Value(): Int64Value {
    return this._int64Value;
  }

  public set int64Value(v: number | null) {
    this.__TypeSetter(this._int64Value, v);
  }

  public get floatValue(): FloatValue {
    return this._floatValue;
  }

  public set floatValue(v: number | null) {
    this.__TypeSetter(this._floatValue, v);
  }

  public get doubleValue(): DoubleValue {
    return this._doubleValue;
  }

  public set doubleValue(v: number | null) {
    this.__TypeSetter(this._doubleValue, v);
  }

  public get boolValue(): BoolValue {
    return this._boolValue;
  }

  public set boolValue(v: boolean | null) {
    this.__TypeSetter(this._boolValue, v);
  }

  public get uint32Value(): UInt32Value {
    return this._uint32Value;
  }

  public set uint32Value(v: number | null) {
    this.__TypeSetter(this._uint32Value, v);
  }

  public get uint64Value(): UInt64Value {
    return this._uint64Value;
  }

  public set uint64Value(v: number | null) {
    this.__TypeSetter(this._uint64Value, v);
  }

  public get bytesValue(): BytesValue {
    return this._bytesValue;
  }

  public set bytesValue(v: string | null) {
    this.__TypeSetter(this._bytesValue, v);
  }

  fromLiteral(data: IWrappers) {
    super.__fromLiteral(data);
  }

  toLiteral(): IWrappers {
    return super.__toLiteral();
  }
}

Registry.register('furo.cube.Wrappers', Wrappers);
