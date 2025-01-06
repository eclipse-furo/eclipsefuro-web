// Code generated by furo protoc-gen-open-models. DO NOT EDIT.
// protoc-gen-open-models version: ????

import {
  ANY,
  ARRAY,
  BOOLEAN,
  ENUM,
  FieldNode,
  MAP,
  Registry,
  STRING,
  type IAny,
} from '@furo/open-models/dist/index';
import {
  IXString as IFuroFatString,
  TXString as TFuroFatString,
  XString as FuroFatString,
} from '../fat/String';

import { BookingCenter as FuroTypeBookingCenter } from './BookingCenter';

import {
  Decimal as FuroTypeDecimal,
  IDecimal as IFuroTypeDecimal,
  TDecimal as TFuroTypeDecimal,
} from './Decimal';

import {
  DecimalRange as FuroTypeDecimalRange,
  IDecimalRange as IFuroTypeDecimalRange,
  TDecimalRange as TFuroTypeDecimalRange,
} from './DecimalRange';

import { RefSystem as FuroTypeRefSystem } from './RefSystem';

import { RefType as FuroTypeRefType } from './RefType';

/**
 * @interface IDefaults
 */
export interface IDefaults {
  /**
   *  related to the master of the object - who gives the id
   */
  refSystem?: FuroTypeRefSystem | string;
  /**
   *  Type from the master objects system
   */
  refType?: FuroTypeRefType | string;
  /**
   *  booking center
   */
  bookingCenter?: FuroTypeBookingCenter | string;
  /**
   *  Attributes for a value, something like confidential-msg: you are not allowed to see this value
   */
  attributes?: { [key: string]: string };
  id?: string;
  stringArray?: string[];
  repeatedDecimal?: IFuroTypeDecimal[];
  decRange?: IFuroTypeDecimalRange;
  any?: IAny;
  fatString?: IFuroFatString;
  trueFalse?: boolean;
}

/**
 * @interface TDefaults
 */
export interface TDefaults {
  /**
   *  related to the master of the object - who gives the id
   */
  ref_system?: FuroTypeRefSystem | string;
  /**
   *  Type from the master objects system
   */
  ref_type?: FuroTypeRefType | string;
  /**
   *  booking center
   */
  booking_center?: FuroTypeBookingCenter | string;
  /**
   *  Attributes for a value, something like confidential-msg: you are not allowed to see this value
   */
  attributes?: { [key: string]: string };
  id?: string;
  string_array?: string[];
  repeated_decimal?: TFuroTypeDecimal[];
  dec_range?: TFuroTypeDecimalRange;
  any?: IAny;
  fat_string?: TFuroFatString;
  true_false?: boolean;
}

/**
 * Defaults
 */
export class Defaults extends FieldNode {
  //  related to the master of the object - who gives the id
  private _refSystem: ENUM<FuroTypeRefSystem>;

  //  Type from the master objects system
  private _refType: ENUM<FuroTypeRefType>;

  //  booking center
  private _bookingCenter: ENUM<FuroTypeBookingCenter>;

  //  Attributes for a value, something like confidential-msg: you are not allowed to see this value
  private _attributes: MAP<string, STRING, string>;

  private _id: STRING;

  private _stringArray: ARRAY<STRING, string>;

  private _repeatedDecimal: ARRAY<FuroTypeDecimal, IFuroTypeDecimal>;

  private _decRange: FuroTypeDecimalRange;

  private _any: ANY;

  private _fatString: FuroFatString;

  private _trueFalse: BOOLEAN;

  public __defaultValues: IDefaults;

