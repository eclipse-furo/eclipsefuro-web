// The constraints are quite similar to https://swagger.io/docs/specification/data-models/data-types/

export interface FieldConstraints {
  // NUMERIC CONSTRAINTS
  /**
   * Use the multipleOf keyword to specify that a number must be the multiple of another number
   */
  multiple_of?: number | undefined;
  /**
   * Use the minimum and maximum keywords to specify the range of possible values. "<=" is used to check.
   */
  maximum?: number | undefined;
  /**
   * Use the minimum and maximum keywords to specify the range of possible values. ">=" is used to check.
   */
  minimum?: number | undefined;
  /**
   * makes maximum using < instead of <=
   */
  exclusive_maximum?: boolean | undefined;
  /**
   * makes minimum using < instead of >=
   */
  exclusive_minimum?: boolean | undefined;

  // STRING CONSTRAINTS

  /**
   * String length can be restricted using minLength and maxLength. "<" is used to check.
   */
  max_length?: number | undefined;

  /**
   * String length can be restricted using minLength and maxLength. ">" is used to check.
   */
  min_length?: number | undefined;
  /**
   * The pattern keyword lets you define a regular expression template for the string value.
   */
  pattern?: string | undefined;

  // ARRAY CONSTRAINTS

  /**
   * Array size can be restricted using min_items and max_items.  "<=" is used to check.
   */
  max_items?: number | undefined;
  /**
   * Array size can be restricted using min_items and max_items.  ">=" is used to check.
   */
  min_items?: number | undefined;
  /**
   * You can use uniqueItems: true to specify that all items in the array must be unique. ?? Set ??
   */
  unique_items?: boolean | undefined;
  /**
   * Use this to negate a constraint.
   *
   * {not:{max_items:4,min_items:4}} or not:{multiple_of:7}
   */
  not?: FieldConstraints | undefined;
  /**
   * Required
   */
  required?: boolean | undefined;
  /**
   * Readonly
   */
  read_only?: boolean | undefined;
}
