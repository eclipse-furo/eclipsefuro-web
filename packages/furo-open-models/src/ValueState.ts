/**
 * Different types of ValueStates.
 * @readonly
 * @enum {string}
 */
export enum ValueState {
  /**
   *
   * @public
   * @typeName {None}
   */
  None = 'None',

  /**
   *
   * @public
   * @typeName {Positive}
   */
  Positive = 'Positive',

  /**
   *
   * @public
   * @typeName {Critical}
   */
  Critical = 'Critical',

  /**
   *
   * @public
   * @typeName {Negative}
   */
  Negative = 'Negative',

  /**
   *
   * @public
   * @typeName {Information}
   */
  Information = 'Information',
}
