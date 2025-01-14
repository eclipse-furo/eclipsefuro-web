// Code generated by furo protoc-gen-open-models. DO NOT EDIT.
// protoc-gen-open-models version: ????

import {
  ARRAY,
  FieldNode,
  Registry,
  STRING,
} from '@furo/open-models/dist/index';
import {
  HeadersOrReferences as OpenapiV3HeadersOrReferences,
  IHeadersOrReferences as IOpenapiV3HeadersOrReferences,
  THeadersOrReferences as TOpenapiV3HeadersOrReferences,
} from './HeadersOrReferences';

import {
  ILinksOrReferences as IOpenapiV3LinksOrReferences,
  LinksOrReferences as OpenapiV3LinksOrReferences,
  TLinksOrReferences as TOpenapiV3LinksOrReferences,
} from './LinksOrReferences';

import {
  IMediaTypes as IOpenapiV3MediaTypes,
  MediaTypes as OpenapiV3MediaTypes,
  TMediaTypes as TOpenapiV3MediaTypes,
} from './MediaTypes';

import {
  INamedAny as IOpenapiV3NamedAny,
  NamedAny as OpenapiV3NamedAny,
  TNamedAny as TOpenapiV3NamedAny,
} from './NamedAny';

/**
 * @interface IResponse
 *  Describes a single response from an API Operation, including design-time, static  `links` to operations based on the response.
 */
export interface IResponse {
  description?: string;
  headers?: IOpenapiV3HeadersOrReferences;
  content?: IOpenapiV3MediaTypes;
  links?: IOpenapiV3LinksOrReferences;
  specificationExtension?: IOpenapiV3NamedAny[];
}

/**
 * @interface TResponse
 *  Describes a single response from an API Operation, including design-time, static  `links` to operations based on the response.
 */
export interface TResponse {
  description?: string;
  headers?: TOpenapiV3HeadersOrReferences;
  content?: TOpenapiV3MediaTypes;
  links?: TOpenapiV3LinksOrReferences;
  specification_extension?: TOpenapiV3NamedAny[];
}

/**
 * Response
 *  Describes a single response from an API Operation, including design-time, static  `links` to operations based on the response.
 */
export class Response extends FieldNode {
  private _description: STRING;

  private _headers: OpenapiV3HeadersOrReferences;

  private _content: OpenapiV3MediaTypes;

  private _links: OpenapiV3LinksOrReferences;

  private _specificationExtension: ARRAY<OpenapiV3NamedAny, IOpenapiV3NamedAny>;

  public __defaultValues: IResponse;

  constructor(
    initData?: IResponse,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'openapi.v3.Response';

    this.__meta.nodeFields = [
      {
        fieldName: 'description',
        protoName: 'description',
        FieldConstructor: STRING,
        constraints: {},
      },
      {
        fieldName: 'headers',
        protoName: 'headers',
        FieldConstructor: OpenapiV3HeadersOrReferences,
        constraints: {},
      },
      {
        fieldName: 'content',
        protoName: 'content',
        FieldConstructor: OpenapiV3MediaTypes,
        constraints: {},
      },
      {
        fieldName: 'links',
        protoName: 'links',
        FieldConstructor: OpenapiV3LinksOrReferences,
        constraints: {},
      },
      {
        fieldName: 'specificationExtension',
        protoName: 'specification_extension',
        FieldConstructor: OpenapiV3NamedAny,
        constraints: {},
      },
    ];

    // Initialize the fields
    this._description = new STRING(undefined, this, 'description');

    this._headers = new OpenapiV3HeadersOrReferences(
      undefined,
      this,
      'headers',
    );

    this._content = new OpenapiV3MediaTypes(undefined, this, 'content');

    this._links = new OpenapiV3LinksOrReferences(undefined, this, 'links');

    this._specificationExtension = new ARRAY<
      OpenapiV3NamedAny,
      IOpenapiV3NamedAny
    >(undefined, this, 'specificationExtension');

    // Set required fields
    [].forEach(fieldName => {
      (this[fieldName as keyof Response] as FieldNode).__meta.required = true;
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
      (this[fieldName as keyof Response] as FieldNode).__readonly = true;
    });

    this.__meta.isPristine = true;
  }

  public get description(): STRING {
    return this._description;
  }

  public set description(v: string) {
    this.__PrimitivesSetter(this._description, v);
  }

  public get headers(): OpenapiV3HeadersOrReferences {
    return this._headers;
  }

  public set headers(v: IOpenapiV3HeadersOrReferences) {
    this.__TypeSetter(this._headers, v);
  }

  public get content(): OpenapiV3MediaTypes {
    return this._content;
  }

  public set content(v: IOpenapiV3MediaTypes) {
    this.__TypeSetter(this._content, v);
  }

  public get links(): OpenapiV3LinksOrReferences {
    return this._links;
  }

  public set links(v: IOpenapiV3LinksOrReferences) {
    this.__TypeSetter(this._links, v);
  }

  public get specificationExtension(): ARRAY<
    OpenapiV3NamedAny,
    IOpenapiV3NamedAny
  > {
    return this._specificationExtension;
  }

  public set specificationExtension(v: IOpenapiV3NamedAny[]) {
    this.__TypeSetter(this._specificationExtension, v);
  }

  fromLiteral(data: IResponse) {
    super.__fromLiteral(data);
  }

  toLiteral(): IResponse {
    return super.__toLiteral();
  }
}

Registry.register('openapi.v3.Response', Response);
