// Code generated by furo protoc-gen-open-models. DO NOT EDIT.
// protoc-gen-open-models version: ????

import {
  BOOLEAN,
  FieldNode,
  Registry,
  STRING,
} from '@furo/open-models/dist/index';

/**
 * @interface IAnyLabelsEntry
 */
export interface IAnyLabelsEntry {
  /**
   *  Furo annotated type wrapper message for `any`.
   *  // Any contains an arbitrary serialized protocol buffer message along with a
   *  // URL that describes the type of the serialized message. https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/any.proto
   */
  key?: string;
  /**
   *  Furo annotated type wrapper message for `any`.
   *  // Any contains an arbitrary serialized protocol buffer message along with a
   *  // URL that describes the type of the serialized message. https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/any.proto
   */
  value?: boolean;
}

/**
 * @interface TAnyLabelsEntry
 */
export interface TAnyLabelsEntry {
  /**
   *  Furo annotated type wrapper message for `any`.
   *  // Any contains an arbitrary serialized protocol buffer message along with a
   *  // URL that describes the type of the serialized message. https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/any.proto
   */
  key?: string;
  /**
   *  Furo annotated type wrapper message for `any`.
   *  // Any contains an arbitrary serialized protocol buffer message along with a
   *  // URL that describes the type of the serialized message. https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/any.proto
   */
  value?: boolean;
}

/**
 * AnyLabelsEntry
 */
export class AnyLabelsEntry extends FieldNode {
  //  Furo annotated type wrapper message for `any`.
  //  // Any contains an arbitrary serialized protocol buffer message along with a
  //  // URL that describes the type of the serialized message. https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/any.proto
  private _key: STRING;

  //  Furo annotated type wrapper message for `any`.
  //  // Any contains an arbitrary serialized protocol buffer message along with a
  //  // URL that describes the type of the serialized message. https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/any.proto
  private _value: BOOLEAN;

  public __defaultValues: IAnyLabelsEntry;

  constructor(
    initData?: IAnyLabelsEntry,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'furo.fat.Any.LabelsEntry';

    this.__meta.nodeFields = [
      {
        fieldName: 'key',
        protoName: 'key',
        FieldConstructor: STRING,
        constraints: {},
      },
      {
        fieldName: 'value',
        protoName: 'value',
        FieldConstructor: BOOLEAN,
        constraints: {},
      },
    ];

    // Initialize the fields
    //  Furo annotated type wrapper message for `any`.
    //  // Any contains an arbitrary serialized protocol buffer message along with a
    //  // URL that describes the type of the serialized message. https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/any.proto
    this._key = new STRING(undefined, this, 'key');

    //  Furo annotated type wrapper message for `any`.
    //  // Any contains an arbitrary serialized protocol buffer message along with a
    //  // URL that describes the type of the serialized message. https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/any.proto
    this._value = new BOOLEAN(undefined, this, 'value');

    // Set required fields
    [].forEach(fieldName => {
      (this[fieldName as keyof AnyLabelsEntry] as FieldNode).__meta.required =
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
      (this[fieldName as keyof AnyLabelsEntry] as FieldNode).__readonly = true;
    });

    this.__meta.isPristine = true;
  }

  //  Furo annotated type wrapper message for `any`.
  //  // Any contains an arbitrary serialized protocol buffer message along with a
  //  // URL that describes the type of the serialized message. https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/any.proto
  public get key(): STRING {
    return this._key;
  }

  public set key(v: string) {
    this.__PrimitivesSetter(this._key, v);
  }

  //  Furo annotated type wrapper message for `any`.
  //  // Any contains an arbitrary serialized protocol buffer message along with a
  //  // URL that describes the type of the serialized message. https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/any.proto
  public get value(): BOOLEAN {
    return this._value;
  }

  public set value(v: boolean) {
    this.__PrimitivesSetter(this._value, v);
  }

  fromLiteral(data: IAnyLabelsEntry) {
    super.__fromLiteral(data);
  }

  toLiteral(): IAnyLabelsEntry {
    return super.__toLiteral();
  }
}

Registry.register('furo.fat.Any.LabelsEntry', AnyLabelsEntry);
