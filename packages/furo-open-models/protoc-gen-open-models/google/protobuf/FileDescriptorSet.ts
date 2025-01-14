// Code generated by furo protoc-gen-open-models. DO NOT EDIT.
// protoc-gen-open-models version: ????

import { ARRAY, FieldNode, Registry } from '@furo/open-models/dist/index';
import {
  FileDescriptorProto as GoogleProtobufFileDescriptorProto,
  IFileDescriptorProto as IGoogleProtobufFileDescriptorProto,
  TFileDescriptorProto as TGoogleProtobufFileDescriptorProto,
} from './FileDescriptorProto';

/**
 * @interface IFileDescriptorSet
 *  The protocol compiler can output a FileDescriptorSet containing the .proto
 *  files it parses.
 */
export interface IFileDescriptorSet {
  file?: IGoogleProtobufFileDescriptorProto[];
}

/**
 * @interface TFileDescriptorSet
 *  The protocol compiler can output a FileDescriptorSet containing the .proto
 *  files it parses.
 */
export interface TFileDescriptorSet {
  file?: TGoogleProtobufFileDescriptorProto[];
}

/**
 * FileDescriptorSet
 *  The protocol compiler can output a FileDescriptorSet containing the .proto
 *  files it parses.
 */
export class FileDescriptorSet extends FieldNode {
  private _file: ARRAY<
    GoogleProtobufFileDescriptorProto,
    IGoogleProtobufFileDescriptorProto
  >;

  public __defaultValues: IFileDescriptorSet;

  constructor(
    initData?: IFileDescriptorSet,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'google.protobuf.FileDescriptorSet';

    this.__meta.nodeFields = [
      {
        fieldName: 'file',
        protoName: 'file',
        FieldConstructor: GoogleProtobufFileDescriptorProto,
        constraints: {},
      },
    ];

    // Initialize the fields
    this._file = new ARRAY<
      GoogleProtobufFileDescriptorProto,
      IGoogleProtobufFileDescriptorProto
    >(undefined, this, 'file');

    // Set required fields
    [].forEach(fieldName => {
      (
        this[fieldName as keyof FileDescriptorSet] as FieldNode
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
      (this[fieldName as keyof FileDescriptorSet] as FieldNode).__readonly =
        true;
    });

    this.__meta.isPristine = true;
  }

  public get file(): ARRAY<
    GoogleProtobufFileDescriptorProto,
    IGoogleProtobufFileDescriptorProto
  > {
    return this._file;
  }

  public set file(v: IGoogleProtobufFileDescriptorProto[]) {
    this.__TypeSetter(this._file, v);
  }

  fromLiteral(data: IFileDescriptorSet) {
    super.__fromLiteral(data);
  }

  toLiteral(): IFileDescriptorSet {
    return super.__toLiteral();
  }
}

Registry.register('google.protobuf.FileDescriptorSet', FileDescriptorSet);
