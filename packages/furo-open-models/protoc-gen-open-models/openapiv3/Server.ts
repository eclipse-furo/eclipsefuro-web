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
  IServerVariables as IOpenapiV3ServerVariables,
  ServerVariables as OpenapiV3ServerVariables,
  TServerVariables as TOpenapiV3ServerVariables,
} from './ServerVariables';

/**
 * @interface IServer
 *  An object representing a Server.
 */
export interface IServer {
  url?: string;
  description?: string;
  variables?: IOpenapiV3ServerVariables;
  specificationExtension?: IOpenapiV3NamedAny[];
}

/**
 * @interface TServer
 *  An object representing a Server.
 */
export interface TServer {
  url?: string;
  description?: string;
  variables?: TOpenapiV3ServerVariables;
  specification_extension?: TOpenapiV3NamedAny[];
}

/**
 * Server
 *  An object representing a Server.
 */
export class Server extends FieldNode {
  private _url: STRING;

  private _description: STRING;

  private _variables: OpenapiV3ServerVariables;

  private _specificationExtension: ARRAY<OpenapiV3NamedAny, IOpenapiV3NamedAny>;

  public __defaultValues: IServer;

  constructor(
    initData?: IServer,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'openapi.v3.Server';

    this.__meta.nodeFields = [
      {
        fieldName: 'url',
        protoName: 'url',
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
        fieldName: 'variables',
        protoName: 'variables',
        FieldConstructor: OpenapiV3ServerVariables,
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
    this._url = new STRING(undefined, this, 'url');

    this._description = new STRING(undefined, this, 'description');

    this._variables = new OpenapiV3ServerVariables(
      undefined,
      this,
      'variables',
    );

    this._specificationExtension = new ARRAY<
      OpenapiV3NamedAny,
      IOpenapiV3NamedAny
    >(undefined, this, 'specificationExtension');

    // Set required fields
    [].forEach(fieldName => {
      (this[fieldName as keyof Server] as FieldNode).__meta.required = true;
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
      (this[fieldName as keyof Server] as FieldNode).__readonly = true;
    });

    this.__meta.isPristine = true;
  }

  public get url(): STRING {
    return this._url;
  }

  public set url(v: string) {
    this.__PrimitivesSetter(this._url, v);
  }

  public get description(): STRING {
    return this._description;
  }

  public set description(v: string) {
    this.__PrimitivesSetter(this._description, v);
  }

  public get variables(): OpenapiV3ServerVariables {
    return this._variables;
  }

  public set variables(v: IOpenapiV3ServerVariables) {
    this.__TypeSetter(this._variables, v);
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

  fromLiteral(data: IServer) {
    super.__fromLiteral(data);
  }

  toLiteral(): IServer {
    return super.__toLiteral();
  }
}

Registry.register('openapi.v3.Server', Server);
