// Code generated by furo protoc-gen-open-models. DO NOT EDIT.
// protoc-gen-open-models version: ????

import {
  BOOLEAN,
  FieldNode,
  MAP,
  Registry,
  STRING,
} from '@furo/open-models/dist/index';

/**
 * @interface IEmpty
 *  Furo annotated type wrapper message for `empty`. Empty has no values and only contains the labels and attributes
 */
export interface IEmpty {
  /**
   *  Labels / flags for the value, something like unspecified, empty, confidential, absent,... Can be used for AI, UI, Business Logic,...
   */
  labels?: { [key: string]: boolean };
  /**
   *  Attributes for a value, something like confidential-msg: you are not allowed to see this value
   */
  attributes?: { [key: string]: string };
}

/**
 * @interface TEmpty
 *  Furo annotated type wrapper message for `empty`. Empty has no values and only contains the labels and attributes
 */
export interface TEmpty {
  /**
   *  Labels / flags for the value, something like unspecified, empty, confidential, absent,... Can be used for AI, UI, Business Logic,...
   */
  labels?: { [key: string]: boolean };
  /**
   *  Attributes for a value, something like confidential-msg: you are not allowed to see this value
   */
  attributes?: { [key: string]: string };
}

/**
 * Empty
 *  Furo annotated type wrapper message for `empty`. Empty has no values and only contains the labels and attributes
 */
export class Empty extends FieldNode {
  //  Labels / flags for the value, something like unspecified, empty, confidential, absent,... Can be used for AI, UI, Business Logic,...
  private _labels: MAP<string, BOOLEAN, boolean>;

  //  Attributes for a value, something like confidential-msg: you are not allowed to see this value
  private _attributes: MAP<string, STRING, string>;

  public __defaultValues: IEmpty;

  constructor(
    initData?: IEmpty,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'furo.fat.Empty';

    this.__meta.nodeFields = [
      {
        fieldName: 'labels',
        protoName: 'labels',
        FieldConstructor: MAP<string, BOOLEAN, boolean>,
        ValueConstructor: BOOLEAN,
        constraints: {},
      },
      {
        fieldName: 'attributes',
        protoName: 'attributes',
        FieldConstructor: MAP<string, STRING, string>,
        ValueConstructor: STRING,
        constraints: {},
      },
    ];

    // Initialize the fields
    //  Labels / flags for the value, something like unspecified, empty, confidential, absent,... Can be used for AI, UI, Business Logic,...
    this._labels = new MAP<string, BOOLEAN, boolean>(undefined, this, 'labels');

    //  Attributes for a value, something like confidential-msg: you are not allowed to see this value
    this._attributes = new MAP<string, STRING, string>(
      undefined,
      this,
      'attributes',
    );

    // Set required fields
    [].forEach(fieldName => {
      (this[fieldName as keyof Empty] as FieldNode).__meta.required = true;
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
      (this[fieldName as keyof Empty] as FieldNode).__readonly = true;
    });

    this.__meta.isPristine = true;
  }

  //  Labels / flags for the value, something like unspecified, empty, confidential, absent,... Can be used for AI, UI, Business Logic,...
  public get labels(): MAP<string, BOOLEAN, boolean> {
    return this._labels;
  }

  public set labels(v: { [key: string]: boolean }) {
    this.__TypeSetter(this._labels, v);
  }

  //  Attributes for a value, something like confidential-msg: you are not allowed to see this value
  public get attributes(): MAP<string, STRING, string> {
    return this._attributes;
  }

  public set attributes(v: { [key: string]: string }) {
    this.__TypeSetter(this._attributes, v);
  }

  fromLiteral(data: IEmpty) {
    super.__fromLiteral(data);
  }

  toLiteral(): IEmpty {
    return super.__toLiteral();
  }
}

Registry.register('furo.fat.Empty', Empty);