// Code generated by furo protoc-gen-open-models. DO NOT EDIT.
// protoc-gen-open-models version: ????

import {
  ARRAY,
  BOOLEAN,
  FieldNode,
  Registry,
} from '@furo/open-models/dist/index';
import {
  HttpRule as GoogleApiHttpRule,
  IHttpRule as IGoogleApiHttpRule,
  THttpRule as TGoogleApiHttpRule,
} from './HttpRule';

/**
 * @interface IHttp
 *  Defines the HTTP configuration for an API service. It contains a list of
 *  [HttpRule][google.api.HttpRule], each specifying the mapping of an RPC method
 *  to one or more HTTP REST API methods.
 */
export interface IHttp {
  /**
   *  A list of HTTP configuration rules that apply to individual API methods.
   *
   *  **NOTE:** All service configuration rules follow "last one wins" order.
   */
  rules?: IGoogleApiHttpRule[];
  /**
   *  When set to true, URL path parameters will be fully URI-decoded except in
   *  cases of single segment matches in reserved expansion, where "%2F" will be
   *  left encoded.
   *
   *  The default behavior is to not decode RFC 6570 reserved characters in multi
   *  segment matches.
   */
  fullyDecodeReservedExpansion?: boolean;
}

/**
 * @interface THttp
 *  Defines the HTTP configuration for an API service. It contains a list of
 *  [HttpRule][google.api.HttpRule], each specifying the mapping of an RPC method
 *  to one or more HTTP REST API methods.
 */
export interface THttp {
  /**
   *  A list of HTTP configuration rules that apply to individual API methods.
   *
   *  **NOTE:** All service configuration rules follow "last one wins" order.
   */
  rules?: TGoogleApiHttpRule[];
  /**
   *  When set to true, URL path parameters will be fully URI-decoded except in
   *  cases of single segment matches in reserved expansion, where "%2F" will be
   *  left encoded.
   *
   *  The default behavior is to not decode RFC 6570 reserved characters in multi
   *  segment matches.
   */
  fully_decode_reserved_expansion?: boolean;
}

/**
 * Http
 *  Defines the HTTP configuration for an API service. It contains a list of
 *  [HttpRule][google.api.HttpRule], each specifying the mapping of an RPC method
 *  to one or more HTTP REST API methods.
 */
export class Http extends FieldNode {
  //  A list of HTTP configuration rules that apply to individual API methods.
  //
  //  **NOTE:** All service configuration rules follow "last one wins" order.
  private _rules: ARRAY<GoogleApiHttpRule, IGoogleApiHttpRule>;

  //  When set to true, URL path parameters will be fully URI-decoded except in
  //  cases of single segment matches in reserved expansion, where "%2F" will be
  //  left encoded.
  //
  //  The default behavior is to not decode RFC 6570 reserved characters in multi
  //  segment matches.
  private _fullyDecodeReservedExpansion: BOOLEAN;

  public __defaultValues: IHttp;

  constructor(
    initData?: IHttp,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'google.api.Http';

    this.__meta.nodeFields = [
      {
        fieldName: 'rules',
        protoName: 'rules',
        FieldConstructor: GoogleApiHttpRule,
        constraints: {},
      },
      {
        fieldName: 'fullyDecodeReservedExpansion',
        protoName: 'fully_decode_reserved_expansion',
        FieldConstructor: BOOLEAN,
        constraints: {},
      },
    ];

    // Initialize the fields
    //  A list of HTTP configuration rules that apply to individual API methods.
    //
    //  **NOTE:** All service configuration rules follow "last one wins" order.
    this._rules = new ARRAY<GoogleApiHttpRule, IGoogleApiHttpRule>(
      undefined,
      this,
      'rules',
    );

    //  When set to true, URL path parameters will be fully URI-decoded except in
    //  cases of single segment matches in reserved expansion, where "%2F" will be
    //  left encoded.
    //
    //  The default behavior is to not decode RFC 6570 reserved characters in multi
    //  segment matches.
    this._fullyDecodeReservedExpansion = new BOOLEAN(
      undefined,
      this,
      'fullyDecodeReservedExpansion',
    );

    // Set required fields
    [].forEach(fieldName => {
      (this[fieldName as keyof Http] as FieldNode).__meta.required = true;
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
      (this[fieldName as keyof Http] as FieldNode).__readonly = true;
    });

    this.__meta.isPristine = true;
  }

  //  A list of HTTP configuration rules that apply to individual API methods.
  //
  //  **NOTE:** All service configuration rules follow "last one wins" order.
  public get rules(): ARRAY<GoogleApiHttpRule, IGoogleApiHttpRule> {
    return this._rules;
  }

  public set rules(v: IGoogleApiHttpRule[]) {
    this.__TypeSetter(this._rules, v);
  }

  //  When set to true, URL path parameters will be fully URI-decoded except in
  //  cases of single segment matches in reserved expansion, where "%2F" will be
  //  left encoded.
  //
  //  The default behavior is to not decode RFC 6570 reserved characters in multi
  //  segment matches.
  public get fullyDecodeReservedExpansion(): BOOLEAN {
    return this._fullyDecodeReservedExpansion;
  }

  public set fullyDecodeReservedExpansion(v: boolean) {
    this.__PrimitivesSetter(this._fullyDecodeReservedExpansion, v);
  }

  fromLiteral(data: IHttp) {
    super.__fromLiteral(data);
  }

  toLiteral(): IHttp {
    return super.__toLiteral();
  }
}

Registry.register('google.api.Http', Http);
