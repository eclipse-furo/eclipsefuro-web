import {defineConfig} from "vite";
import {playwright} from "@vitest/browser-playwright";

export default defineConfig({
  resolve: {
    alias: {
      "@furo/open-models/dist": new URL("./src", import.meta.url).pathname,
      "@furo/open-models": new URL("./src/index.ts", import.meta.url).pathname,
      "@": "/src",
    },
  },
  server: {
    port: 8080,
  },
  test: {
    globals: true,
    screenshotFailures:false,
    passWithNoTests: true,
    testTimeout: 5000,
    include: ["test/unit_tests/**/*.test.ts"],
    browser: {
      enabled: true,
      provider: playwright({
        launchOptions: {
          args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
        },
      }),
      headless: true,
      instances: [{browser: "chromium"}],
    },
    reporters: ["verbose"],

    coverage: {
      include: ["src/**/*.{ts,tsx}"],
      enabled: true,
      thresholds: {
        statements: 39,
        branches: 34,
        functions: 41,
        lines: 39,
      },
      provider: "istanbul",
      reportsDirectory: "coverage/",
      reporter: ["html"],
      reportOnFailure: false,
    },
    onConsoleLog(log, type) {
      if (type === "stderr" && log.includes("in dev mode")) {
        return false;
      }
    },
  },
});
