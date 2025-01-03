// Code generated by furo protoc-gen-open-models. DO NOT EDIT.
// protoc-gen-open-models version: ????

import { FieldNode, Registry, STRING } from '@furo/open-models/dist/index';
import {
  ISchemaOrReference as IOpenapiV3SchemaOrReference,
  SchemaOrReference as OpenapiV3SchemaOrReference,
  TSchemaOrReference as TOpenapiV3SchemaOrReference,
} from './SchemaOrReference';

/**
 * @interface INamedSchemaOrReference
 *  Automatically-generated message used to represent maps of SchemaOrReference as ordered (name,value) pairs.
 */
export interface INamedSchemaOrReference {
  /**
   *  Map key
   */
  name?: string;
  /**
   *  Mapped value
   */
  value?: IOpenapiV3SchemaOrReference;
}

/**
 * @interface TNamedSchemaOrReference
 *  Automatically-generated message used to represent maps of SchemaOrReference as ordered (name,value) pairs.
 */
export interface TNamedSchemaOrReference {
  /**
   *  Map key
   */
  name?: string;
  /**
   *  Mapped value
   */
  value?: TOpenapiV3SchemaOrReference;
}

/**
 * NamedSchemaOrReference
 *  Automatically-generated message used to represent maps of SchemaOrReference as ordered (name,value) pairs.
 */
export class NamedSchemaOrReference extends FieldNode {
  //  Map key
  private _name: STRING;

  //  Mapped value
  private _value: OpenapiV3SchemaOrReference;

  public __defaultValues: INamedSchemaOrReference;

  constructor(
    initData?: INamedSchemaOrReference,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'openapi.v3.NamedSchemaOrReference';

    this.__meta.nodeFields = [
      {
        fieldName: 'name',
        protoName: 'name',
        FieldConstructor: STRING,
        constraints: {},
      },
      {
        fieldName: 'value',
        protoName: 'value',
        FieldConstructor: OpenapiV3SchemaOrReference,
        constraints: {},
      },
    ];

    // Initialize the fields
    //  Map key
    this._name = new STRING(undefined, this, 'name');

    //  Mapped value
    this._value = new OpenapiV3SchemaOrReference(undefined, this, 'value');

    // Set required fields
    [].forEach(fieldName => {
      (
        this[fieldName as keyof NamedSchemaOrReference] as FieldNode
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
        this[fieldName as keyof NamedSchemaOrReference] as FieldNode
      ).__readonly = true;
    });

    this.__meta.isPristine = true;
  }

  //  Map key
  public get name(): STRING {
    return this._name;
  }

  public set name(v: string) {
    this.__PrimitivesSetter(this._name, v);
  }

  //  Mapped value
  public get value(): OpenapiV3SchemaOrReference {
    return this._value;
  }

  public set value(v: IOpenapiV3SchemaOrReference) {
    this.__TypeSetter(this._value, v);
  }

  fromLiteral(data: INamedSchemaOrReference) {
    super.__fromLiteral(data);
  }

  toLiteral(): INamedSchemaOrReference {
    return super.__toLiteral();
  }
}

Registry.register('openapi.v3.NamedSchemaOrReference', NamedSchemaOrReference);
