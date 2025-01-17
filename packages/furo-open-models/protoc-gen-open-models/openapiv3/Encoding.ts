// Code generated by furo protoc-gen-open-models. DO NOT EDIT.
// protoc-gen-open-models version: ????

import {
  ARRAY,
  BOOLEAN,
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
  INamedAny as IOpenapiV3NamedAny,
  NamedAny as OpenapiV3NamedAny,
  TNamedAny as TOpenapiV3NamedAny,
} from './NamedAny';

/**
 * @interface IEncoding
 *  A single encoding definition applied to a single schema property.
 */
export interface IEncoding {
  contentType?: string;
  headers?: IOpenapiV3HeadersOrReferences;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
  specificationExtension?: IOpenapiV3NamedAny[];
}

/**
 * @interface TEncoding
 *  A single encoding definition applied to a single schema property.
 */
export interface TEncoding {
  content_type?: string;
  headers?: TOpenapiV3HeadersOrReferences;
  style?: string;
  explode?: boolean;
  allow_reserved?: boolean;
  specification_extension?: TOpenapiV3NamedAny[];
}

/**
 * Encoding
 *  A single encoding definition applied to a single schema property.
 */
export class Encoding extends FieldNode {
  private _contentType: STRING;

  private _headers: OpenapiV3HeadersOrReferences;

  private _style: STRING;

  private _explode: BOOLEAN;

  private _allowReserved: BOOLEAN;

  private _specificationExtension: ARRAY<OpenapiV3NamedAny, IOpenapiV3NamedAny>;

  public __defaultValues: IEncoding;

  constructor(
    initData?: IEncoding,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'openapi.v3.Encoding';

    this.__meta.nodeFields = [
      {
        fieldName: 'contentType',
        protoName: 'content_type',
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
        fieldName: 'style',
        protoName: 'style',
        FieldConstructor: STRING,
        constraints: {},
      },
      {
        fieldName: 'explode',
        protoName: 'explode',
        FieldConstructor: BOOLEAN,
        constraints: {},
      },
      {
        fieldName: 'allowReserved',
        protoName: 'allow_reserved',
        FieldConstructor: BOOLEAN,
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
    this._contentType = new STRING(undefined, this, 'contentType');

    this._headers = new OpenapiV3HeadersOrReferences(
      undefined,
      this,
      'headers',
    );

    this._style = new STRING(undefined, this, 'style');

    this._explode = new BOOLEAN(undefined, this, 'explode');

    this._allowReserved = new BOOLEAN(undefined, this, 'allowReserved');

    this._specificationExtension = new ARRAY<
      OpenapiV3NamedAny,
      IOpenapiV3NamedAny
    >(undefined, this, 'specificationExtension');

    // Set required fields
    [].forEach(fieldName => {
      (this[fieldName as keyof Encoding] as FieldNode).__meta.required = true;
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
      (this[fieldName as keyof Encoding] as FieldNode).__readonly = true;
    });

    this.__meta.isPristine = true;
  }

  public get contentType(): STRING {
    return this._contentType;
  }

  public set contentType(v: string) {
    this.__PrimitivesSetter(this._contentType, v);
  }

  public get headers(): OpenapiV3HeadersOrReferences {
    return this._headers;
  }

  public set headers(v: IOpenapiV3HeadersOrReferences) {
    this.__TypeSetter(this._headers, v);
  }

  public get style(): STRING {
    return this._style;
  }

  public set style(v: string) {
    this.__PrimitivesSetter(this._style, v);
  }

  public get explode(): BOOLEAN {
    return this._explode;
  }

  public set explode(v: boolean) {
    this.__PrimitivesSetter(this._explode, v);
  }

  public get allowReserved(): BOOLEAN {
    return this._allowReserved;
  }

  public set allowReserved(v: boolean) {
    this.__PrimitivesSetter(this._allowReserved, v);
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

  fromLiteral(data: IEncoding) {
    super.__fromLiteral(data);
  }

  toLiteral(): IEncoding {
    return super.__toLiteral();
  }
}

Registry.register('openapi.v3.Encoding', Encoding);
