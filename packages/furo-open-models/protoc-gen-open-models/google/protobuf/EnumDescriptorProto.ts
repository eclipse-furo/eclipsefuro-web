// Code generated by furo protoc-gen-open-models. DO NOT EDIT.
// protoc-gen-open-models version: ????

import {
  ARRAY,
  FieldNode,
  Registry,
  STRING,
} from '@furo/open-models/dist/index';
import {
  EnumDescriptorProtoEnumReservedRange as GoogleProtobufEnumDescriptorProtoEnumReservedRange,
  IEnumDescriptorProtoEnumReservedRange as IGoogleProtobufEnumDescriptorProtoEnumReservedRange,
  TEnumDescriptorProtoEnumReservedRange as TGoogleProtobufEnumDescriptorProtoEnumReservedRange,
} from './EnumDescriptorProto.EnumReservedRange';

import {
  EnumOptions as GoogleProtobufEnumOptions,
  IEnumOptions as IGoogleProtobufEnumOptions,
  TEnumOptions as TGoogleProtobufEnumOptions,
} from './EnumOptions';

import {
  EnumValueDescriptorProto as GoogleProtobufEnumValueDescriptorProto,
  IEnumValueDescriptorProto as IGoogleProtobufEnumValueDescriptorProto,
  TEnumValueDescriptorProto as TGoogleProtobufEnumValueDescriptorProto,
} from './EnumValueDescriptorProto';

/**
 * @interface IEnumDescriptorProto
 *  Describes an enum type.
 */
export interface IEnumDescriptorProto {
  name?: string;
  value?: IGoogleProtobufEnumValueDescriptorProto[];
  options?: IGoogleProtobufEnumOptions;
  /**
   *  Range of reserved numeric values. Reserved numeric values may not be used
   *  by enum values in the same enum declaration. Reserved ranges may not
   *  overlap.
   */
  reservedRange?: IGoogleProtobufEnumDescriptorProtoEnumReservedRange[];
  /**
   *  Reserved enum value names, which may not be reused. A given name may only
   *  be reserved once.
   */
  reservedName?: string[];
}

/**
 * @interface TEnumDescriptorProto
 *  Describes an enum type.
 */
export interface TEnumDescriptorProto {
  name?: string;
  value?: TGoogleProtobufEnumValueDescriptorProto[];
  options?: TGoogleProtobufEnumOptions;
  /**
   *  Range of reserved numeric values. Reserved numeric values may not be used
   *  by enum values in the same enum declaration. Reserved ranges may not
   *  overlap.
   */
  reserved_range?: TGoogleProtobufEnumDescriptorProtoEnumReservedRange[];
  /**
   *  Reserved enum value names, which may not be reused. A given name may only
   *  be reserved once.
   */
  reserved_name?: string[];
}

/**
 * EnumDescriptorProto
 *  Describes an enum type.
 */
export class EnumDescriptorProto extends FieldNode {
  private _name: STRING;

  private _value: ARRAY<
    GoogleProtobufEnumValueDescriptorProto,
    IGoogleProtobufEnumValueDescriptorProto
  >;

  private _options: GoogleProtobufEnumOptions;

  //  Range of reserved numeric values. Reserved numeric values may not be used
  //  by enum values in the same enum declaration. Reserved ranges may not
  //  overlap.
  private _reservedRange: ARRAY<
    GoogleProtobufEnumDescriptorProtoEnumReservedRange,
    IGoogleProtobufEnumDescriptorProtoEnumReservedRange
  >;

  //  Reserved enum value names, which may not be reused. A given name may only
  //  be reserved once.
  private _reservedName: ARRAY<STRING, string>;

  public __defaultValues: IEnumDescriptorProto;

  constructor(
    initData?: IEnumDescriptorProto,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'google.protobuf.EnumDescriptorProto';

    this.__meta.nodeFields = [
      {
        fieldName: 'name',
        protoName: 'name',
        FieldConstructor: STRING,
        constraints: {},
      },
      {
        fieldName: 'value',
        protoName: 'value',
        FieldConstructor: GoogleProtobufEnumValueDescriptorProto,
        constraints: {},
      },
      {
        fieldName: 'options',
        protoName: 'options',
        FieldConstructor: GoogleProtobufEnumOptions,
        constraints: {},
      },
      {
        fieldName: 'reservedRange',
        protoName: 'reserved_range',
        FieldConstructor: GoogleProtobufEnumDescriptorProtoEnumReservedRange,
        constraints: {},
      },
      {
        fieldName: 'reservedName',
        protoName: 'reserved_name',
        FieldConstructor: STRING,
        constraints: {},
      },
    ];

    // Initialize the fields
    this._name = new STRING(undefined, this, 'name');

    this._value = new ARRAY<
      GoogleProtobufEnumValueDescriptorProto,
      IGoogleProtobufEnumValueDescriptorProto
    >(undefined, this, 'value');

    this._options = new GoogleProtobufEnumOptions(undefined, this, 'options');

    //  Range of reserved numeric values. Reserved numeric values may not be used
    //  by enum values in the same enum declaration. Reserved ranges may not
    //  overlap.
    this._reservedRange = new ARRAY<
      GoogleProtobufEnumDescriptorProtoEnumReservedRange,
      IGoogleProtobufEnumDescriptorProtoEnumReservedRange
    >(undefined, this, 'reservedRange');

    //  Reserved enum value names, which may not be reused. A given name may only
    //  be reserved once.
    this._reservedName = new ARRAY<STRING, string>(
      undefined,
      this,
      'reservedName',
    );

    // Set required fields
    [].forEach(fieldName => {
      (
        this[fieldName as keyof EnumDescriptorProto] as FieldNode
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
      (this[fieldName as keyof EnumDescriptorProto] as FieldNode).__readonly =
        true;
    });

    this.__meta.isPristine = true;
  }

  public get name(): STRING {
    return this._name;
  }

  public set name(v: string) {
    this.__PrimitivesSetter(this._name, v);
  }

  public get value(): ARRAY<
    GoogleProtobufEnumValueDescriptorProto,
    IGoogleProtobufEnumValueDescriptorProto
  > {
    return this._value;
  }

  public set value(v: IGoogleProtobufEnumValueDescriptorProto[]) {
    this.__TypeSetter(this._value, v);
  }

  public get options(): GoogleProtobufEnumOptions {
    return this._options;
  }

  public set options(v: IGoogleProtobufEnumOptions) {
    this.__TypeSetter(this._options, v);
  }

  //  Range of reserved numeric values. Reserved numeric values may not be used
  //  by enum values in the same enum declaration. Reserved ranges may not
  //  overlap.
  public get reservedRange(): ARRAY<
    GoogleProtobufEnumDescriptorProtoEnumReservedRange,
    IGoogleProtobufEnumDescriptorProtoEnumReservedRange
  > {
    return this._reservedRange;
  }

  public set reservedRange(
    v: IGoogleProtobufEnumDescriptorProtoEnumReservedRange[],
  ) {
    this.__TypeSetter(this._reservedRange, v);
  }

  //  Reserved enum value names, which may not be reused. A given name may only
  //  be reserved once.
  public get reservedName(): ARRAY<STRING, string> {
    return this._reservedName;
  }

  public set reservedName(v: string[]) {
    this.__TypeSetter(this._reservedName, v);
  }

  fromLiteral(data: IEnumDescriptorProto) {
    super.__fromLiteral(data);
  }

  toLiteral(): IEnumDescriptorProto {
    return super.__toLiteral();
  }
}

Registry.register('google.protobuf.EnumDescriptorProto', EnumDescriptorProto);
