import { createTsEslintConfig } from "../../eslint-ts-base.config.mjs";

export default createTsEslintConfig({
  tsconfigPath: ["./tsconfig.eslint.json"],
  ignores: [
    "src/generated/**",
    "src/wc-type-renderer/**",
    "src/models/**",
    "src/x/models/**",
    "lib/**",
    "web-dev-server.config.mjs",
    "web-test-runner.config.mjs",
  ],
  overrides: [
    {
      files: ["**/*.ts"],
      rules: {
        "lit/no-classfield-shadowing": "warn",
        "lit/quoted-expressions": "off",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": ["error"],
        "no-use-before-define": "off",
        "import-x/order": "off",
        "import-x/first": "off",
        "import-x/newline-after-import": "off",
        "unused-imports/no-unused-imports": "off",
        "import-x/extensions": [
          "error",
          "ignorePackages",
          {
            "": "never",
            js: "never",
            jsx: "never",
            ts: "never",
            tsx: "never",
          },
        ],
      },
    },
    {
      files: ["**/*.ts"],
      rules: {
        "require-jsdoc": "off",
        "import-x/extensions": "off",
        "import-x/no-extraneous-dependencies": ["error", { devDependencies: true }],
      },
    },
  ],
});
