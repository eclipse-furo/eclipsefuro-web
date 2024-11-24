import { playwrightLauncher } from '@web/test-runner-playwright';
import { defaultReporter } from "@web/test-runner";
import { junitReporter } from "@web/test-runner-junit-reporter";
import rollupJson from "@rollup/plugin-json";
import { fromRollup } from "@web/dev-server-rollup";

const json = fromRollup(rollupJson);

const filteredLogs = ["Running in dev mode", "lit-html is in dev mode"];

export default /** @type {import("@web/test-runner").TestRunnerConfig} */ ({
  /** Test files to run */
  files: 'test/.unit_tests/**/*.test.js',
  preserveSymlinks: false, //!! disable this, to have test coverage ??
  /** Resolve bare module imports */
  nodeResolve: {
    exportConditions: ['default', 'module', 'import'],
    browser: true,
  },

  /** Filter out lit dev mode logs */
  filterBrowserLogs(log) {
    for (const arg of log.args) {
      if (typeof arg === 'string' && filteredLogs.some(l => arg.includes(l))) {
        return false;
      }
    }
    return true;
  },

  /** Compile JS for older browsers. Requires @web/dev-server-esbuild plugin */
  // esbuildTarget: 'auto',

  /** Amount of browsers to run concurrently */
  // concurrentBrowsers: 2,

  /** Amount of test files per browser to test concurrently */
  // concurrency: 1,

  /** Browsers to run tests on */
  browsers: [
    playwrightLauncher({ product: "chromium" }),
  //  playwrightLauncher({ product: "firefox" }),
  //   playwrightLauncher({ product: 'webkit' }),
    ],
  reporters: [
    // use the default reporter only for reporting test progress
    defaultReporter({ reportTestResults: true, reportTestProgress: true }),
    // use another reporter to report test results
    junitReporter({
      outputPath: "./coverage/test-results.xml", // default `'./test-results.xml'`
      reportLogs: true // default `false`
    })
  ],
  // tell the server to serve json files as js
  mimeTypes: {
    "**/*.json": "js",
    "**/*.module.css": "js"
  },
  plugins: [json({ exclude: ["/assets/manifest.json"] })],

  // See documentation for all available options
});
