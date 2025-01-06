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
  IXAny as IOpenapiV3Any,
  TXAny as TOpenapiV3Any,
  XAny as OpenapiV3Any,
} from './Any';

import {
  ExamplesOrReferences as OpenapiV3ExamplesOrReferences,
  IExamplesOrReferences as IOpenapiV3ExamplesOrReferences,
  TExamplesOrReferences as TOpenapiV3ExamplesOrReferences,
} from './ExamplesOrReferences';

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

import {
  ISchemaOrReference as IOpenapiV3SchemaOrReference,
  SchemaOrReference as OpenapiV3SchemaOrReference,
  TSchemaOrReference as TOpenapiV3SchemaOrReference,
} from './SchemaOrReference';

/**
 * @interface IHeader
 *  The Header Object follows the structure of the Parameter Object with the following changes:  1. `name` MUST NOT be specified, it is given in the corresponding `headers` map. 1. `in` MUST NOT be specified, it is implicitly in `header`. 1. All traits that are affected by the location MUST be applicable to a location of `header` (for example, `style`).
 */
export interface IHeader {
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
  schema?: IOpenapiV3SchemaOrReference;
  example?: IOpenapiV3Any;
  examples?: IOpenapiV3ExamplesOrReferences;
  content?: IOpenapiV3MediaTypes;
  specificationExtension?: IOpenapiV3NamedAny[];
}

/**
 * @interface THeader
 *  The Header Object follows the structure of the Parameter Object with the following changes:  1. `name` MUST NOT be specified, it is given in the corresponding `headers` map. 1. `in` MUST NOT be specified, it is implicitly in `header`. 1. All traits that are affected by the location MUST be applicable to a location of `header` (for example, `style`).
 */
export interface THeader {
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  allow_empty_value?: boolean;
  style?: string;
  explode?: boolean;
  allow_reserved?: boolean;
  schema?: TOpenapiV3SchemaOrReference;
  example?: TOpenapiV3Any;
  examples?: TOpenapiV3ExamplesOrReferences;
  content?: TOpenapiV3MediaTypes;
  specification_extension?: TOpenapiV3NamedAny[];
}

/**
 * Header
 *  The Header Object follows the structure of the Parameter Object with the following changes:  1. `name` MUST NOT be specified, it is given in the corresponding `headers` map. 1. `in` MUST NOT be specified, it is implicitly in `header`. 1. All traits that are affected by the location MUST be applicable to a location of `header` (for example, `style`).
 */
export class Header extends FieldNode {
  private _description: STRING;

  private _required: BOOLEAN;

  private _deprecated: BOOLEAN;

  private _allowEmptyValue: BOOLEAN;

  private _style: STRING;

  private _explode: BOOLEAN;

  private _allowReserved: BOOLEAN;

  private _schema: OpenapiV3SchemaOrReference;

  private _example: OpenapiV3Any;

  private _examples: OpenapiV3ExamplesOrReferences;

  private _content: OpenapiV3MediaTypes;

  private _specificationExtension: ARRAY<OpenapiV3NamedAny, IOpenapiV3NamedAny>;

  public __defaultValues: IHeader;

  constructor(
    initData?: IHeader,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'openapi.v3.Header';

    this.__meta.nodeFields = [
      {
        fieldName: 'description',
        protoName: 'description',
        FieldConstructor: STRING,
        constraints: {},
      },
      {
        fieldName: 'required',
        protoName: 'required',
        FieldConstructor: BOOLEAN,
        constraints: {},
      },
      {
        fieldName: 'deprecated',
        protoName: 'deprecated',
        FieldConstructor: BOOLEAN,
        constraints: {},
      },
      {
        fieldName: 'allowEmptyValue',
        protoName: 'allow_empty_value',
        FieldConstructor: BOOLEAN,
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
        fieldName: 'schema',
        protoName: 'schema',
        FieldConstructor: OpenapiV3SchemaOrReference,
        constraints: {},
      },
      {
        fieldName: 'example',
        protoName: 'example',
        FieldConstructor: OpenapiV3Any,
        constraints: {},
      },
      {
        fieldName: 'examples',
        protoName: 'examples',
        FieldConstructor: OpenapiV3ExamplesOrReferences,
        constraints: {},
      },
      {
        fieldName: 'content',
        protoName: 'content',
        FieldConstructor: OpenapiV3MediaTypes,
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

    this._required = new BOOLEAN(undefined, this, 'required');

    this._deprecated = new BOOLEAN(undefined, this, 'deprecated');

    this._allowEmptyValue = new BOOLEAN(undefined, this, 'allowEmptyValue');

    this._style = new STRING(undefined, this, 'style');

    this._explode = new BOOLEAN(undefined, this, 'explode');

    this._allowReserved = new BOOLEAN(undefined, this, 'allowReserved');

    this._schema = new OpenapiV3SchemaOrReference(undefined, this, 'schema');

    this._example = new OpenapiV3Any(undefined, this, 'example');

    this._examples = new OpenapiV3ExamplesOrReferences(
      undefined,
      this,
      'examples',
    );

    this._content = new OpenapiV3MediaTypes(undefined, this, 'content');

    this._specificationExtension = new ARRAY<
      OpenapiV3NamedAny,
      IOpenapiV3NamedAny
    >(undefined, this, 'specificationExtension');

    // Set required fields
    [].forEach(fieldName => {
      (this[fieldName as keyof Header] as FieldNode).__meta.required = true;
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
      (this[fieldName as keyof Header] as FieldNode).__readonly = true;
    });

    this.__meta.isPristine = true;
  }

  public get description(): STRING {
    return this._description;
  }

  public set description(v: string) {
    this.__PrimitivesSetter(this._description, v);
  }

  public get required(): BOOLEAN {
    return this._required;
  }

  public set required(v: boolean) {
    this.__PrimitivesSetter(this._required, v);
  }

  public get deprecated(): BOOLEAN {
    return this._deprecated;
  }

  public set deprecated(v: boolean) {
    this.__PrimitivesSetter(this._deprecated, v);
  }

  public get allowEmptyValue(): BOOLEAN {
    return this._allowEmptyValue;
  }

  public set allowEmptyValue(v: boolean) {
    this.__PrimitivesSetter(this._allowEmptyValue, v);
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

  public get schema(): OpenapiV3SchemaOrReference {
    return this._schema;
  }

  public set schema(v: IOpenapiV3SchemaOrReference) {
    this.__TypeSetter(this._schema, v);
  }

  public get example(): OpenapiV3Any {
    return this._example;
  }

  public set example(v: IOpenapiV3Any) {
    this.__TypeSetter(this._example, v);
  }

  public get examples(): OpenapiV3ExamplesOrReferences {
    return this._examples;
  }

  public set examples(v: IOpenapiV3ExamplesOrReferences) {
    this.__TypeSetter(this._examples, v);
  }

  public get content(): OpenapiV3MediaTypes {
    return this._content;
  }

  public set content(v: IOpenapiV3MediaTypes) {
    this.__TypeSetter(this._content, v);
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

  fromLiteral(data: IHeader) {
    super.__fromLiteral(data);
  }

  toLiteral(): IHeader {
    return super.__toLiteral();
  }
}

Registry.register('openapi.v3.Header', Header);