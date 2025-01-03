// Code generated by furo protoc-gen-open-models. DO NOT EDIT.
// protoc-gen-open-models version: ????

import { FieldNode, Registry } from '@furo/open-models/dist/index';
import {
  Callback as OpenapiV3Callback,
  ICallback as IOpenapiV3Callback,
  TCallback as TOpenapiV3Callback,
} from './Callback';

import {
  IReference as IOpenapiV3Reference,
  Reference as OpenapiV3Reference,
  TReference as TOpenapiV3Reference,
} from './Reference';

/**
 * @interface ICallbackOrReference
 */
export interface ICallbackOrReference {
  callback?: IOpenapiV3Callback;
  reference?: IOpenapiV3Reference;
}

/**
 * @interface TCallbackOrReference
 */
export interface TCallbackOrReference {
  callback?: TOpenapiV3Callback;
  reference?: TOpenapiV3Reference;
}

/**
 * CallbackOrReference
 */
export class CallbackOrReference extends FieldNode {
  private _callback: OpenapiV3Callback;

  private _reference: OpenapiV3Reference;

  public __defaultValues: ICallbackOrReference;

  constructor(
    initData?: ICallbackOrReference,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'openapi.v3.CallbackOrReference';

    this.__meta.nodeFields = [
      {
        fieldName: 'callback',
        protoName: 'callback',
        FieldConstructor: OpenapiV3Callback,
        constraints: {},
      },
      {
        fieldName: 'reference',
        protoName: 'reference',
        FieldConstructor: OpenapiV3Reference,
        constraints: {},
      },
    ];

    // Initialize the fields
    this._callback = new OpenapiV3Callback(undefined, this, 'callback');

    this._reference = new OpenapiV3Reference(undefined, this, 'reference');

    // Set required fields
    [].forEach(fieldName => {
      (
        this[fieldName as keyof CallbackOrReference] as FieldNode
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
      (this[fieldName as keyof CallbackOrReference] as FieldNode).__readonly =
        true;
    });

    this.__meta.isPristine = true;
  }

  public get callback(): OpenapiV3Callback {
    return this._callback;
  }

  public set callback(v: IOpenapiV3Callback) {
    this.__TypeSetter(this._callback, v);
  }

  public get reference(): OpenapiV3Reference {
    return this._reference;
  }

  public set reference(v: IOpenapiV3Reference) {
    this.__TypeSetter(this._reference, v);
  }

  fromLiteral(data: ICallbackOrReference) {
    super.__fromLiteral(data);
  }

  toLiteral(): ICallbackOrReference {
    return super.__toLiteral();
  }
}

Registry.register('openapi.v3.CallbackOrReference', CallbackOrReference);
