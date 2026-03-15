import js from "@eslint/js";
import importXPlugin from "eslint-plugin-import-x";
import litPlugin from "eslint-plugin-lit";
import litA11yPlugin from "eslint-plugin-lit-a11y";
import unusedImports from "eslint-plugin-unused-imports";
import wcPlugin from "eslint-plugin-wc";
import globals from "globals";
import tseslint from "typescript-eslint";

/**
 * Creates a flat ESLint config array for TS packages.
 *
 * @param {object} options
 * @param {string[]} options.tsconfigPath - Path(s) to tsconfig for type-checked rules
 * @param {string[]} [options.ignores] - Additional ignore patterns
 * @param {import("eslint").Linter.Config[]} [options.overrides] - Extra config objects appended at the end
 */
export function createTsEslintConfig({ tsconfigPath, ignores = [], overrides = [] }) {
  return tseslint.config(
    {
      ignores: [
        "**/dist/**",
        "**/node_modules/**",
        "**/*.js",
        "**/*.d.ts",
        "**/stories/**",
        ...ignores,
      ],
    },

    js.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    litPlugin.configs["flat/all"],
    wcPlugin.configs["flat/best-practice"],

    {
      files: ["**/*.ts", "**/*.tsx"],
      languageOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        globals: { ...globals.browser, ...globals.node, ...globals.mocha },
        parserOptions: {
          project: tsconfigPath,
        },
      },
      plugins: {
        "import-x": importXPlugin,
        "lit-a11y": litA11yPlugin,
        "unused-imports": unusedImports,
      },
      settings: {
        wc: {
          elementBaseClasses: ["LitElement", "LitFBP"],
        },
      },
      rules: {
        // lit-a11y
        ...litA11yPlugin.configs.recommended.rules,

        // unused imports
        "unused-imports/no-unused-imports": "error",

        // lit
        "lit/quoted-expressions": ["error", "always"],

        // import ordering (replaces simple-import-sort)
        "import-x/order": [
          "error",
          {
            groups: [
              ["builtin", "external"],
              ["internal", "parent", "index"],
              ["sibling"],
            ],
            "newlines-between": "always",
            alphabetize: { order: "asc", caseInsensitive: true },
          },
        ],
        "import-x/first": "error",
        "import-x/newline-after-import": "error",
        "import-x/no-duplicates": "error",
        "import-x/no-unresolved": "off",
        "import-x/extensions": [
          "error",
          "ignorePackages",
          {
            "": "never",
            js: "always",
            jsx: "never",
            ts: "never",
            tsx: "never",
          },
        ],

        // class-methods-use-this with Lit lifecycle exceptions
        "class-methods-use-this": ["error", {
          exceptMethods: [
            "connectedCallback", "disconnectedCallback",
            "performUpdate", "shouldUpdate", "firstUpdated",
            "update", "updated", "createRenderRoot", "render",
          ],
        }],

        // shadow
        "no-shadow": "off",
        "@typescript-eslint/no-shadow": "warn",

        // style
        "no-multiple-empty-lines": ["error", { max: 1 }],
        "max-classes-per-file": ["error", { ignoreExpressions: true, max: 2 }],
        "no-prototype-builtins": "off",
        "wc/guard-super-call": "off",

        // typescript
        "@typescript-eslint/no-namespace": "off",
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-empty-object-type": "off",
        "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      },
    },

    // JSX file overrides
    {
      files: ["**/JSX/**/*.ts", "**/JSX/**/*.tsx"],
      rules: {
        "require-jsdoc": "off",
        "import-x/extensions": "off",
        "import-x/no-duplicates": "off",
      },
    },

    // Test file overrides
    {
      files: ["**/test/**/*.ts", "**/test/**/*.tsx"],
      rules: {
        "require-jsdoc": "off",
        "import-x/extensions": "off",
      },
    },

    ...overrides,
  );
}
