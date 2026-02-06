/**
 * Defines background designs.
 *
 * @readonly
 * @enum {string}
 * @public
 */
enum BackgroundDesign {
  /**
   * A solid background color dependent on the theme.
   */
  Solid = "Solid",
  /**
   * Transparent background.
   */
  Transparent = "Transparent",
  /**
   * A translucent background depending on the opacity value of the theme.
   */
  Translucent = "Translucent"
}

export {BackgroundDesign};
