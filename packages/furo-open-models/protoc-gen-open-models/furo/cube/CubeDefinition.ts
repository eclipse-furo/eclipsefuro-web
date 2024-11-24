// Code generated by furo protoc-gen-open-models. DO NOT EDIT.
// protoc-gen-open-models version: ????

import {
  BOOLEAN,
  DOUBLE,
  ENUM,
  FieldNode,
  INT32,
  Registry,
  STRING,
} from '@furo/open-models/dist/index';
import {
  Colour as FuroCubeColour,
  IColour as IFuroCubeColour,
  TColour as TFuroCubeColour,
} from './Colour';

import { Materials as FuroCubeMaterials } from './Materials';

/**
 * @interface ICubeDefinition
 */
export interface ICubeDefinition {
  length?: number;
  breadth?: number;
  height?: number;
  colour?: IFuroCubeColour;
  material?: FuroCubeMaterials | string;
  str?: string;
  boo?: boolean;
  num?: number;
}

/**
 * @interface TCubeDefinition
 */
export interface TCubeDefinition {
  length?: number;
  breadth?: number;
  height?: number;
  colour?: TFuroCubeColour;
  material?: FuroCubeMaterials | string;
  str?: string;
  boo?: boolean;
  num?: number;
}

/**
 * CubeDefinition
 */
export class CubeDefinition extends FieldNode {
  private _length: DOUBLE;

  private _breadth: DOUBLE;

  private _height: DOUBLE;

  private _colour: FuroCubeColour;

  private _material: ENUM<FuroCubeMaterials>;

  private _str: STRING;

  private _boo: BOOLEAN;

  private _num: INT32;

  public __defaultValues: ICubeDefinition;

  constructor(
    initData?: ICubeDefinition,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'furo.cube.CubeDefinition';

    this.__meta.nodeFields = [
      {
        fieldName: 'length',
        protoName: 'length',
        FieldConstructor: DOUBLE,
        constraints: { maximum: 1000, minimum: 100, required: true },
      },
      {
        fieldName: 'breadth',
        protoName: 'breadth',
        FieldConstructor: DOUBLE,
        constraints: { maximum: 1000, minimum: 100, required: true },
      },
      {
        fieldName: 'height',
        protoName: 'height',
        FieldConstructor: DOUBLE,
        constraints: { maximum: 1000, minimum: 100, required: true },
      },
      {
        fieldName: 'colour',
        protoName: 'colour',
        FieldConstructor: FuroCubeColour,
        constraints: {},
      },
      {
        fieldName: 'material',
        protoName: 'material',
        FieldConstructor: ENUM<FuroCubeMaterials>,
        constraints: {},
      },
      {
        fieldName: 'str',
        protoName: 'str',
        FieldConstructor: STRING,
        constraints: {},
      },
      {
        fieldName: 'boo',
        protoName: 'boo',
        FieldConstructor: BOOLEAN,
        constraints: {},
      },
      {
        fieldName: 'num',
        protoName: 'num',
        FieldConstructor: INT32,
        constraints: {},
      },
    ];

    // Initialize the fields
    this._length = new DOUBLE(undefined, this, 'length');

    this._breadth = new DOUBLE(undefined, this, 'breadth');

    this._height = new DOUBLE(undefined, this, 'height');

    this._colour = new FuroCubeColour(undefined, this, 'colour');

    this._material = new ENUM<FuroCubeMaterials>(
      undefined,
      FuroCubeMaterials,
      FuroCubeMaterials.MATERIALS_UNSPECIFIED,
      this,
      'material',
    );

    this._str = new STRING(undefined, this, 'str');

    this._boo = new BOOLEAN(undefined, this, 'boo');

    this._num = new INT32(undefined, this, 'num');

    // Set required fields
    ['length', 'breadth', 'height'].forEach(fieldName => {
      (this[fieldName as keyof CubeDefinition] as FieldNode).__meta.required =
        true;
    });

    // Default values from openAPI annotations
    this.__defaultValues = {
      breadth: 100.0,
      height: 100.0,
      length: 100.0,
    };

    // Initialize the fields with init data
    if (initData !== undefined) {
      this.__fromLiteral({ ...this.__defaultValues, ...initData });
    } else {
      this.__fromLiteral(this.__defaultValues);
    }

    // Set readonly fields after the init, so child nodes are readonly too
    [].forEach(fieldName => {
      (this[fieldName as keyof CubeDefinition] as FieldNode).__readonly = true;
    });

    this.__meta.isPristine = true;
  }

  public get length(): DOUBLE {
    return this._length;
  }

  public set length(v: number) {
    this.__PrimitivesSetter(this._length, v);
  }

  public get breadth(): DOUBLE {
    return this._breadth;
  }

  public set breadth(v: number) {
    this.__PrimitivesSetter(this._breadth, v);
  }

  public get height(): DOUBLE {
    return this._height;
  }

  public set height(v: number) {
    this.__PrimitivesSetter(this._height, v);
  }

  public get colour(): FuroCubeColour {
    return this._colour;
  }

  public set colour(v: IFuroCubeColour) {
    this.__TypeSetter(this._colour, v);
  }

  public get material(): ENUM<FuroCubeMaterials> {
    return this._material;
  }

  public set material(v: FuroCubeMaterials) {
    this.__TypeSetter(this._material, v);
  }

  public get str(): STRING {
    return this._str;
  }

  public set str(v: string) {
    this.__PrimitivesSetter(this._str, v);
  }

  public get boo(): BOOLEAN {
    return this._boo;
  }

  public set boo(v: boolean) {
    this.__PrimitivesSetter(this._boo, v);
  }

  public get num(): INT32 {
    return this._num;
  }

  public set num(v: number) {
    this.__PrimitivesSetter(this._num, v);
  }

  fromLiteral(data: ICubeDefinition) {
    super.__fromLiteral(data);
  }

  toLiteral(): ICubeDefinition {
    return super.__toLiteral();
  }
}

Registry.register('furo.cube.CubeDefinition', CubeDefinition);
