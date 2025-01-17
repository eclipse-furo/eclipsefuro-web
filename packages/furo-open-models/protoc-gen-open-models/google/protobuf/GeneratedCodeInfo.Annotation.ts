// Code generated by furo protoc-gen-open-models. DO NOT EDIT.
// protoc-gen-open-models version: ????

import {
  ARRAY,
  ENUM,
  FieldNode,
  INT32,
  Registry,
  STRING,
} from '@furo/open-models/dist/index';
import { GeneratedCodeInfoAnnotationSemantic as GoogleProtobufGeneratedCodeInfoAnnotationSemantic } from './GeneratedCodeInfo.Annotation.Semantic';

/**
 * @interface IGeneratedCodeInfoAnnotation
 */
export interface IGeneratedCodeInfoAnnotation {
  /**
   *  Represents the identified object's effect on the element in the original
   *  .proto file.
   */
  path?: number[];
  /**
   *  Identifies the filesystem path to the original source .proto.
   */
  sourceFile?: string;
  /**
   *  Identifies the starting offset in bytes in the generated code
   *  that relates to the identified object.
   */
  begin?: number;
  /**
   *  Identifies the ending offset in bytes in the generated code that
   *  relates to the identified object. The end offset should be one past
   *  the last relevant byte (so the length of the text = end - begin).
   */
  end?: number;
  semantic?: GoogleProtobufGeneratedCodeInfoAnnotationSemantic | string;
}

/**
 * @interface TGeneratedCodeInfoAnnotation
 */
export interface TGeneratedCodeInfoAnnotation {
  /**
   *  Represents the identified object's effect on the element in the original
   *  .proto file.
   */
  path?: number[];
  /**
   *  Identifies the filesystem path to the original source .proto.
   */
  source_file?: string;
  /**
   *  Identifies the starting offset in bytes in the generated code
   *  that relates to the identified object.
   */
  begin?: number;
  /**
   *  Identifies the ending offset in bytes in the generated code that
   *  relates to the identified object. The end offset should be one past
   *  the last relevant byte (so the length of the text = end - begin).
   */
  end?: number;
  semantic?: GoogleProtobufGeneratedCodeInfoAnnotationSemantic | string;
}

/**
 * GeneratedCodeInfoAnnotation
 */
export class GeneratedCodeInfoAnnotation extends FieldNode {
  //  Represents the identified object's effect on the element in the original
  //  .proto file.
  private _path: ARRAY<INT32, number>;

  //  Identifies the filesystem path to the original source .proto.
  private _sourceFile: STRING;

  //  Identifies the starting offset in bytes in the generated code
  //  that relates to the identified object.
  private _begin: INT32;

  //  Identifies the ending offset in bytes in the generated code that
  //  relates to the identified object. The end offset should be one past
  //  the last relevant byte (so the length of the text = end - begin).
  private _end: INT32;

  private _semantic: ENUM<GoogleProtobufGeneratedCodeInfoAnnotationSemantic>;

  public __defaultValues: IGeneratedCodeInfoAnnotation;

  constructor(
    initData?: IGeneratedCodeInfoAnnotation,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'google.protobuf.GeneratedCodeInfo.Annotation';

    this.__meta.nodeFields = [
      {
        fieldName: 'path',
        protoName: 'path',
        FieldConstructor: INT32,
        constraints: {},
      },
      {
        fieldName: 'sourceFile',
        protoName: 'source_file',
        FieldConstructor: STRING,
        constraints: {},
      },
      {
        fieldName: 'begin',
        protoName: 'begin',
        FieldConstructor: INT32,
        constraints: {},
      },
      {
        fieldName: 'end',
        protoName: 'end',
        FieldConstructor: INT32,
        constraints: {},
      },
      {
        fieldName: 'semantic',
        protoName: 'semantic',
        FieldConstructor:
          ENUM<GoogleProtobufGeneratedCodeInfoAnnotationSemantic>,
        constraints: {},
      },
    ];

    // Initialize the fields
    //  Represents the identified object's effect on the element in the original
    //  .proto file.
    this._path = new ARRAY<INT32, number>(undefined, this, 'path');

    //  Identifies the filesystem path to the original source .proto.
    this._sourceFile = new STRING(undefined, this, 'sourceFile');

    //  Identifies the starting offset in bytes in the generated code
    //  that relates to the identified object.
    this._begin = new INT32(undefined, this, 'begin');

    //  Identifies the ending offset in bytes in the generated code that
    //  relates to the identified object. The end offset should be one past
    //  the last relevant byte (so the length of the text = end - begin).
    this._end = new INT32(undefined, this, 'end');

    this._semantic =
      new ENUM<GoogleProtobufGeneratedCodeInfoAnnotationSemantic>(
        undefined,
        GoogleProtobufGeneratedCodeInfoAnnotationSemantic,
        GoogleProtobufGeneratedCodeInfoAnnotationSemantic.NONE,
        this,
        'semantic',
      );

    // Set required fields
    [].forEach(fieldName => {
      (
        this[fieldName as keyof GeneratedCodeInfoAnnotation] as FieldNode
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
      (
        this[fieldName as keyof GeneratedCodeInfoAnnotation] as FieldNode
      ).__readonly = true;
    });

    this.__meta.isPristine = true;
  }

  //  Represents the identified object's effect on the element in the original
  //  .proto file.
  public get path(): ARRAY<INT32, number> {
    return this._path;
  }

  public set path(v: number[]) {
    this.__TypeSetter(this._path, v);
  }

  //  Identifies the filesystem path to the original source .proto.
  public get sourceFile(): STRING {
    return this._sourceFile;
  }

  public set sourceFile(v: string) {
    this.__PrimitivesSetter(this._sourceFile, v);
  }

  //  Identifies the starting offset in bytes in the generated code
  //  that relates to the identified object.
  public get begin(): INT32 {
    return this._begin;
  }

  public set begin(v: number) {
    this.__PrimitivesSetter(this._begin, v);
  }

  //  Identifies the ending offset in bytes in the generated code that
  //  relates to the identified object. The end offset should be one past
  //  the last relevant byte (so the length of the text = end - begin).
  public get end(): INT32 {
    return this._end;
  }

  public set end(v: number) {
    this.__PrimitivesSetter(this._end, v);
  }

  public get semantic(): ENUM<GoogleProtobufGeneratedCodeInfoAnnotationSemantic> {
    return this._semantic;
  }

  public set semantic(v: GoogleProtobufGeneratedCodeInfoAnnotationSemantic) {
    this.__TypeSetter(this._semantic, v);
  }

  fromLiteral(data: IGeneratedCodeInfoAnnotation) {
    super.__fromLiteral(data);
  }

  toLiteral(): IGeneratedCodeInfoAnnotation {
    return super.__toLiteral();
  }
}

Registry.register(
  'google.protobuf.GeneratedCodeInfo.Annotation',
  GeneratedCodeInfoAnnotation,
);
