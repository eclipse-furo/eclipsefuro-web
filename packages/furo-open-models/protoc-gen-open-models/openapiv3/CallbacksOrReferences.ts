// Code generated by furo protoc-gen-open-models. DO NOT EDIT.
// protoc-gen-open-models version: ????

import { ARRAY, FieldNode, Registry } from '@furo/open-models/dist/index';
import {
  INamedCallbackOrReference as IOpenapiV3NamedCallbackOrReference,
  NamedCallbackOrReference as OpenapiV3NamedCallbackOrReference,
  TNamedCallbackOrReference as TOpenapiV3NamedCallbackOrReference,
} from './NamedCallbackOrReference';

/**
 * @interface ICallbacksOrReferences
 */
export interface ICallbacksOrReferences {
  additionalProperties?: IOpenapiV3NamedCallbackOrReference[];
}

/**
 * @interface TCallbacksOrReferences
 */
export interface TCallbacksOrReferences {
  additional_properties?: TOpenapiV3NamedCallbackOrReference[];
}

/**
 * CallbacksOrReferences
 */
export class CallbacksOrReferences extends FieldNode {
  private _additionalProperties: ARRAY<
    OpenapiV3NamedCallbackOrReference,
    IOpenapiV3NamedCallbackOrReference
  >;

  public __defaultValues: ICallbacksOrReferences;

  constructor(
    initData?: ICallbacksOrReferences,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'openapi.v3.CallbacksOrReferences';

    this.__meta.nodeFields = [
      {
        fieldName: 'additionalProperties',
        protoName: 'additional_properties',
        FieldConstructor: OpenapiV3NamedCallbackOrReference,
        constraints: {},
      },
    ];

    // Initialize the fields
    this._additionalProperties = new ARRAY<
      OpenapiV3NamedCallbackOrReference,
      IOpenapiV3NamedCallbackOrReference
    >(undefined, this, 'additionalProperties');

    // Set required fields
    [].forEach(fieldName => {
      (
        this[fieldName as keyof CallbacksOrReferences] as FieldNode
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
      (this[fieldName as keyof CallbacksOrReferences] as FieldNode).__readonly =
        true;
    });

    this.__meta.isPristine = true;
  }

  public get additionalProperties(): ARRAY<
    OpenapiV3NamedCallbackOrReference,
    IOpenapiV3NamedCallbackOrReference
  > {
    return this._additionalProperties;
  }

  public set additionalProperties(v: IOpenapiV3NamedCallbackOrReference[]) {
    this.__TypeSetter(this._additionalProperties, v);
  }

  fromLiteral(data: ICallbacksOrReferences) {
    super.__fromLiteral(data);
  }

  toLiteral(): ICallbacksOrReferences {
    return super.__toLiteral();
  }
}

Registry.register('openapi.v3.CallbacksOrReferences', CallbacksOrReferences);