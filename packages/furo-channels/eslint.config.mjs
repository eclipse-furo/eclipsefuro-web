import { createTsEslintConfig } from "../../eslint-ts-base.config.mjs";

export default createTsEslintConfig({
  tsconfigPath: ["./tsconfig.eslint.json"],
  overrides: [
    {
      files: ["dev-playground/**/*.ts"],
      rules: {
        "import-x/extensions": "off",
        "import-x/order": "off",
        "import-x/no-extraneous-dependencies": "off",
      },
    },
    {
      files: ["src/models/**/*.ts"],
      rules: {
        "no-use-before-define": "off",
        "import-x/no-cycle": "off",
        "import-x/order": "off",
      },
    },
    {
      files: ["src/JSX/Link.ts"],
      rules: {
        "import-x/extensions": "off",
        "@typescript-eslint/no-explicit-any": "off",
      },
    },
  ],
});
