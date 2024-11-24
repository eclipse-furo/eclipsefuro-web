// Code generated by furo protoc-gen-open-models. DO NOT EDIT.
// protoc-gen-open-models version: ????

import {
  ARRAY,
  FieldNode,
  Registry,
  STRING,
} from '@furo/open-models/dist/index';
import {
  INamedAny as IOpenapiV3NamedAny,
  NamedAny as OpenapiV3NamedAny,
  TNamedAny as TOpenapiV3NamedAny,
} from './NamedAny';

import {
  IOperation as IOpenapiV3Operation,
  Operation as OpenapiV3Operation,
  TOperation as TOpenapiV3Operation,
} from './Operation';

import {
  IParameterOrReference as IOpenapiV3ParameterOrReference,
  ParameterOrReference as OpenapiV3ParameterOrReference,
  TParameterOrReference as TOpenapiV3ParameterOrReference,
} from './ParameterOrReference';

import {
  IServer as IOpenapiV3Server,
  Server as OpenapiV3Server,
  TServer as TOpenapiV3Server,
} from './Server';

/**
 * @interface IPathItem
 *  Describes the operations available on a single path. A Path Item MAY be empty, due to ACL constraints. The path itself is still exposed to the documentation viewer but they will not know which operations and parameters are available.
 */
export interface IPathItem {
  Ref?: string;
  summary?: string;
  description?: string;
  get?: IOpenapiV3Operation;
  put?: IOpenapiV3Operation;
  post?: IOpenapiV3Operation;
  delete?: IOpenapiV3Operation;
  options?: IOpenapiV3Operation;
  head?: IOpenapiV3Operation;
  patch?: IOpenapiV3Operation;
  trace?: IOpenapiV3Operation;
  servers?: IOpenapiV3Server[];
  parameters?: IOpenapiV3ParameterOrReference[];
  specificationExtension?: IOpenapiV3NamedAny[];
}

/**
 * @interface TPathItem
 *  Describes the operations available on a single path. A Path Item MAY be empty, due to ACL constraints. The path itself is still exposed to the documentation viewer but they will not know which operations and parameters are available.
 */
export interface TPathItem {
  _ref?: string;
  summary?: string;
  description?: string;
  get?: TOpenapiV3Operation;
  put?: TOpenapiV3Operation;
  post?: TOpenapiV3Operation;
  delete?: TOpenapiV3Operation;
  options?: TOpenapiV3Operation;
  head?: TOpenapiV3Operation;
  patch?: TOpenapiV3Operation;
  trace?: TOpenapiV3Operation;
  servers?: TOpenapiV3Server[];
  parameters?: TOpenapiV3ParameterOrReference[];
  specification_extension?: TOpenapiV3NamedAny[];
}

/**
 * PathItem
 *  Describes the operations available on a single path. A Path Item MAY be empty, due to ACL constraints. The path itself is still exposed to the documentation viewer but they will not know which operations and parameters are available.
 */
export class PathItem extends FieldNode {
  private _Ref: STRING;

  private _summary: STRING;

  private _description: STRING;

  private _get: OpenapiV3Operation;

  private _put: OpenapiV3Operation;

  private _post: OpenapiV3Operation;

  private _delete: OpenapiV3Operation;

  private _options: OpenapiV3Operation;

  private _head: OpenapiV3Operation;

  private _patch: OpenapiV3Operation;

  private _trace: OpenapiV3Operation;

  private _servers: ARRAY<OpenapiV3Server, IOpenapiV3Server>;

  private _parameters: ARRAY<
    OpenapiV3ParameterOrReference,
    IOpenapiV3ParameterOrReference
  >;

  private _specificationExtension: ARRAY<OpenapiV3NamedAny, IOpenapiV3NamedAny>;

  public __defaultValues: IPathItem;

