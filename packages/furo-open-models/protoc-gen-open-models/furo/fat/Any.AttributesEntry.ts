// Code generated by furo protoc-gen-open-models. DO NOT EDIT.
// protoc-gen-open-models version: ????

import { FieldNode, Registry, STRING } from '@furo/open-models/dist/index';

/**
 * @interface IAnyAttributesEntry
 */
export interface IAnyAttributesEntry {
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
  value?: string;
}

/**
 * @interface TAnyAttributesEntry
 */
export interface TAnyAttributesEntry {
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
  value?: string;
}

/**
 * AnyAttributesEntry
 */
export class AnyAttributesEntry extends FieldNode {
  //  Furo annotated type wrapper message for `any`.
  //  // Any contains an arbitrary serialized protocol buffer message along with a
  //  // URL that describes the type of the serialized message. https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/any.proto
  private _key: STRING;

  //  Furo annotated type wrapper message for `any`.
  //  // Any contains an arbitrary serialized protocol buffer message along with a
  //  // URL that describes the type of the serialized message. https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/any.proto
  private _value: STRING;

  public __defaultValues: IAnyAttributesEntry;

  constructor(
    initData?: IAnyAttributesEntry,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'furo.fat.Any.AttributesEntry';

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
        FieldConstructor: STRING,
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
    this._value = new STRING(undefined, this, 'value');

    // Set required fields
    [].forEach(fieldName => {
      (
        this[fieldName as keyof AnyAttributesEntry] as FieldNode
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
      (this[fieldName as keyof AnyAttributesEntry] as FieldNode).__readonly =
        true;
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
  public get value(): STRING {
    return this._value;
  }

  public set value(v: string) {
    this.__PrimitivesSetter(this._value, v);
  }

  fromLiteral(data: IAnyAttributesEntry) {
    super.__fromLiteral(data);
  }

  toLiteral(): IAnyAttributesEntry {
    return super.__toLiteral();
  }
}

Registry.register('furo.fat.Any.AttributesEntry', AnyAttributesEntry);
