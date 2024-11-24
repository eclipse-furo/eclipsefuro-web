// import { hmrPlugin, presets } from '@open-wc/dev-server-hmr';

import rollupJson from "@rollup/plugin-json";
import {fromRollup, nodeResolve} from '@web/dev-server-rollup';

const json = fromRollup(rollupJson);
import rollupReplace from '@rollup/plugin-replace';

const replace = fromRollup(rollupReplace);

/** Use Hot Module replacement by adding --hmr to the start command */
const hmr = process.argv.includes('--hmr');

export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  open: '/',
  rootDir:'test/pages/',
  /** Use regular watch mode if HMR is not enabled. */
  watch: !hmr,
  preserveSymlinks: true,
  /** Resolve bare module imports */
  nodeResolve:true,

  /** Compile JS for older browsers. Requires @web/dev-server-esbuild plugin */
  // esbuildTarget: 'auto'

  /** Set appIndex to enable SPA routing */
  // appIndex: 'pagesee/index.html',

  // tell the server to serve json files as js
  mimeTypes: {
    '**/*.json': 'js',
    '**/*.module.css': 'js',
  },
  plugins: [
    replace({
      preventAssignment:true,
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    nodeResolve({
      exportConditions: ['default', 'module', 'import'],
      browser: true,
    }),
    json({exclude: ['/assets/manifest.json']})],
  middleware: [],

  // See documentation for all available options
});
