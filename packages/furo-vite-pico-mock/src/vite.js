/**
 * The vite plugin: mounts the mock into the dev server and the preview server.
 *
 * ```ts
 * import { picoMock } from "@furo/vite-pico-mock/vite";
 *
 * export default defineConfig({ plugins: [picoMock({ dir: "mock" })] });
 * ```
 *
 * The mock answers inside vite's own server rather than on a port of its own behind a proxy: no
 * second port to find, no proxy to keep in step with it, and a stream is written straight to the
 * browser's socket. It runs before vite's own middleware, so it wins over a placeholder
 * `public/auth.html` - but not over a `server.proxy` entry: a path a proxy claims, i.e. an LLM
 * server under `/api/openai/`, is left to the proxy even though it is under the api prefix.
 */

import path from "path";
import { createPicoMock, startPicoMock } from "./server.js";

/** @typedef {import('./types.js').PicoMockPluginOptions} PicoMockPluginOptions */
/** @typedef {{ find: string | RegExp, replacement: string }} Alias */

/**
 * vite's `resolve.alias` comes as an object or as an array; the module runner takes either, but
 * merging two needs one form.
 *
 * @param {unknown} aliases
 * @return {Alias[]}
 */
function aliasList(aliases) {
  if (!aliases) return [];
  if (Array.isArray(aliases)) return aliases;
  return Object.entries(aliases).map(([find, replacement]) => ({ find, replacement }));
}

/**
 * Whether one of vite's proxy entries claims a url, matched the way vite matches them: a key that
 * starts with `^` is a regular expression, any other one a prefix.
 *
 * @param {string} url
 * @param {Record<string, unknown> | undefined} proxy
 * @return {boolean}
 */
export function proxied(url, proxy) {
  return Object.keys(proxy ?? {}).some((context) => (context.startsWith("^") ? new RegExp(context).test(url) : url.startsWith(context)));
}

/**
 * @param {PicoMockPluginOptions} [options]
 * @return {import('vite').Plugin}
 */
export function picoMock(options = {}) {
  const { standalonePort, ...serverOptions } = options;

  /** @type {Alias[]} */
  let configAliases = [];
  /** @type {ReturnType<typeof createPicoMock> | undefined} */
  let mock;
  /** @type {import('vite').ResolvedConfig | undefined} */
  let resolved;

  /**
   * @param {import('vite').Connect.Server} middlewares
   * @param {Record<string, unknown> | undefined} proxy
   */
  function mount(middlewares, proxy) {
    mock = createPicoMock({
      ...serverOptions,
      root: serverOptions.root ?? resolved?.root,
      // the plugin's own aliases first, so they win over a same named one of the config
      aliases: [...aliasList(serverOptions.aliases), ...configAliases],
    });
    const handle = mock.callback();
    const handles = mock.handles;
    middlewares.use((req, res, next) => {
      const url = req.url ?? "/";
      if (!handles(url) || proxied(url, proxy)) {
        next();
        return;
      }
      handle(req, res).catch(next);
    });

    const { root, dataDir, apiPrefix } = mock.config;
    resolved?.logger.info(`  [pico-mock] serving ${path.relative(root, dataDir)} under ${apiPrefix}`, { timestamp: true });
  }

  /** Start the standalone listener, when one is asked for. A failure leaves vite running. */
  async function standalone() {
    if (standalonePort === undefined) return;
    try {
      await startPicoMock({
        ...serverOptions,
        root: serverOptions.root ?? resolved?.root,
        aliases: [...aliasList(serverOptions.aliases), ...configAliases],
        port: standalonePort,
      });
    } catch (err) {
      console.error("[pico-mock] the standalone server failed to start:", err);
    }
  }

  return {
    name: "vite-pico-mock",
    // A build serves nothing. `vite preview` runs as "serve" too, so this covers both servers.
    apply: "serve",

    config(config) {
      configAliases = aliasList(config.resolve?.alias);
    },

    configResolved(config) {
      resolved = config;
    },

    async configureServer(server) {
      mount(server.middlewares, server.config.server.proxy);
      await standalone();
    },

    async configurePreviewServer(server) {
      mount(server.middlewares, server.config.preview.proxy);
      await standalone();
    },
  };
}

export default picoMock;
