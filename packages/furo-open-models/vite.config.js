import {defineConfig} from "vite";
import {playwright} from "@vitest/browser-playwright";

export default defineConfig({
  resolve: {
    alias: {
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
    reporters: ["verbose", "junit"],
    outputFile: {
      junit: "test-results/junit.xml",
    },
    coverage: {
      include: ["src/**/*.{ts,tsx}"],
      enabled: false,
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
      provider: "istanbul",
      reportsDirectory: "coverage/",
      reporter: ["text", "json-summary", "lcov", "html"],
      reportOnFailure: true,
    },
    onConsoleLog(log, type) {
      if (type === "stderr" && log.includes("in dev mode")) {
        return false;
      }
    },
  },
});
