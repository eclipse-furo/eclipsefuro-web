// Code generated by furo protoc-gen-open-models. DO NOT EDIT.
// protoc-gen-open-models version: ????

import { FieldNode, Registry } from '@furo/open-models/dist/index';
import {
  Decimal as FuroTypeDecimal,
  IDecimal as IFuroTypeDecimal,
  TDecimal as TFuroTypeDecimal,
} from '../type/Decimal';

/**
 * @interface IDecimalRange
 *  Represents a decimal range, encoded as a decimal start (inclusive) and a
 *   decimal end (exclusive).
 *
 *   The start must be less than or equal to the end.
 *   If a decimal is empty it means min for start and max for end.
 */
export interface IDecimalRange {
  /**
   *  Optional. Inclusive start of the decimal range.
   */
  start?: IFuroTypeDecimal;
  /**
   *  Optional. Exclusive end of the decimal range.
   */
  end?: IFuroTypeDecimal;
}

/**
 * @interface TDecimalRange
 *  Represents a decimal range, encoded as a decimal start (inclusive) and a
 *   decimal end (exclusive).
 *
 *   The start must be less than or equal to the end.
 *   If a decimal is empty it means min for start and max for end.
 */
export interface TDecimalRange {
  /**
   *  Optional. Inclusive start of the decimal range.
   */
  start?: TFuroTypeDecimal;
  /**
   *  Optional. Exclusive end of the decimal range.
   */
  end?: TFuroTypeDecimal;
}

/**
 * DecimalRange
 *  Represents a decimal range, encoded as a decimal start (inclusive) and a
 *   decimal end (exclusive).
 *
 *   The start must be less than or equal to the end.
 *   If a decimal is empty it means min for start and max for end.
 */
export class DecimalRange extends FieldNode {
  //  Optional. Inclusive start of the decimal range.
  private _start: FuroTypeDecimal;

  //  Optional. Exclusive end of the decimal range.
  private _end: FuroTypeDecimal;

  public __defaultValues: IDecimalRange;

  constructor(
    initData?: IDecimalRange,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'furo.fat.DecimalRange';

    this.__meta.nodeFields = [
      {
        fieldName: 'start',
        protoName: 'start',
        FieldConstructor: FuroTypeDecimal,
        constraints: {},
      },
      {
        fieldName: 'end',
        protoName: 'end',
        FieldConstructor: FuroTypeDecimal,
        constraints: {},
      },
    ];

    // Initialize the fields
    //  Optional. Inclusive start of the decimal range.
    this._start = new FuroTypeDecimal(undefined, this, 'start');

    //  Optional. Exclusive end of the decimal range.
    this._end = new FuroTypeDecimal(undefined, this, 'end');

    // Set required fields
    [].forEach(fieldName => {
      (this[fieldName as keyof DecimalRange] as FieldNode).__meta.required =
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
      (this[fieldName as keyof DecimalRange] as FieldNode).__readonly = true;
    });

    this.__meta.isPristine = true;
  }

  //  Optional. Inclusive start of the decimal range.
  public get start(): FuroTypeDecimal {
    return this._start;
  }

  public set start(v: IFuroTypeDecimal) {
    this.__TypeSetter(this._start, v);
  }

  //  Optional. Exclusive end of the decimal range.
  public get end(): FuroTypeDecimal {
    return this._end;
  }

  public set end(v: IFuroTypeDecimal) {
    this.__TypeSetter(this._end, v);
  }

  fromLiteral(data: IDecimalRange) {
    super.__fromLiteral(data);
  }

  toLiteral(): IDecimalRange {
    return super.__toLiteral();
  }
}

Registry.register('furo.fat.DecimalRange', DecimalRange);
