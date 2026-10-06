/**
 * The merge behind a PATCH, for any resource: the body is written into the stored message, either
 * the paths an `update_mask` names or, without a mask, everything the body carries.
 *
 * Every function here mutates the `base` it is handed and returns it, so hand it a clone and store
 * the result only once the merge went through.
 */

/** A json object, i.e. something to recurse into rather than to overwrite. */
export const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

/**
 * Writes the fields the patch carries into `base`, one level at a time.
 *
 * Nested messages are merged rather than replaced, so a body holding only
 * `{ cube: { height: 999 } }` keeps length, breadth, colour and material. Arrays and scalars
 * replace, a key the patch does not carry is left alone - that is what makes it a PATCH and not a
 * PUT. `base` is mutated, so hand it a clone.
 */
export const deepMerge = (base: Record<string, unknown>, patch: Record<string, unknown>): Record<string, unknown> => {
  Object.entries(patch).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }
    const current = base[key];
    base[key] = isObject(value) && isObject(current) ? deepMerge(current, value) : value;
  });
  return base;
};

/**
 * Writes exactly the fields the mask names, and nothing else.
 *
 * `google.protobuf.FieldMask` semantics: a masked path is set to what the request holds there, and
 * a masked path the request does not set is *cleared* - that is how a field is emptied at all. A
 * path may name a message (`cube.colour`), which then replaces it wholesale. `base` is mutated.
 */
export const applyMask = (base: Record<string, unknown>, patch: Record<string, unknown>, mask: string[]): Record<string, unknown> => {
  mask.forEach((path) => {
    const segments = path.split(".");
    const leaf = segments.pop();
    if (!leaf) {
      return;
    }

    // Walk both sides down to the parent of the leaf, creating it on the target as we go. A mask
    // reaching through a field the stored message does not have yet has to be able to land somewhere.
    let target = base;
    let source: unknown = patch;
    segments.forEach((segment) => {
      const next = target[segment];
      target = isObject(next) ? next : (target[segment] = {});
      source = isObject(source) ? source[segment] : undefined;
    });

    const value = isObject(source) ? source[leaf] : undefined;
    if (value === undefined) {
      // the mask names its paths at runtime, so a computed key is the whole mechanism here
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete target[leaf];
    } else {
      target[leaf] = value;
    }
  });
  return base;
};

/**
 * `applyMask` when the request names an `update_mask`, `deepMerge` when it does not. Read the mask
 * with `all(req.query.update_mask)`, which takes both the repeated and the comma separated form.
 */
export const mergePatch = (base: Record<string, unknown>, patch: Record<string, unknown>, mask: string[]): Record<string, unknown> =>
  mask.length ? applyMask(base, patch, mask) : deepMerge(base, patch);
