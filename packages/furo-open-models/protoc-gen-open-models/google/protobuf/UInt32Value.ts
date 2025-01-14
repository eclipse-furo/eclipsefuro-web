// Code generated by furo protoc-gen-open-models. DO NOT EDIT.
// protoc-gen-open-models version: ????

import { FieldNode, Registry, UINT32 } from '@furo/open-models/dist/index';

/**
 * @interface IUInt32Value
 *  Wrapper message for `uint32`.
 *
 *  The JSON representation for `UInt32Value` is JSON number.
 */
export interface IUInt32Value {
  /**
   *  The uint32 value.
   */
  value?: number;
}

/**
 * @interface TUInt32Value
 *  Wrapper message for `uint32`.
 *
 *  The JSON representation for `UInt32Value` is JSON number.
 */
export interface TUInt32Value {
  /**
   *  The uint32 value.
   */
  value?: number;
}

/**
 * UInt32Value
 *  Wrapper message for `uint32`.
 *
 *  The JSON representation for `UInt32Value` is JSON number.
 */
export class UInt32Value extends FieldNode {
  //  The uint32 value.
  private _value: UINT32;

  public __defaultValues: IUInt32Value;

  constructor(
    initData?: IUInt32Value,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'google.protobuf.UInt32Value';

    this.__meta.nodeFields = [
      {
        fieldName: 'value',
        protoName: 'value',
        FieldConstructor: UINT32,
        constraints: {},
      },
    ];

    // Initialize the fields
    //  The uint32 value.
    this._value = new UINT32(undefined, this, 'value');

    // Set required fields
    [].forEach(fieldName => {
      (this[fieldName as keyof UInt32Value] as FieldNode).__meta.required =
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
      (this[fieldName as keyof UInt32Value] as FieldNode).__readonly = true;
    });

    this.__meta.isPristine = true;
  }

  //  The uint32 value.
  public get value(): UINT32 {
    return this._value;
  }

  public set value(v: number) {
    this.__PrimitivesSetter(this._value, v);
  }

  fromLiteral(data: IUInt32Value) {
    super.__fromLiteral(data);
  }

  toLiteral(): IUInt32Value {
    return super.__toLiteral();
  }
}

Registry.register('google.protobuf.UInt32Value', UInt32Value);
