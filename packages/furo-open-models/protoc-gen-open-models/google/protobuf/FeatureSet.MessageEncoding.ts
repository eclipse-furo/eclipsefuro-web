// Code generated by furo protoc-gen-open-models. DO NOT EDIT.
// protoc-gen-open-models version: ????

//  TODO Enums in C++ gencode (and potentially other languages) are
//  not well scoped.  This means that each of the feature enums below can clash
//  with each other.  The short names we've chosen maximize call-site
//  readability, but leave us very open to this scenario.  A future feature will
//  be designed and implemented to handle this, hopefully before we ever hit a
//  conflict here.
export enum FeatureSetMessageEncoding {
  MESSAGE_ENCODING_UNKNOWN = 'MESSAGE_ENCODING_UNKNOWN',
  LENGTH_PREFIXED = 'LENGTH_PREFIXED',
  DELIMITED = 'DELIMITED',
}
