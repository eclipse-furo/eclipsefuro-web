// Code generated by furo protoc-gen-open-models. DO NOT EDIT.
// protoc-gen-open-models version: ????

import {
  ARRAY,
  BOOLEAN,
  FieldNode,
  Registry,
} from '@furo/open-models/dist/index';
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
 * @interface IServiceOptions
 */
export interface IServiceOptions {
  /**
   *  Any features defined in the specific edition.
   */
  features?: IGoogleProtobufFeatureSet;
  /**
   *  Is this service deprecated?
   *  Depending on the target platform, this can emit Deprecated annotations
   *  for the service, or it will be completely ignored; in the very least,
   *  this is a formalization for deprecating services.
   */
  deprecated?: boolean;
  /**
   *  The parser stores options it doesn't recognize here. See above.
   */
  uninterpretedOption?: IGoogleProtobufUninterpretedOption[];
}

/**
 * @interface TServiceOptions
 */
export interface TServiceOptions {
  /**
   *  Any features defined in the specific edition.
   */
  features?: TGoogleProtobufFeatureSet;
  /**
   *  Is this service deprecated?
   *  Depending on the target platform, this can emit Deprecated annotations
   *  for the service, or it will be completely ignored; in the very least,
   *  this is a formalization for deprecating services.
   */
  deprecated?: boolean;
  /**
   *  The parser stores options it doesn't recognize here. See above.
   */
  uninterpreted_option?: TGoogleProtobufUninterpretedOption[];
}

/**
 * ServiceOptions
 */
export class ServiceOptions extends FieldNode {
  //  Any features defined in the specific edition.
  private _features: GoogleProtobufFeatureSet;

  //  Is this service deprecated?
  //  Depending on the target platform, this can emit Deprecated annotations
  //  for the service, or it will be completely ignored; in the very least,
  //  this is a formalization for deprecating services.
  private _deprecated: BOOLEAN;

  //  The parser stores options it doesn't recognize here. See above.
  private _uninterpretedOption: ARRAY<
    GoogleProtobufUninterpretedOption,
    IGoogleProtobufUninterpretedOption
  >;

  public __defaultValues: IServiceOptions;

  constructor(
    initData?: IServiceOptions,
    parent?: FieldNode,
    parentAttributeName?: string,
  ) {
    super(undefined, parent, parentAttributeName);
    this.__meta.typeName = 'google.protobuf.ServiceOptions';

    this.__meta.nodeFields = [
      {
        fieldName: 'features',
        protoName: 'features',
        FieldConstructor: GoogleProtobufFeatureSet,
        constraints: {},
      },
      {
        fieldName: 'deprecated',
        protoName: 'deprecated',
        FieldConstructor: BOOLEAN,
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

    //  Is this service deprecated?
    //  Depending on the target platform, this can emit Deprecated annotations
    //  for the service, or it will be completely ignored; in the very least,
    //  this is a formalization for deprecating services.
    this._deprecated = new BOOLEAN(undefined, this, 'deprecated');

    //  The parser stores options it doesn't recognize here. See above.
    this._uninterpretedOption = new ARRAY<
      GoogleProtobufUninterpretedOption,
      IGoogleProtobufUninterpretedOption
    >(undefined, this, 'uninterpretedOption');

    // Set required fields
    [].forEach(fieldName => {
      (this[fieldName as keyof ServiceOptions] as FieldNode).__meta.required =
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
      (this[fieldName as keyof ServiceOptions] as FieldNode).__readonly = true;
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

  //  Is this service deprecated?
  //  Depending on the target platform, this can emit Deprecated annotations
  //  for the service, or it will be completely ignored; in the very least,
  //  this is a formalization for deprecating services.
  public get deprecated(): BOOLEAN {
    return this._deprecated;
  }

  public set deprecated(v: boolean) {
    this.__PrimitivesSetter(this._deprecated, v);
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

  fromLiteral(data: IServiceOptions) {
    super.__fromLiteral(data);
  }

  toLiteral(): IServiceOptions {
    return super.__toLiteral();
  }
}

Registry.register('google.protobuf.ServiceOptions', ServiceOptions);
