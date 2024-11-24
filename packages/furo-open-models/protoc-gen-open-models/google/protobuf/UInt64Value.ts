// Code generated by furo protoc-gen-open-models. DO NOT EDIT.
// protoc-gen-open-models version: ????

import { FieldNode, Registry, UINT64 } from '@furo/open-models/dist/index';

/**
 * @interface IUInt64Value
 *  Wrapper message for `uint64`.
 *
 *  The JSON representation for `UInt64Value` is JSON string.
 */
export interface IUInt64Value {
  /**
   *  The uint64 value.
   */
  value?: number;
}

/**
 * @interface TUInt64Value
 *  Wrapper message for `uint64`.
 *
 *  The JSON representation for `UInt64Value` is JSON string.
 */
export interface TUInt64Value {
  /**
   *  The uint64 value.
   */
  value?: number;
}

/**
 * UInt64Value
 *  Wrapper message for `uint64`.
 *
 *  The JSON representation for `UInt64Value` is JSON string.
 */
export class UInt64Value extends FieldNode {
  //  The uint64 value.
  private _value: UINT64;

  public __defaultValues: IUInt64Value;

  constructor(
    initData?: IUInt64Value,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'google.protobuf.UInt64Value';

    this.__meta.nodeFields = [
      {
        fieldName: 'value',
        protoName: 'value',
        FieldConstructor: UINT64,
        constraints: {},
      },
    ];

    // Initialize the fields
    //  The uint64 value.
    this._value = new UINT64(undefined, this, 'value');

    // Set required fields
    [].forEach(fieldName => {
      (this[fieldName as keyof UInt64Value] as FieldNode).__meta.required =
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
      (this[fieldName as keyof UInt64Value] as FieldNode).__readonly = true;
    });

    this.__meta.isPristine = true;
  }

  //  The uint64 value.
  public get value(): UINT64 {
    return this._value;
  }

  public set value(v: number) {
    this.__PrimitivesSetter(this._value, v);
  }

  fromLiteral(data: IUInt64Value) {
    super.__fromLiteral(data);
  }

  toLiteral(): IUInt64Value {
    return super.__toLiteral();
  }
}

Registry.register('google.protobuf.UInt64Value', UInt64Value);
