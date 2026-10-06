/**
 * The first value of a query param. `req.query` hands back an array when a key occurs more than
 * once (`?tag=a&tag=b`); a list endpoint only ever wants one value.
 */
export const first = (v: string | string[] | undefined): string => (Array.isArray(v) ? (v[0] ?? "") : (v ?? ""));

/**
 * Every value of a repeated query param. `first` collapses the array a repeated key arrives as; a
 * field mask wants all of them.
 *
 * A comma separated value is split too: a `google.protobuf.FieldMask` serializes to a single comma
 * joined string in json, and a hand written request may well spell it `?update_mask=a,b` rather
 * than repeating the key. Both mean the same thing, so the mock accepts either.
 */
export const all = (v: string | string[] | undefined): string[] =>
  (Array.isArray(v) ? v : v === undefined ? [] : [v]).flatMap((e) => e.split(",")).filter(Boolean);
