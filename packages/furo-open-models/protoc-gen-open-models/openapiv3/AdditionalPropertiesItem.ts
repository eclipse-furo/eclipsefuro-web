// Code generated by furo protoc-gen-open-models. DO NOT EDIT.
// protoc-gen-open-models version: ????

import { BOOLEAN, FieldNode, Registry } from '@furo/open-models/dist/index';
import {
  ISchemaOrReference as IOpenapiV3SchemaOrReference,
  SchemaOrReference as OpenapiV3SchemaOrReference,
  TSchemaOrReference as TOpenapiV3SchemaOrReference,
} from './SchemaOrReference';

/**
 * @interface IAdditionalPropertiesItem
 */
export interface IAdditionalPropertiesItem {
  schemaOrReference?: IOpenapiV3SchemaOrReference;
  boolean?: boolean;
}

/**
 * @interface TAdditionalPropertiesItem
 */
export interface TAdditionalPropertiesItem {
  schema_or_reference?: TOpenapiV3SchemaOrReference;
  boolean?: boolean;
}

/**
 * AdditionalPropertiesItem
 */
export class AdditionalPropertiesItem extends FieldNode {
  private _schemaOrReference: OpenapiV3SchemaOrReference;

  private _boolean: BOOLEAN;

  public __defaultValues: IAdditionalPropertiesItem;

  constructor(
    initData?: IAdditionalPropertiesItem,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'openapi.v3.AdditionalPropertiesItem';

    this.__meta.nodeFields = [
      {
        fieldName: 'schemaOrReference',
        protoName: 'schema_or_reference',
        FieldConstructor: OpenapiV3SchemaOrReference,
        constraints: {},
      },
      {
        fieldName: 'boolean',
        protoName: 'boolean',
        FieldConstructor: BOOLEAN,
        constraints: {},
      },
    ];

    // Initialize the fields
    this._schemaOrReference = new OpenapiV3SchemaOrReference(
      undefined,
      this,
      'schemaOrReference',
    );

    this._boolean = new BOOLEAN(undefined, this, 'boolean');

    // Set required fields
    [].forEach(fieldName => {
      (
        this[fieldName as keyof AdditionalPropertiesItem] as FieldNode
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
        this[fieldName as keyof AdditionalPropertiesItem] as FieldNode
      ).__readonly = true;
    });

    this.__meta.isPristine = true;
  }

  public get schemaOrReference(): OpenapiV3SchemaOrReference {
    return this._schemaOrReference;
  }

  public set schemaOrReference(v: IOpenapiV3SchemaOrReference) {
    this.__TypeSetter(this._schemaOrReference, v);
  }

  public get boolean(): BOOLEAN {
    return this._boolean;
  }

  public set boolean(v: boolean) {
    this.__PrimitivesSetter(this._boolean, v);
  }

  fromLiteral(data: IAdditionalPropertiesItem) {
    super.__fromLiteral(data);
  }

  toLiteral(): IAdditionalPropertiesItem {
    return super.__toLiteral();
  }
}

Registry.register(
  'openapi.v3.AdditionalPropertiesItem',
  AdditionalPropertiesItem,
);