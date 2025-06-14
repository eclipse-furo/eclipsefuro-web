// Code generated by furo protoc-gen-open-models. DO NOT EDIT.
// protoc-gen-open-models version: ????

import {
  ARRAY,
  FieldNode,
  INT64,
  Registry,
} from '@furo/open-models/dist/index';

/**
 * @interface INumeric64
 *  Decimal numbers
 *   Regex pattern: ^[&#43;-]?(\d*\.)?\d&#43;$
 */
export interface INumeric64 {
  /**
   *  Value is set as a quoted number, use your numeric parser of choice
   */
  primitiveInt64?: string;
  repeatedPrimitiveInt64?: string[];
  primitiveInt64Excl?: string;
}

/**
 * @interface TNumeric64
 *  Decimal numbers
 *   Regex pattern: ^[&#43;-]?(\d*\.)?\d&#43;$
 */
export interface TNumeric64 {
  /**
   *  Value is set as a quoted number, use your numeric parser of choice
   */
  primitive_int64?: string;
  repeated_primitive_int64?: string[];
  primitive_int64_excl?: string;
}

/**
 * Numeric64
 *  Decimal numbers
 *   Regex pattern: ^[&#43;-]?(\d*\.)?\d&#43;$
 */
export class Numeric64 extends FieldNode {
  //  Value is set as a quoted number, use your numeric parser of choice
  private _primitiveInt64: INT64;

  private _repeatedPrimitiveInt64: ARRAY<INT64, bigint>;

  private _primitiveInt64Excl: INT64;

  public __defaultValues: INumeric64;

  constructor(
    initData?: INumeric64,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'furo.type.Numeric64';

    this.__meta.nodeFields = [
      {
        fieldName: 'primitiveInt64',
        protoName: 'primitive_int64',
        FieldConstructor: INT64,
        constraints: {
          maximum: 1000,
          minimum: 5,
          exclusive_maximum: true,
          exclusive_minimum: true,
          multiple_of: 5,
        },
      },
      {
        fieldName: 'repeatedPrimitiveInt64',
        protoName: 'repeated_primitive_int64',
        FieldConstructor: INT64,
        constraints: {},
      },
      {
        fieldName: 'primitiveInt64Excl',
        protoName: 'primitive_int64_excl',
        FieldConstructor: INT64,
        constraints: { maximum: 1000, minimum: 5, multiple_of: 5 },
      },
    ];

    // Initialize the fields
    //  Value is set as a quoted number, use your numeric parser of choice
    this._primitiveInt64 = new INT64(undefined, this, 'primitiveInt64');

    this._repeatedPrimitiveInt64 = new ARRAY<INT64, bigint>(
      undefined,
      this,
      'repeatedPrimitiveInt64',
    );

    this._primitiveInt64Excl = new INT64(undefined, this, 'primitiveInt64Excl');

    // Set required fields
    [].forEach(fieldName => {
      (this[fieldName as keyof Numeric64] as FieldNode).__meta.required = true;
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
      (this[fieldName as keyof Numeric64] as FieldNode).__readonly = true;
    });

    this.__meta.isPristine = true;
  }

  //  Value is set as a quoted number, use your numeric parser of choice
  public get primitiveInt64(): INT64 {
    return this._primitiveInt64;
  }

  public set primitiveInt64(v: bigint) {
    this.__PrimitivesSetter(this._primitiveInt64, v);
  }

  public get repeatedPrimitiveInt64(): ARRAY<INT64, bigint> {
    return this._repeatedPrimitiveInt64;
  }

  public set repeatedPrimitiveInt64(v: bigint[]) {
    this.__TypeSetter(this._repeatedPrimitiveInt64, v);
  }

  public get primitiveInt64Excl(): INT64 {
    return this._primitiveInt64Excl;
  }

  public set primitiveInt64Excl(v: bigint) {
    this.__PrimitivesSetter(this._primitiveInt64Excl, v);
  }

  fromLiteral(data: INumeric64) {
    super.__fromLiteral(data);
  }

  toLiteral(): INumeric64 {
    return super.__toLiteral();
  }
}

Registry.register('furo.type.Numeric64', Numeric64);
