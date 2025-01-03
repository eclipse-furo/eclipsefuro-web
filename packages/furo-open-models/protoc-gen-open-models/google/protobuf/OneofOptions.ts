// Code generated by furo protoc-gen-open-models. DO NOT EDIT.
// protoc-gen-open-models version: ????

import { ARRAY, FieldNode, Registry } from '@furo/open-models/dist/index';
import {
  FeatureSet as GoogleProtobufFeatureSet,
  IFeatureSet as IGoogleProtobufFeatureSet,
  TFeatureSet as TGoogleProtobufFeatureSet,
} from './FeatureSet';

import {
  IUninterpretedOption as IGoogleProtobufUninterpretedOption,
  TUninterpretedOption as TGoogleProtobufUninterpretedOption,
  UninterpretedOption as GoogleProtobufUninterpretedOption,
} from './UninterpretedOption';

/**
 * @interface IOneofOptions
 */
export interface IOneofOptions {
  /**
   *  Any features defined in the specific edition.
   */
  features?: IGoogleProtobufFeatureSet;
  /**
   *  The parser stores options it doesn't recognize here. See above.
   */
  uninterpretedOption?: IGoogleProtobufUninterpretedOption[];
}

/**
 * @interface TOneofOptions
 */
export interface TOneofOptions {
  /**
   *  Any features defined in the specific edition.
   */
  features?: TGoogleProtobufFeatureSet;
  /**
   *  The parser stores options it doesn't recognize here. See above.
   */
  uninterpreted_option?: TGoogleProtobufUninterpretedOption[];
}

/**
 * OneofOptions
 */
export class OneofOptions extends FieldNode {
  //  Any features defined in the specific edition.
  private _features: GoogleProtobufFeatureSet;

  //  The parser stores options it doesn't recognize here. See above.
  private _uninterpretedOption: ARRAY<
    GoogleProtobufUninterpretedOption,
    IGoogleProtobufUninterpretedOption
  >;

  public __defaultValues: IOneofOptions;

  constructor(
    initData?: IOneofOptions,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'google.protobuf.OneofOptions';

    this.__meta.nodeFields = [
      {
        fieldName: 'features',
        protoName: 'features',
        FieldConstructor: GoogleProtobufFeatureSet,
        constraints: {},
      },
      {
        fieldName: 'uninterpretedOption',
        protoName: 'uninterpreted_option',
        FieldConstructor: GoogleProtobufUninterpretedOption,
        constraints: {},
      },
    ];

    // Initialize the fields
    //  Any features defined in the specific edition.
    this._features = new GoogleProtobufFeatureSet(undefined, this, 'features');

    //  The parser stores options it doesn't recognize here. See above.
    this._uninterpretedOption = new ARRAY<
      GoogleProtobufUninterpretedOption,
      IGoogleProtobufUninterpretedOption
    >(undefined, this, 'uninterpretedOption');

    // Set required fields
    [].forEach(fieldName => {
      (this[fieldName as keyof OneofOptions] as FieldNode).__meta.required =
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
      (this[fieldName as keyof OneofOptions] as FieldNode).__readonly = true;
    });

    this.__meta.isPristine = true;
  }

  //  Any features defined in the specific edition.
  public get features(): GoogleProtobufFeatureSet {
    return this._features;
  }

  public set features(v: IGoogleProtobufFeatureSet) {
    this.__TypeSetter(this._features, v);
  }

  //  The parser stores options it doesn't recognize here. See above.
  public get uninterpretedOption(): ARRAY<
    GoogleProtobufUninterpretedOption,
    IGoogleProtobufUninterpretedOption
  > {
    return this._uninterpretedOption;
  }

  public set uninterpretedOption(v: IGoogleProtobufUninterpretedOption[]) {
    this.__TypeSetter(this._uninterpretedOption, v);
  }

  fromLiteral(data: IOneofOptions) {
    super.__fromLiteral(data);
  }

  toLiteral(): IOneofOptions {
    return super.__toLiteral();
  }
}

Registry.register('google.protobuf.OneofOptions', OneofOptions);
