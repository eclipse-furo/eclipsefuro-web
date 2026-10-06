import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["specs/**/*.spec.ts"],
    environment: "node",
    coverage: {
      provider: "v8",
      include: ["src/**/*.{js,ts}"],
      exclude: ["src/types.ts"],
      reportsDirectory: "coverage/",
      reporter: ["text", "html"],
      thresholds: {
        statements: 80,
        branches: 77,
        functions: 78,
        lines: 80,
      },
    },
  },
});
