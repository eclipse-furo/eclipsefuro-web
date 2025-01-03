// Code generated by furo protoc-gen-open-models. DO NOT EDIT.
// protoc-gen-open-models version: ????

import { FieldNode, Registry } from '@furo/open-models/dist/index';
import {
  IParameter as IOpenapiV3Parameter,
  Parameter as OpenapiV3Parameter,
  TParameter as TOpenapiV3Parameter,
} from './Parameter';

import {
  IReference as IOpenapiV3Reference,
  Reference as OpenapiV3Reference,
  TReference as TOpenapiV3Reference,
} from './Reference';

/**
 * @interface IParameterOrReference
 */
export interface IParameterOrReference {
  parameter?: IOpenapiV3Parameter;
  reference?: IOpenapiV3Reference;
}

/**
 * @interface TParameterOrReference
 */
export interface TParameterOrReference {
  parameter?: TOpenapiV3Parameter;
  reference?: TOpenapiV3Reference;
}

/**
 * ParameterOrReference
 */
export class ParameterOrReference extends FieldNode {
  private _parameter: OpenapiV3Parameter;

  private _reference: OpenapiV3Reference;

  public __defaultValues: IParameterOrReference;

  constructor(
    initData?: IParameterOrReference,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'openapi.v3.ParameterOrReference';

    this.__meta.nodeFields = [
      {
        fieldName: 'parameter',
        protoName: 'parameter',
        FieldConstructor: OpenapiV3Parameter,
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
    this._parameter = new OpenapiV3Parameter(undefined, this, 'parameter');

    this._reference = new OpenapiV3Reference(undefined, this, 'reference');

    // Set required fields
    [].forEach(fieldName => {
      (
        this[fieldName as keyof ParameterOrReference] as FieldNode
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
      (this[fieldName as keyof ParameterOrReference] as FieldNode).__readonly =
        true;
    });

    this.__meta.isPristine = true;
  }

  public get parameter(): OpenapiV3Parameter {
    return this._parameter;
  }

  public set parameter(v: IOpenapiV3Parameter) {
    this.__TypeSetter(this._parameter, v);
  }

  public get reference(): OpenapiV3Reference {
    return this._reference;
  }

  public set reference(v: IOpenapiV3Reference) {
    this.__TypeSetter(this._reference, v);
  }

  fromLiteral(data: IParameterOrReference) {
    super.__fromLiteral(data);
  }

  toLiteral(): IParameterOrReference {
    return super.__toLiteral();
  }
}

Registry.register('openapi.v3.ParameterOrReference', ParameterOrReference);
