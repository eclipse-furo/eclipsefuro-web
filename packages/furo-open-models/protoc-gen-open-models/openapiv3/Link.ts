// Code generated by furo protoc-gen-open-models. DO NOT EDIT.
// protoc-gen-open-models version: ????

import {
  ARRAY,
  FieldNode,
  Registry,
  STRING,
} from '@furo/open-models/dist/index';
import {
  AnyOrExpression as OpenapiV3AnyOrExpression,
  IAnyOrExpression as IOpenapiV3AnyOrExpression,
  TAnyOrExpression as TOpenapiV3AnyOrExpression,
} from './AnyOrExpression';

import {
  INamedAny as IOpenapiV3NamedAny,
  NamedAny as OpenapiV3NamedAny,
  TNamedAny as TOpenapiV3NamedAny,
} from './NamedAny';

import {
  IServer as IOpenapiV3Server,
  Server as OpenapiV3Server,
  TServer as TOpenapiV3Server,
} from './Server';

/**
 * @interface ILink
 *  The `Link object` represents a possible design-time link for a response. The presence of a link does not guarantee the caller's ability to successfully invoke it, rather it provides a known relationship and traversal mechanism between responses and other operations.  Unlike _dynamic_ links (i.e. links provided **in** the response payload), the OAS linking mechanism does not require link information in the runtime response.  For computing links, and providing instructions to execute them, a runtime expression is used for accessing values in an operation and using them as parameters while invoking the linked operation.
 */
export interface ILink {
  operationRef?: string;
  operationId?: string;
  parameters?: IOpenapiV3AnyOrExpression;
  requestBody?: IOpenapiV3AnyOrExpression;
  description?: string;
  server?: IOpenapiV3Server;
  specificationExtension?: IOpenapiV3NamedAny[];
}

/**
 * @interface TLink
 *  The `Link object` represents a possible design-time link for a response. The presence of a link does not guarantee the caller's ability to successfully invoke it, rather it provides a known relationship and traversal mechanism between responses and other operations.  Unlike _dynamic_ links (i.e. links provided **in** the response payload), the OAS linking mechanism does not require link information in the runtime response.  For computing links, and providing instructions to execute them, a runtime expression is used for accessing values in an operation and using them as parameters while invoking the linked operation.
 */
export interface TLink {
  operation_ref?: string;
  operation_id?: string;
  parameters?: TOpenapiV3AnyOrExpression;
  request_body?: TOpenapiV3AnyOrExpression;
  description?: string;
  server?: TOpenapiV3Server;
  specification_extension?: TOpenapiV3NamedAny[];
}

/**
 * Link
 *  The `Link object` represents a possible design-time link for a response. The presence of a link does not guarantee the caller's ability to successfully invoke it, rather it provides a known relationship and traversal mechanism between responses and other operations.  Unlike _dynamic_ links (i.e. links provided **in** the response payload), the OAS linking mechanism does not require link information in the runtime response.  For computing links, and providing instructions to execute them, a runtime expression is used for accessing values in an operation and using them as parameters while invoking the linked operation.
 */
export class Link extends FieldNode {
  private _operationRef: STRING;

  private _operationId: STRING;

  private _parameters: OpenapiV3AnyOrExpression;

  private _requestBody: OpenapiV3AnyOrExpression;

  private _description: STRING;

  private _server: OpenapiV3Server;

  private _specificationExtension: ARRAY<OpenapiV3NamedAny, IOpenapiV3NamedAny>;

  public __defaultValues: ILink;

  constructor(
    initData?: ILink,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'openapi.v3.Link';

    this.__meta.nodeFields = [
      {
        fieldName: 'operationRef',
        protoName: 'operation_ref',
        FieldConstructor: STRING,
        constraints: {},
      },
      {
        fieldName: 'operationId',
        protoName: 'operation_id',
        FieldConstructor: STRING,
        constraints: {},
      },
      {
        fieldName: 'parameters',
        protoName: 'parameters',
        FieldConstructor: OpenapiV3AnyOrExpression,
        constraints: {},
      },
      {
        fieldName: 'requestBody',
        protoName: 'request_body',
        FieldConstructor: OpenapiV3AnyOrExpression,
        constraints: {},
      },
      {
        fieldName: 'description',
        protoName: 'description',
        FieldConstructor: STRING,
        constraints: {},
      },
      {
        fieldName: 'server',
        protoName: 'server',
        FieldConstructor: OpenapiV3Server,
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
    this._operationRef = new STRING(undefined, this, 'operationRef');

    this._operationId = new STRING(undefined, this, 'operationId');

    this._parameters = new OpenapiV3AnyOrExpression(
      undefined,
      this,
      'parameters',
    );

    this._requestBody = new OpenapiV3AnyOrExpression(
      undefined,
      this,
      'requestBody',
    );

    this._description = new STRING(undefined, this, 'description');

    this._server = new OpenapiV3Server(undefined, this, 'server');

    this._specificationExtension = new ARRAY<
      OpenapiV3NamedAny,
      IOpenapiV3NamedAny
    >(undefined, this, 'specificationExtension');

    // Set required fields
    [].forEach(fieldName => {
      (this[fieldName as keyof Link] as FieldNode).__meta.required = true;
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
      (this[fieldName as keyof Link] as FieldNode).__readonly = true;
    });

    this.__meta.isPristine = true;
  }

  public get operationRef(): STRING {
    return this._operationRef;
  }

  public set operationRef(v: string) {
    this.__PrimitivesSetter(this._operationRef, v);
  }

  public get operationId(): STRING {
    return this._operationId;
  }

  public set operationId(v: string) {
    this.__PrimitivesSetter(this._operationId, v);
  }

  public get parameters(): OpenapiV3AnyOrExpression {
    return this._parameters;
  }

  public set parameters(v: IOpenapiV3AnyOrExpression) {
    this.__TypeSetter(this._parameters, v);
  }

  public get requestBody(): OpenapiV3AnyOrExpression {
    return this._requestBody;
  }

  public set requestBody(v: IOpenapiV3AnyOrExpression) {
    this.__TypeSetter(this._requestBody, v);
  }

  public get description(): STRING {
    return this._description;
  }

  public set description(v: string) {
    this.__PrimitivesSetter(this._description, v);
  }

  public get server(): OpenapiV3Server {
    return this._server;
  }

  public set server(v: IOpenapiV3Server) {
    this.__TypeSetter(this._server, v);
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

  fromLiteral(data: ILink) {
    super.__fromLiteral(data);
  }

  toLiteral(): ILink {
    return super.__toLiteral();
  }
}

Registry.register('openapi.v3.Link', Link);
