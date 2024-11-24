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
   * @typeName {Information}
   */
  Information = 'Information',

  /**
   *
   * @public
   * @typeName {Success}
   */
  Success = 'Success',

  /**
   *
   * @public
   * @typeName {Warning}
   */
  Warning = 'Warning',

  /**
   *
   * @public
   * @typeName {Error}
   */
  Error = 'Error',
}
