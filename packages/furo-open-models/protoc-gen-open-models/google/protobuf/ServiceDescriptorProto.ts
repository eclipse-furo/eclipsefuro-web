// Code generated by furo protoc-gen-open-models. DO NOT EDIT.
// protoc-gen-open-models version: ????

import {
  ARRAY,
  FieldNode,
  Registry,
  STRING,
} from '@furo/open-models/dist/index';
import {
  IMethodDescriptorProto as IGoogleProtobufMethodDescriptorProto,
  MethodDescriptorProto as GoogleProtobufMethodDescriptorProto,
  TMethodDescriptorProto as TGoogleProtobufMethodDescriptorProto,
} from './MethodDescriptorProto';

import {
  IServiceOptions as IGoogleProtobufServiceOptions,
  ServiceOptions as GoogleProtobufServiceOptions,
  TServiceOptions as TGoogleProtobufServiceOptions,
} from './ServiceOptions';

/**
 * @interface IServiceDescriptorProto
 *  Describes a service.
 */
export interface IServiceDescriptorProto {
  name?: string;
  method?: IGoogleProtobufMethodDescriptorProto[];
  options?: IGoogleProtobufServiceOptions;
}

/**
 * @interface TServiceDescriptorProto
 *  Describes a service.
 */
export interface TServiceDescriptorProto {
  name?: string;
  method?: TGoogleProtobufMethodDescriptorProto[];
  options?: TGoogleProtobufServiceOptions;
}

/**
 * ServiceDescriptorProto
 *  Describes a service.
 */
export class ServiceDescriptorProto extends FieldNode {
  private _name: STRING;

  private _method: ARRAY<
    GoogleProtobufMethodDescriptorProto,
    IGoogleProtobufMethodDescriptorProto
  >;

  private _options: GoogleProtobufServiceOptions;

  public __defaultValues: IServiceDescriptorProto;

  constructor(
    initData?: IServiceDescriptorProto,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'google.protobuf.ServiceDescriptorProto';

    this.__meta.nodeFields = [
      {
        fieldName: 'name',
        protoName: 'name',
        FieldConstructor: STRING,
        constraints: {},
      },
      {
        fieldName: 'method',
        protoName: 'method',
        FieldConstructor: GoogleProtobufMethodDescriptorProto,
        constraints: {},
      },
      {
        fieldName: 'options',
        protoName: 'options',
        FieldConstructor: GoogleProtobufServiceOptions,
        constraints: {},
      },
    ];

    // Initialize the fields
    this._name = new STRING(undefined, this, 'name');

    this._method = new ARRAY<
      GoogleProtobufMethodDescriptorProto,
      IGoogleProtobufMethodDescriptorProto
    >(undefined, this, 'method');

    this._options = new GoogleProtobufServiceOptions(
      undefined,
      this,
      'options',
    );

    // Set required fields
    [].forEach(fieldName => {
      (
        this[fieldName as keyof ServiceDescriptorProto] as FieldNode
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
      (
        this[fieldName as keyof ServiceDescriptorProto] as FieldNode
      ).__readonly = true;
    });

    this.__meta.isPristine = true;
  }

  public get name(): STRING {
    return this._name;
  }

  public set name(v: string) {
    this.__PrimitivesSetter(this._name, v);
  }

  public get method(): ARRAY<
    GoogleProtobufMethodDescriptorProto,
    IGoogleProtobufMethodDescriptorProto
  > {
    return this._method;
  }

  public set method(v: IGoogleProtobufMethodDescriptorProto[]) {
    this.__TypeSetter(this._method, v);
  }

  public get options(): GoogleProtobufServiceOptions {
    return this._options;
  }

  public set options(v: IGoogleProtobufServiceOptions) {
    this.__TypeSetter(this._options, v);
  }

  fromLiteral(data: IServiceDescriptorProto) {
    super.__fromLiteral(data);
  }

  toLiteral(): IServiceDescriptorProto {
    return super.__toLiteral();
  }
}

Registry.register(
  'google.protobuf.ServiceDescriptorProto',
  ServiceDescriptorProto,
);
