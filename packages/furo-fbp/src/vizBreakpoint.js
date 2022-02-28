/**
 * eslint-disable-file
 *
 * This is a breakpoint, added by viz.
 *
 */

export class VizBreakpoint {
  static breakpoint(tagname, wire) {
    return window._viz.flat[tagname.toUpperCase()]._FBPAddWireHook(
      wire,
      wiredata => {
        tagname; // eslint-disable-line
        wire; // eslint-disable-line
        wiredata; // eslint-disable-line
        const node = window._viz.flat[tagname.toUpperCase()]; // eslint-disable-line
        const targets = node.__wirebundle[wire];// eslint-disable-line
        debugger; // eslint-disable-line
      },
      true
    );
  }
  
}