  constructor(
    initData?: IDefaults,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'furo.type.Defaults';

    this.__meta.nodeFields = [
      {
        fieldName: 'refSystem',
        protoName: 'ref_system',
        FieldConstructor: ENUM<FuroTypeRefSystem>,
        constraints: {},
      },
      {
        fieldName: 'refType',
        protoName: 'ref_type',
        FieldConstructor: ENUM<FuroTypeRefType>,
        constraints: {},
      },
      {
        fieldName: 'bookingCenter',
        protoName: 'booking_center',
        FieldConstructor: ENUM<FuroTypeBookingCenter>,
        constraints: {},
      },
      {
        fieldName: 'attributes',
        protoName: 'attributes',
        FieldConstructor: MAP<string, STRING, string>,
        ValueConstructor: STRING,
        constraints: {},
      },
      {
        fieldName: 'id',
        protoName: 'id',
        FieldConstructor: STRING,
        constraints: {
          max_length: 10,
          min_length: 3,
          pattern: '^-*$',
          required: true,
        },
      },
      {
        fieldName: 'stringArray',
        protoName: 'string_array',
        FieldConstructor: STRING,
        constraints: { read_only: true, max_items: 4, required: true },
      },
      {
        fieldName: 'repeatedDecimal',
        protoName: 'repeated_decimal',
        FieldConstructor: FuroTypeDecimal,
        constraints: { minimum: 3.1, required: true },
      },
      {
        fieldName: 'decRange',
        protoName: 'dec_range',
        FieldConstructor: FuroTypeDecimalRange,
        constraints: { read_only: true },
      },
      {
        fieldName: 'any',
        protoName: 'any',
        FieldConstructor: ANY,
        constraints: {},
      },
      {
        fieldName: 'fatString',
        protoName: 'fat_string',
        FieldConstructor: FuroFatString,
        constraints: {},
      },
      {
        fieldName: 'trueFalse',
        protoName: 'true_false',
        FieldConstructor: BOOLEAN,
        constraints: {},
      },
    ];

    // Initialize the fields
    //  related to the master of the object - who gives the id
    this._refSystem = new ENUM<FuroTypeRefSystem>(
      undefined,
      FuroTypeRefSystem,
      FuroTypeRefSystem.REF_SYSTEM_UNSPECIFIED,
      this,
      'refSystem',
    );

    //  Type from the master objects system
    this._refType = new ENUM<FuroTypeRefType>(
      undefined,
      FuroTypeRefType,
      FuroTypeRefType.REF_TYPE_UNSPECIFIED,
      this,
      'refType',
    );

    //  booking center
    this._bookingCenter = new ENUM<FuroTypeBookingCenter>(
      undefined,
      FuroTypeBookingCenter,
      FuroTypeBookingCenter.BOOKING_CENTER_UNSPECIFIED,
      this,
      'bookingCenter',
    );

    //  Attributes for a value, something like confidential-msg: you are not allowed to see this value
    this._attributes = new MAP<string, STRING, string>(
      undefined,
      this,
      'attributes',
    );

    this._id = new STRING(undefined, this, 'id');

    this._stringArray = new ARRAY<STRING, string>(
      undefined,
      this,
      'stringArray',
    );

    this._repeatedDecimal = new ARRAY<FuroTypeDecimal, IFuroTypeDecimal>(
      undefined,
      this,
      'repeatedDecimal',
    );

    this._decRange = new FuroTypeDecimalRange(undefined, this, 'decRange');

    this._any = new ANY(undefined, this, 'any');

    this._fatString = new FuroFatString(undefined, this, 'fatString');

    this._trueFalse = new BOOLEAN(undefined, this, 'trueFalse');

    // Set required fields
    ['id', 'stringArray', 'repeatedDecimal'].forEach(fieldName => {
      (this[fieldName as keyof Defaults] as FieldNode).__meta.required = true;
    });

    // Default values from openAPI annotations
    this.__defaultValues = {
      attributes: { we: 'have' },
      bookingCenter: 'BBC_CH',
      decRange: { start: { value: '123' } },
      id: 'default',
      stringArray: ['A', 'B', 'C'],
    };

    // Initialize the fields with init data
    if (initData !== undefined) {
      this.__fromLiteral({ ...this.__defaultValues, ...initData });
    } else {
      this.__fromLiteral(this.__defaultValues);
    }

    // Set readonly fields after the init, so child nodes are readonly too
    ['stringArray', 'decRange'].forEach(fieldName => {
      (this[fieldName as keyof Defaults] as FieldNode).__readonly = true;
    });

    this.__meta.isPristine = true;
  }

  //  related to the master of the object - who gives the id
  public get refSystem(): ENUM<FuroTypeRefSystem> {
    return this._refSystem;
  }

  public set refSystem(v: FuroTypeRefSystem) {
    this.__TypeSetter(this._refSystem, v);
  }

  //  Type from the master objects system
  public get refType(): ENUM<FuroTypeRefType> {
    return this._refType;
  }

  public set refType(v: FuroTypeRefType) {
    this.__TypeSetter(this._refType, v);
  }

  //  booking center
  public get bookingCenter(): ENUM<FuroTypeBookingCenter> {
    return this._bookingCenter;
  }

  public set bookingCenter(v: FuroTypeBookingCenter) {
    this.__TypeSetter(this._bookingCenter, v);
  }

  //  Attributes for a value, something like confidential-msg: you are not allowed to see this value
  public get attributes(): MAP<string, STRING, string> {
    return this._attributes;
  }

  public set attributes(v: { [key: string]: string }) {
    this.__TypeSetter(this._attributes, v);
  }

  public get id(): STRING {
    return this._id;
  }

  public set id(v: string) {
    this.__PrimitivesSetter(this._id, v);
  }

  public get stringArray(): ARRAY<STRING, string> {
    return this._stringArray;
  }

  public set stringArray(v: string[]) {
    this.__TypeSetter(this._stringArray, v);
  }

  public get repeatedDecimal(): ARRAY<FuroTypeDecimal, IFuroTypeDecimal> {
    return this._repeatedDecimal;
  }

  public set repeatedDecimal(v: IFuroTypeDecimal[]) {
    this.__TypeSetter(this._repeatedDecimal, v);
  }

  public get decRange(): FuroTypeDecimalRange {
    return this._decRange;
  }

  public set decRange(v: IFuroTypeDecimalRange) {
    this.__TypeSetter(this._decRange, v);
  }

  public get any(): ANY {
    return this._any;
  }

  public set any(v: IAny) {
    this.__TypeSetter(this._any, v);
  }

  public get fatString(): FuroFatString {
    return this._fatString;
  }

  public set fatString(v: IFuroFatString) {
    this.__TypeSetter(this._fatString, v);
  }

  public get trueFalse(): BOOLEAN {
    return this._trueFalse;
  }

  public set trueFalse(v: boolean) {
    this.__PrimitivesSetter(this._trueFalse, v);
  }

  fromLiteral(data: IDefaults) {
    super.__fromLiteral(data);
  }

  toLiteral(): IDefaults {
    return super.__toLiteral();
  }
}

Registry.register('furo.type.Defaults', Defaults);