  constructor(
    initData?: IPathItem,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'openapi.v3.PathItem';

    this.__meta.nodeFields = [
      {
        fieldName: 'Ref',
        protoName: '_ref',
        FieldConstructor: STRING,
        constraints: {},
      },
      {
        fieldName: 'summary',
        protoName: 'summary',
        FieldConstructor: STRING,
        constraints: {},
      },
      {
        fieldName: 'description',
        protoName: 'description',
        FieldConstructor: STRING,
        constraints: {},
      },
      {
        fieldName: 'get',
        protoName: 'get',
        FieldConstructor: OpenapiV3Operation,
        constraints: {},
      },
      {
        fieldName: 'put',
        protoName: 'put',
        FieldConstructor: OpenapiV3Operation,
        constraints: {},
      },
      {
        fieldName: 'post',
        protoName: 'post',
        FieldConstructor: OpenapiV3Operation,
        constraints: {},
      },
      {
        fieldName: 'delete',
        protoName: 'delete',
        FieldConstructor: OpenapiV3Operation,
        constraints: {},
      },
      {
        fieldName: 'options',
        protoName: 'options',
        FieldConstructor: OpenapiV3Operation,
        constraints: {},
      },
      {
        fieldName: 'head',
        protoName: 'head',
        FieldConstructor: OpenapiV3Operation,
        constraints: {},
      },
      {
        fieldName: 'patch',
        protoName: 'patch',
        FieldConstructor: OpenapiV3Operation,
        constraints: {},
      },
      {
        fieldName: 'trace',
        protoName: 'trace',
        FieldConstructor: OpenapiV3Operation,
        constraints: {},
      },
      {
        fieldName: 'servers',
        protoName: 'servers',
        FieldConstructor: OpenapiV3Server,
        constraints: {},
      },
      {
        fieldName: 'parameters',
        protoName: 'parameters',
        FieldConstructor: OpenapiV3ParameterOrReference,
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
    this._Ref = new STRING(undefined, this, 'Ref');

    this._summary = new STRING(undefined, this, 'summary');

    this._description = new STRING(undefined, this, 'description');

    this._get = new OpenapiV3Operation(undefined, this, 'get');

    this._put = new OpenapiV3Operation(undefined, this, 'put');

    this._post = new OpenapiV3Operation(undefined, this, 'post');

    this._delete = new OpenapiV3Operation(undefined, this, 'delete');

    this._options = new OpenapiV3Operation(undefined, this, 'options');

    this._head = new OpenapiV3Operation(undefined, this, 'head');

    this._patch = new OpenapiV3Operation(undefined, this, 'patch');

    this._trace = new OpenapiV3Operation(undefined, this, 'trace');

    this._servers = new ARRAY<OpenapiV3Server, IOpenapiV3Server>(
      undefined,
      this,
      'servers',
    );

    this._parameters = new ARRAY<
      OpenapiV3ParameterOrReference,
      IOpenapiV3ParameterOrReference
    >(undefined, this, 'parameters');

    this._specificationExtension = new ARRAY<
      OpenapiV3NamedAny,
      IOpenapiV3NamedAny
    >(undefined, this, 'specificationExtension');

    // Set required fields
    [].forEach(fieldName => {
      (this[fieldName as keyof PathItem] as FieldNode).__meta.required = true;
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
      (this[fieldName as keyof PathItem] as FieldNode).__readonly = true;
    });

    this.__meta.isPristine = true;
  }

  public get Ref(): STRING {
    return this._Ref;
  }

  public set Ref(v: string) {
    this.__PrimitivesSetter(this._Ref, v);
  }

  public get summary(): STRING {
    return this._summary;
  }

  public set summary(v: string) {
    this.__PrimitivesSetter(this._summary, v);
  }

  public get description(): STRING {
    return this._description;
  }

  public set description(v: string) {
    this.__PrimitivesSetter(this._description, v);
  }

  public get get(): OpenapiV3Operation {
    return this._get;
  }

  public set get(v: IOpenapiV3Operation) {
    this.__TypeSetter(this._get, v);
  }

  public get put(): OpenapiV3Operation {
    return this._put;
  }

  public set put(v: IOpenapiV3Operation) {
    this.__TypeSetter(this._put, v);
  }

  public get post(): OpenapiV3Operation {
    return this._post;
  }

  public set post(v: IOpenapiV3Operation) {
    this.__TypeSetter(this._post, v);
  }

  public get delete(): OpenapiV3Operation {
    return this._delete;
  }

  public set delete(v: IOpenapiV3Operation) {
    this.__TypeSetter(this._delete, v);
  }

  public get options(): OpenapiV3Operation {
    return this._options;
  }

  public set options(v: IOpenapiV3Operation) {
    this.__TypeSetter(this._options, v);
  }

  public get head(): OpenapiV3Operation {
    return this._head;
  }

  public set head(v: IOpenapiV3Operation) {
    this.__TypeSetter(this._head, v);
  }

  public get patch(): OpenapiV3Operation {
    return this._patch;
  }

  public set patch(v: IOpenapiV3Operation) {
    this.__TypeSetter(this._patch, v);
  }

  public get trace(): OpenapiV3Operation {
    return this._trace;
  }

  public set trace(v: IOpenapiV3Operation) {
    this.__TypeSetter(this._trace, v);
  }

  public get servers(): ARRAY<OpenapiV3Server, IOpenapiV3Server> {
    return this._servers;
  }

  public set servers(v: IOpenapiV3Server[]) {
    this.__TypeSetter(this._servers, v);
  }

  public get parameters(): ARRAY<
    OpenapiV3ParameterOrReference,
    IOpenapiV3ParameterOrReference
  > {
    return this._parameters;
  }

  public set parameters(v: IOpenapiV3ParameterOrReference[]) {
    this.__TypeSetter(this._parameters, v);
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

  fromLiteral(data: IPathItem) {
    super.__fromLiteral(data);
  }

  toLiteral(): IPathItem {
    return super.__toLiteral();
  }
}

Registry.register('openapi.v3.PathItem', PathItem);
