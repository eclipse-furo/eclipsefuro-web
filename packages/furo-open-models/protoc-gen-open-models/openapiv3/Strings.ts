// Code generated by furo protoc-gen-open-models. DO NOT EDIT.
// protoc-gen-open-models version: ????

import { ARRAY, FieldNode, Registry } from '@furo/open-models/dist/index';
import {
  INamedString as IOpenapiV3NamedString,
  NamedString as OpenapiV3NamedString,
  TNamedString as TOpenapiV3NamedString,
} from './NamedString';

/**
 * @interface IStrings
 */
export interface IStrings {
  additionalProperties?: IOpenapiV3NamedString[];
}

/**
 * @interface TStrings
 */
export interface TStrings {
  additional_properties?: TOpenapiV3NamedString[];
}

/**
 * Strings
 */
export class Strings extends FieldNode {
  private _additionalProperties: ARRAY<
    OpenapiV3NamedString,
    IOpenapiV3NamedString
  >;

  public __defaultValues: IStrings;

  constructor(
    initData?: IStrings,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'openapi.v3.Strings';

    this.__meta.nodeFields = [
      {
        fieldName: 'additionalProperties',
        protoName: 'additional_properties',
        FieldConstructor: OpenapiV3NamedString,
        constraints: {},
      },
    ];

    // Initialize the fields
    this._additionalProperties = new ARRAY<
      OpenapiV3NamedString,
      IOpenapiV3NamedString
    >(undefined, this, 'additionalProperties');

    // Set required fields
    [].forEach(fieldName => {
      (this[fieldName as keyof Strings] as FieldNode).__meta.required = true;
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
      (this[fieldName as keyof Strings] as FieldNode).__readonly = true;
    });

    this.__meta.isPristine = true;
  }

  public get additionalProperties(): ARRAY<
    OpenapiV3NamedString,
    IOpenapiV3NamedString
  > {
    return this._additionalProperties;
  }

  public set additionalProperties(v: IOpenapiV3NamedString[]) {
    this.__TypeSetter(this._additionalProperties, v);
  }

  fromLiteral(data: IStrings) {
    super.__fromLiteral(data);
  }

  toLiteral(): IStrings {
    return super.__toLiteral();
  }
}

Registry.register('openapi.v3.Strings', Strings);
