// Code generated by furo protoc-gen-open-models. DO NOT EDIT.
// protoc-gen-open-models version: ????

import { ARRAY, FieldNode, Registry } from '@furo/open-models/dist/index';
import {
  INamedLinkOrReference as IOpenapiV3NamedLinkOrReference,
  NamedLinkOrReference as OpenapiV3NamedLinkOrReference,
  TNamedLinkOrReference as TOpenapiV3NamedLinkOrReference,
} from './NamedLinkOrReference';

/**
 * @interface ILinksOrReferences
 */
export interface ILinksOrReferences {
  additionalProperties?: IOpenapiV3NamedLinkOrReference[];
}

/**
 * @interface TLinksOrReferences
 */
export interface TLinksOrReferences {
  additional_properties?: TOpenapiV3NamedLinkOrReference[];
}

/**
 * LinksOrReferences
 */
export class LinksOrReferences extends FieldNode {
  private _additionalProperties: ARRAY<
    OpenapiV3NamedLinkOrReference,
    IOpenapiV3NamedLinkOrReference
  >;

  public __defaultValues: ILinksOrReferences;

  constructor(
    initData?: ILinksOrReferences,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'openapi.v3.LinksOrReferences';

    this.__meta.nodeFields = [
      {
        fieldName: 'additionalProperties',
        protoName: 'additional_properties',
        FieldConstructor: OpenapiV3NamedLinkOrReference,
        constraints: {},
      },
    ];

    // Initialize the fields
    this._additionalProperties = new ARRAY<
      OpenapiV3NamedLinkOrReference,
      IOpenapiV3NamedLinkOrReference
    >(undefined, this, 'additionalProperties');

    // Set required fields
    [].forEach(fieldName => {
      (
        this[fieldName as keyof LinksOrReferences] as FieldNode
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
      (this[fieldName as keyof LinksOrReferences] as FieldNode).__readonly =
        true;
    });

    this.__meta.isPristine = true;
  }

  public get additionalProperties(): ARRAY<
    OpenapiV3NamedLinkOrReference,
    IOpenapiV3NamedLinkOrReference
  > {
    return this._additionalProperties;
  }

  public set additionalProperties(v: IOpenapiV3NamedLinkOrReference[]) {
    this.__TypeSetter(this._additionalProperties, v);
  }

  fromLiteral(data: ILinksOrReferences) {
    super.__fromLiteral(data);
  }

  toLiteral(): ILinksOrReferences {
    return super.__toLiteral();
  }
}

Registry.register('openapi.v3.LinksOrReferences', LinksOrReferences);
