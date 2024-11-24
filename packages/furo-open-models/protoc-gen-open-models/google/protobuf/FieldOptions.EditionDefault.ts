// Code generated by furo protoc-gen-open-models. DO NOT EDIT.
// protoc-gen-open-models version: ????

import {
  ENUM,
  FieldNode,
  Registry,
  STRING,
} from '@furo/open-models/dist/index';
import { Edition as GoogleProtobufEdition } from './Edition';

/**
 * @interface IFieldOptionsEditionDefault
 */
export interface IFieldOptionsEditionDefault {
  edition?: GoogleProtobufEdition | string;
  value?: string; //  Textproto value.
}

/**
 * @interface TFieldOptionsEditionDefault
 */
export interface TFieldOptionsEditionDefault {
  edition?: GoogleProtobufEdition | string;
  value?: string; //  Textproto value.
}

/**
 * FieldOptionsEditionDefault
 */
export class FieldOptionsEditionDefault extends FieldNode {
  private _edition: ENUM<GoogleProtobufEdition>;

  private _value: STRING; //  Textproto value.

  public __defaultValues: IFieldOptionsEditionDefault;

  constructor(
    initData?: IFieldOptionsEditionDefault,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'google.protobuf.FieldOptions.EditionDefault';

    this.__meta.nodeFields = [
      {
        fieldName: 'edition',
        protoName: 'edition',
        FieldConstructor: ENUM<GoogleProtobufEdition>,
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
    this._edition = new ENUM<GoogleProtobufEdition>(
      undefined,
      GoogleProtobufEdition,
      GoogleProtobufEdition.EDITION_UNKNOWN,
      this,
      'edition',
    );

    this._value = new STRING(undefined, this, 'value');

    // Set required fields
    [].forEach(fieldName => {
      (
        this[fieldName as keyof FieldOptionsEditionDefault] as FieldNode
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
        this[fieldName as keyof FieldOptionsEditionDefault] as FieldNode
      ).__readonly = true;
    });

    this.__meta.isPristine = true;
  }

  public get edition(): ENUM<GoogleProtobufEdition> {
    return this._edition;
  }

  public set edition(v: GoogleProtobufEdition) {
    this.__TypeSetter(this._edition, v);
  }

  public get value(): STRING {
    return this._value;
  }

  public set value(v: string) {
    this.__PrimitivesSetter(this._value, v);
  }

  fromLiteral(data: IFieldOptionsEditionDefault) {
    super.__fromLiteral(data);
  }

  toLiteral(): IFieldOptionsEditionDefault {
    return super.__toLiteral();
  }
}

Registry.register(
  'google.protobuf.FieldOptions.EditionDefault',
  FieldOptionsEditionDefault,
);
