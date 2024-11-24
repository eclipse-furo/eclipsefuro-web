// Code generated by furo protoc-gen-open-models. DO NOT EDIT.
// protoc-gen-open-models version: ????

import {
  FLOAT,
  FieldNode,
  INT32,
  Registry,
} from '@furo/open-models/dist/index';

/**
 * @interface IColour
 */
export interface IColour {
  /**
   *  multiline leading comment
   *  the red part
   */
  red?: number; //  with constraints

  /**
   *  the green part
   */
  green?: number;
  blue?: number;
  alpha?: number;
}

/**
 * @interface TColour
 */
export interface TColour {
  /**
   *  multiline leading comment
   *  the red part
   */
  red?: number; //  with constraints

  /**
   *  the green part
   */
  green?: number;
  blue?: number;
  alpha?: number;
}

/**
 * Colour
 */
export class Colour extends FieldNode {
  //  multiline leading comment
  //  the red part
  private _red: INT32; //  with constraints

  //  the green part
  private _green: INT32;

  private _blue: INT32;

  private _alpha: FLOAT;

  public __defaultValues: IColour;

  constructor(
    initData?: IColour,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'furo.cube.Colour';

    this.__meta.nodeFields = [
      {
        fieldName: 'red',
        protoName: 'red',
        FieldConstructor: INT32,
        constraints: { maximum: 255 },
      },
      {
        fieldName: 'green',
        protoName: 'green',
        FieldConstructor: INT32,
        constraints: { maximum: 255 },
      },
      {
        fieldName: 'blue',
        protoName: 'blue',
        FieldConstructor: INT32,
        constraints: { maximum: 255 },
      },
      {
        fieldName: 'alpha',
        protoName: 'alpha',
        FieldConstructor: FLOAT,
        constraints: { maximum: 1 },
      },
    ];

    // Initialize the fields
    //  multiline leading comment
    //  the red part
    this._red = new INT32(undefined, this, 'red');

    //  the green part
    this._green = new INT32(undefined, this, 'green');

    this._blue = new INT32(undefined, this, 'blue');

    this._alpha = new FLOAT(undefined, this, 'alpha');

    // Set required fields
    [].forEach(fieldName => {
      (this[fieldName as keyof Colour] as FieldNode).__meta.required = true;
    });

    // Default values from openAPI annotations
    this.__defaultValues = {
      alpha: 1.0,
      blue: 88.0,
      green: 34.0,
      red: 22.0,
    };

    // Initialize the fields with init data
    if (initData !== undefined) {
      this.__fromLiteral({ ...this.__defaultValues, ...initData });
    } else {
      this.__fromLiteral(this.__defaultValues);
    }

    // Set readonly fields after the init, so child nodes are readonly too
    [].forEach(fieldName => {
      (this[fieldName as keyof Colour] as FieldNode).__readonly = true;
    });

    this.__meta.isPristine = true;
  }

  //  multiline leading comment
  //  the red part
  public get red(): INT32 {
    return this._red;
  }

  public set red(v: number) {
    this.__PrimitivesSetter(this._red, v);
  }

  //  the green part
  public get green(): INT32 {
    return this._green;
  }

  public set green(v: number) {
    this.__PrimitivesSetter(this._green, v);
  }

  public get blue(): INT32 {
    return this._blue;
  }

  public set blue(v: number) {
    this.__PrimitivesSetter(this._blue, v);
  }

  public get alpha(): FLOAT {
    return this._alpha;
  }

  public set alpha(v: number) {
    this.__PrimitivesSetter(this._alpha, v);
  }

  fromLiteral(data: IColour) {
    super.__fromLiteral(data);
  }

  toLiteral(): IColour {
    return super.__toLiteral();
  }
}

Registry.register('furo.cube.Colour', Colour);
