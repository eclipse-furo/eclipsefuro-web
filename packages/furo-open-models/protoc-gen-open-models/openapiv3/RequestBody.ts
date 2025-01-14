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
 * @interface IRequestBody
 *  Describes a single request body.
 */
export interface IRequestBody {
  description?: string;
  content?: IOpenapiV3MediaTypes;
  required?: boolean;
  specificationExtension?: IOpenapiV3NamedAny[];
}

/**
 * @interface TRequestBody
 *  Describes a single request body.
 */
export interface TRequestBody {
  description?: string;
  content?: TOpenapiV3MediaTypes;
  required?: boolean;
  specification_extension?: TOpenapiV3NamedAny[];
}

/**
 * RequestBody
 *  Describes a single request body.
 */
export class RequestBody extends FieldNode {
  private _description: STRING;

  private _content: OpenapiV3MediaTypes;

  private _required: BOOLEAN;

  private _specificationExtension: ARRAY<OpenapiV3NamedAny, IOpenapiV3NamedAny>;

  public __defaultValues: IRequestBody;

  constructor(
    initData?: IRequestBody,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'openapi.v3.RequestBody';

    this.__meta.nodeFields = [
      {
        fieldName: 'description',
        protoName: 'description',
        FieldConstructor: STRING,
        constraints: {},
      },
      {
        fieldName: 'content',
        protoName: 'content',
        FieldConstructor: OpenapiV3MediaTypes,
        constraints: {},
      },
      {
        fieldName: 'required',
        protoName: 'required',
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
    this._description = new STRING(undefined, this, 'description');

    this._content = new OpenapiV3MediaTypes(undefined, this, 'content');

    this._required = new BOOLEAN(undefined, this, 'required');

    this._specificationExtension = new ARRAY<
      OpenapiV3NamedAny,
      IOpenapiV3NamedAny
    >(undefined, this, 'specificationExtension');

    // Set required fields
    [].forEach(fieldName => {
      (this[fieldName as keyof RequestBody] as FieldNode).__meta.required =
        true;
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
      (this[fieldName as keyof RequestBody] as FieldNode).__readonly = true;
    });

    this.__meta.isPristine = true;
  }

  public get description(): STRING {
    return this._description;
  }

  public set description(v: string) {
    this.__PrimitivesSetter(this._description, v);
  }

  public get content(): OpenapiV3MediaTypes {
    return this._content;
  }

  public set content(v: IOpenapiV3MediaTypes) {
    this.__TypeSetter(this._content, v);
  }

  public get required(): BOOLEAN {
    return this._required;
  }

  public set required(v: boolean) {
    this.__PrimitivesSetter(this._required, v);
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

  fromLiteral(data: IRequestBody) {
    super.__fromLiteral(data);
  }

  toLiteral(): IRequestBody {
    return super.__toLiteral();
  }
}

Registry.register('openapi.v3.RequestBody', RequestBody);
