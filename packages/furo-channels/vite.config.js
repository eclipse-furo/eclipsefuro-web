import {defineConfig} from 'vite';
import {playwright} from '@vitest/browser-playwright';



export default defineConfig({
  resolve: {
    alias: {
      "@": "/src"
    },
  },
  // root:"./dev-playground",
  server: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:7070/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        headers: {
          'api-base-url': '/api',
        },
      },
    },
  },
  test: {
    testTimeout:5000,
    include: ["test/**/*.spec.ts"],
    // Lit recommends using browser environment for testing
    // https://lit.dev/docs/tools/testing/#testing-in-the-browser
    browser: {
      enabled: true,
      provider: playwright({
        launchOptions: {
          slowMo: 100,
          devtools: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
        },
      }),
      headless: true,
      instances: [
        { browser: "chromium" },
      ],
      viewport: {
        width: 1280,
        height: 720,
      },
      screenshotFailures: true,

    },
    reporters: ["verbose","junit"], // Enable the JUnit reporter "html",
    outputFile: {
      junit: "test-results/junit.xml", // Specify the output file for the JUnit report
    },
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      enabled: false, // Enable coverage reporting
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
      provider: "istanbul", // Specify the coverage provider (e.g., 'v8' or 'istanbul')
      reporter: ["text", "json-summary", "lcov", "html"], // Specify desired coverage reporters
      // You can also add a 'lcov' or 'clover' reporter for tools like SonarQube
      // reporter: ['text', 'json-summary', 'html', 'lcov', 'clover'],
      reportOnFailure: true, // Generate coverage reports even if tests fail
    },

    onConsoleLog(log, type) {
      if (type === 'stderr' && log.includes('in dev mode')) {
        return false;
      }
    },
  },

});


