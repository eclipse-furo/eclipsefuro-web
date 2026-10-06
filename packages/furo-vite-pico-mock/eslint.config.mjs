import js from "@eslint/js";
import importXPlugin from "eslint-plugin-import-x";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

// A node package, not a lit one, so it does not use ../../eslint-ts-base.config.mjs:
// no lit/wc rules, and the server itself is plain javascript that is linted too.
export default tseslint.config(
  // `**/` in front of every glob: lint-staged runs this config from the repo root
  { ignores: ["**/dist/**", "**/node_modules/**", "**/coverage/**", "**/*.d.ts"] },

  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  {
    files: ["**/{src,specs}/**/*.ts"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.node },
      parserOptions: { project: ["./tsconfig.json"], tsconfigRootDir: import.meta.dirname },
    },
    plugins: {
      "unused-imports": unusedImports,
      "import-x": importXPlugin,
    },
    rules: {
      "unused-imports/no-unused-imports": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_", destructuredArrayIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }],
      // verbatimModuleSyntax turns a mixed import into a side-effect import
      "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "separate-type-imports" }],
      "@typescript-eslint/no-import-type-side-effects": "error",
    },
  },

  {
    files: ["**/specs/**/*.spec.ts"],
    rules: {
      "import-x/no-extraneous-dependencies": ["error", { devDependencies: true }],
      // vitest's asymmetric matchers are typed `any`, so `expect.stringContaining(...)` inside an
      // object literal is an unsafe assignment by construction
      "@typescript-eslint/no-unsafe-assignment": "off",
    },
  },

  // The server itself is plain node javascript. There are no types for the type aware rules to read,
  // so those are switched off here rather than left to fail on every file.
  {
    files: ["**/src/**/*.js"],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.node },
    },
  }
);
