import { createTsEslintConfig } from "../../eslint-ts-base.config.mjs";

export default createTsEslintConfig({
  tsconfigPath: ["./tsconfig.eslint.json"],
});
