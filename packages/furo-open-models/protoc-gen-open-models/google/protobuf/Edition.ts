// Code generated by furo protoc-gen-open-models. DO NOT EDIT.
// protoc-gen-open-models version: ????

//  The full set of known editions.
export enum Edition {
  //  A placeholder for an unknown edition value.
  EDITION_UNKNOWN = 'EDITION_UNKNOWN',
  //  Legacy syntax "editions".  These pre-date editions, but behave much like
  //  distinct editions.  These can't be used to specify the edition of proto
  //  files, but feature definitions must supply proto2/proto3 defaults for
  //  backwards compatibility.
  EDITION_PROTO2 = 'EDITION_PROTO2',
  EDITION_PROTO3 = 'EDITION_PROTO3',
  //  Editions that have been released.  The specific values are arbitrary and
  //  should not be depended on, but they will always be time-ordered for easy
  //  comparison.
  EDITION_2023 = 'EDITION_2023',
  //  Placeholder editions for testing feature resolution.  These should not be
  //  used or relyed on outside of tests.
  EDITION_1_TEST_ONLY = 'EDITION_1_TEST_ONLY',
  EDITION_2_TEST_ONLY = 'EDITION_2_TEST_ONLY',
  EDITION_99997_TEST_ONLY = 'EDITION_99997_TEST_ONLY',
  EDITION_99998_TEST_ONLY = 'EDITION_99998_TEST_ONLY',
  EDITION_99999_TEST_ONLY = 'EDITION_99999_TEST_ONLY',
}
