// Code generated by furo protoc-gen-open-models. DO NOT EDIT.
// protoc-gen-open-models version: ????

import { ARRAY, FieldNode, Registry } from '@furo/open-models/dist/index';
import {
  INamedEncoding as IOpenapiV3NamedEncoding,
  NamedEncoding as OpenapiV3NamedEncoding,
  TNamedEncoding as TOpenapiV3NamedEncoding,
} from './NamedEncoding';

/**
 * @interface IEncodings
 */
export interface IEncodings {
  additionalProperties?: IOpenapiV3NamedEncoding[];
}

/**
 * @interface TEncodings
 */
export interface TEncodings {
  additional_properties?: TOpenapiV3NamedEncoding[];
}

/**
 * Encodings
 */
export class Encodings extends FieldNode {
  private _additionalProperties: ARRAY<
    OpenapiV3NamedEncoding,
    IOpenapiV3NamedEncoding
  >;

  public __defaultValues: IEncodings;

  constructor(
    initData?: IEncodings,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'openapi.v3.Encodings';

    this.__meta.nodeFields = [
      {
        fieldName: 'additionalProperties',
        protoName: 'additional_properties',
        FieldConstructor: OpenapiV3NamedEncoding,
        constraints: {},
      },
    ];

    // Initialize the fields
    this._additionalProperties = new ARRAY<
      OpenapiV3NamedEncoding,
      IOpenapiV3NamedEncoding
    >(undefined, this, 'additionalProperties');

    // Set required fields
    [].forEach(fieldName => {
      (this[fieldName as keyof Encodings] as FieldNode).__meta.required = true;
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
      (this[fieldName as keyof Encodings] as FieldNode).__readonly = true;
    });

    this.__meta.isPristine = true;
  }

  public get additionalProperties(): ARRAY<
    OpenapiV3NamedEncoding,
    IOpenapiV3NamedEncoding
  > {
    return this._additionalProperties;
  }

  public set additionalProperties(v: IOpenapiV3NamedEncoding[]) {
    this.__TypeSetter(this._additionalProperties, v);
  }

  fromLiteral(data: IEncodings) {
    super.__fromLiteral(data);
  }

  toLiteral(): IEncodings {
    return super.__toLiteral();
  }
}

Registry.register('openapi.v3.Encodings', Encodings);
