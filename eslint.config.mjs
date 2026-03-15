import js from "@eslint/js";
import importXPlugin from "eslint-plugin-import-x";
import litPlugin from "eslint-plugin-lit";
import litA11yPlugin from "eslint-plugin-lit-a11y";
import wcPlugin from "eslint-plugin-wc";
import globals from "globals";

export default [
  { ignores: ["**/dist/**", "**/node_modules/**", "packages/**/test/**/*.js", "**/*.test.js"] },

  js.configs.recommended,
  litPlugin.configs["flat/recommended"],
  wcPlugin.configs["flat/best-practice"],

  {
    files: ["packages/furo-{fbp,framework,data,util}/**/src/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.browser, assert: "writable" },
    },
    plugins: { "import-x": importXPlugin, "lit-a11y": litA11yPlugin },
    rules: {
      ...litA11yPlugin.configs.recommended.rules,
      "import-x/no-cycle": "warn",
      "import-x/no-extraneous-dependencies": ["error", { devDependencies: true, optionalDependencies: true, peerDependencies: true }],
      "import-x/extensions": ["error", "always", { ignorePackages: true }],
      "class-methods-use-this": ["error", {
        exceptMethods: ["connectedCallback", "disconnectedCallback", "performUpdate", "shouldUpdate", "firstUpdated", "update", "updated", "createRenderRoot", "render"],
      }],
      "no-restricted-syntax": ["error",
        { selector: "ForInStatement", message: "for..in loops iterate over the entire prototype chain." },
        { selector: "LabeledStatement", message: "Labels are a form of GOTO." },
        { selector: "WithStatement", message: "`with` is disallowed in strict mode." },
      ],
      "no-underscore-dangle": "off",
      "no-prototype-builtins": "off",
      "wc/guard-super-call": "off",
    },
  },
];
