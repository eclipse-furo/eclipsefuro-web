/**
 * pico-mock's router - maps a request path onto a fixture file under the data directory.
 *
 * It is a factory rather than a module of free functions so the roots are arguments: the server
 * passes the configured `dataDir`, a spec passes a tree it built in a temp directory.
 */

import { existsSync, readdirSync, realpathSync, statSync } from "fs";
import path from "path";

/**
 * The outcome of resolving a request path against `data/`.
 *
 * @typedef {{ file: string, params: Record<string, string>, customMethod?: string }} Route
 */

/**
 * Find the `{name}` directory of a level. More than one is ambiguous - which one would win depends
 * on the readdir order, so refuse instead of guessing.
 *
 * @param {string} dir - Directory to look in.
 * @return {{ dirName: string, paramName: string } | undefined}
 */
function templateDirOf(dir) {
  const templates = readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && /^\{.+\}$/.test(e.name))
    .map((e) => ({ dirName: e.name, paramName: e.name.slice(1, -1) }));

  if (templates.length > 1) {
    const names = templates.map((t) => t.dirName).join(", ");
    throw new Error(`[pico-mock] ${dir} has more than one template directory: ${names}`);
  }
  return templates[0];
}

/**
 * @param {string} dir
 * @param {string} name
 * @return {boolean}
 */
function isDirectory(dir, name) {
  const full = path.join(dir, name);
  return existsSync(full) && statSync(full).isDirectory();
}

/**
 * Percent decode a segment, leaving it as it is when it is not valid encoding.
 *
 * @param {string} segment
 * @return {string}
 */
function decodeSegment(segment) {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

/**
 * Walk the remaining segments, literal directory first, `{template}` second.
 *
 * It **backtracks**: if the literal branch has no fixture for this method, the template branch is
 * tried anyway. That is what lets `2/GET.ts` override `{cube_id}/GET.ts` for cube 2 while
 * `PATCH /v1/cubes/2` still lands on `{cube_id}/PATCH.ts` - the override is per method, not per id.
 *
 * @param {string} dir - Directory reached so far.
 * @param {string[]} segments - Raw, still encoded path segments.
 * @param {number} i - Index of the segment to match next.
 * @param {string} fileName - The file to look for once the segments run out.
 * @param {Record<string, string>} params - Template values captured so far.
 * @return {{ file: string, params: Record<string, string> } | undefined}
 */
function matchSegments(dir, segments, i, fileName, params) {
  if (i === segments.length) {
    const file = path.join(dir, fileName);
    return existsSync(file) && statSync(file).isFile() ? { file, params } : undefined;
  }

  const segment = /** @type {string} */ (segments[i]);

  if (isDirectory(dir, segment)) {
    const hit = matchSegments(path.join(dir, segment), segments, i + 1, fileName, params);
    if (hit) return hit;
  }

  const template = templateDirOf(dir);
  if (template) {
    return matchSegments(path.join(dir, template.dirName), segments, i + 1, fileName, {
      ...params,
      [template.paramName]: decodeSegment(segment),
    });
  }

  return undefined;
}

/**
 * The directory a request got closest to, used to build a helpful 404.
 *
 * @param {string} dir
 * @param {string[]} segments
 * @param {number} i
 * @return {string}
 */
function deepestDir(dir, segments, i) {
  if (i === segments.length) return dir;
  const segment = /** @type {string} */ (segments[i]);
  if (isDirectory(dir, segment)) return deepestDir(path.join(dir, segment), segments, i + 1);
  const template = templateDirOf(dir);
  if (template) return deepestDir(path.join(dir, template.dirName), segments, i + 1);
  return dir;
}

/**
 * Build a router over one fixture tree.
 *
 * @param {{ dataDir: string, baseDir?: string, apiPrefix?: string }} roots - `dataDir` is the tree
 *   to serve from; `baseDir` is only what the 404 message makes its paths relative to, and defaults
 *   to `dataDir`. `apiPrefix` is the part of the url path that is not part of the tree, `/api/` by
 *   default.
 * @return {{ resolveRoute: (urlPath: string, method: string) => Route | { notFound: string } }}
 */
export function createRouter({ dataDir, baseDir = dataDir, apiPrefix = "/api/" }) {
  // The same directory with every symlink resolved, so a route can prove it stayed inside it.
  const dataRoot = existsSync(dataDir) ? realpathSync(dataDir) : dataDir;

  /**
   * Map a request onto a fixture file.
   *
   * The path mirrors the url, minus the `apiPrefix` - for a gRPC transcoded api that is the
   * `google.api.http` rule of the rpc. Query params never take part - that is the whole point of the
   * middleware.
   *
   * @param {string} urlPath - `ctx.path`, i.e. `/api/v1/cubes/1`. Not percent decoded.
   * @param {string} method - Uppercase http method.
   * @return {Route | { notFound: string }}
   */
  function resolveRoute(urlPath, method) {
    const segments = urlPath
      .slice(apiPrefix.length)
      .split("/")
      .filter((s) => s !== "");

    // `ctx.path` arrives as it was sent - koa does not normalize it - so a `..` segment would walk
    // out of the data directory, and whatever matched out there would be *executed* by runnerImport. Nothing
    // above it is ours to serve.
    if (segments.some((s) => s === "." || s === "..")) {
      return { notFound: 'A "." or ".." segment is not routable.' };
    }

    // A custom method rides on the last segment: /v1/cubes:search -> [v1, cubes] + "search"
    let customMethod;
    if (segments.length > 0) {
      const last = /** @type {string} */ (segments[segments.length - 1]);
      const colon = last.lastIndexOf(":");
      // `> 0`, so a segment that *is* ":foo" is not mistaken for a custom method on an empty one.
      if (colon > 0) {
        customMethod = last.slice(colon + 1);
        segments[segments.length - 1] = last.slice(0, colon);
      }
    }

    const fileName = customMethod ? `${customMethod}.${method}.ts` : `${method}.ts`;
    if (!existsSync(dataDir)) {
      const wanted = path.relative(baseDir, path.join(dataDir, ...segments, fileName));
      return { notFound: `Create ${wanted}; there is no ${path.relative(baseDir, dataDir) || dataDir} yet.` };
    }

    const hit = matchSegments(dataDir, segments, 0, fileName, {});
    if (hit) {
      // Belt and braces: the guard above stops a `..` from leaving the tree, this stops a symlink from
      // doing it. The file is about to be executed, so it has to be one of ours.
      if (!realpathSync(hit.file).startsWith(dataRoot + path.sep)) {
        return { notFound: `${path.relative(baseDir, hit.file)} resolves outside ${path.relative(baseDir, dataDir) || "the data directory"}.` };
      }
      return { file: hit.file, params: hit.params, customMethod };
    }

    // Nothing matched. Name the file to create, then say how far the path actually got and what
    // lives there - that is usually enough to spot a typo or a missing {template} directory.
    const wanted = path.relative(baseDir, path.join(dataDir, ...segments, fileName));
    const reached = deepestDir(dataDir, segments, 0);
    const here = path.relative(baseDir, reached);
    const siblings = readdirSync(reached, { withFileTypes: true })
      .filter((e) => e.isFile() && e.name.endsWith(".ts") && !e.name.startsWith("_"))
      .map((e) => e.name);
    const has = siblings.length ? `, which has: ${siblings.join(", ")}` : ", which has no fixtures";
    return { notFound: `Create ${wanted}. The path got as far as ${here}/${has}.` };
  }

  return { resolveRoute };
}
