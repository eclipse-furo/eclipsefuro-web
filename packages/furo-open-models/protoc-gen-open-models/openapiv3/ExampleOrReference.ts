// Code generated by furo protoc-gen-open-models. DO NOT EDIT.
// protoc-gen-open-models version: ????

import { FieldNode, Registry } from '@furo/open-models/dist/index';
import {
  Example as OpenapiV3Example,
  IExample as IOpenapiV3Example,
  TExample as TOpenapiV3Example,
} from './Example';

import {
  IReference as IOpenapiV3Reference,
  Reference as OpenapiV3Reference,
  TReference as TOpenapiV3Reference,
} from './Reference';

/**
 * @interface IExampleOrReference
 */
export interface IExampleOrReference {
  example?: IOpenapiV3Example;
  reference?: IOpenapiV3Reference;
}

/**
 * @interface TExampleOrReference
 */
export interface TExampleOrReference {
  example?: TOpenapiV3Example;
  reference?: TOpenapiV3Reference;
}

/**
 * ExampleOrReference
 */
export class ExampleOrReference extends FieldNode {
  private _example: OpenapiV3Example;

  private _reference: OpenapiV3Reference;

  public __defaultValues: IExampleOrReference;

  constructor(
    initData?: IExampleOrReference,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'openapi.v3.ExampleOrReference';

    this.__meta.nodeFields = [
      {
        fieldName: 'example',
        protoName: 'example',
        FieldConstructor: OpenapiV3Example,
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
    this._example = new OpenapiV3Example(undefined, this, 'example');

    this._reference = new OpenapiV3Reference(undefined, this, 'reference');

    // Set required fields
    [].forEach(fieldName => {
      (
        this[fieldName as keyof ExampleOrReference] as FieldNode
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
      (this[fieldName as keyof ExampleOrReference] as FieldNode).__readonly =
        true;
    });

    this.__meta.isPristine = true;
  }

  public get example(): OpenapiV3Example {
    return this._example;
  }

  public set example(v: IOpenapiV3Example) {
    this.__TypeSetter(this._example, v);
  }

  public get reference(): OpenapiV3Reference {
    return this._reference;
  }

  public set reference(v: IOpenapiV3Reference) {
    this.__TypeSetter(this._reference, v);
  }

  fromLiteral(data: IExampleOrReference) {
    super.__fromLiteral(data);
  }

  toLiteral(): IExampleOrReference {
    return super.__toLiteral();
  }
}

Registry.register('openapi.v3.ExampleOrReference', ExampleOrReference);
