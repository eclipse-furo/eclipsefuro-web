/**
 * The plugin inside a real vite dev server: the mock answers the api and the login page, a
 * `server.proxy` entry keeps what it claims, and everything else stays vite's.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { createServer } from "vite";
import type { ViteDevServer } from "vite";
import { picoMock, proxied } from "../src/vite.js";

const write = (root: string, file: string, content: string): void => {
  mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
  writeFileSync(path.join(root, file), content);
};

describe("proxied", () => {
  it("matches a prefix and a ^regex the way vite does", () => {
    const proxy = { "/api/llm": {}, "^/api/openai/v1/.*": {} };

    expect(proxied("/api/llm/chat", proxy)).toBe(true);
    expect(proxied("/api/openai/v1/chat/completions", proxy)).toBe(true);
    expect(proxied("/api/v1/cubes", proxy)).toBe(false);
    expect(proxied("/api/v1/cubes", undefined)).toBe(false);
  });
});

describe("picoMock in a vite dev server", () => {
  let root: string;
  let server: ViteDevServer;
  let url: string;

  beforeAll(async () => {
    root = mkdtempSync(path.join(tmpdir(), "pico-mock-vite-"));
    write(root, "index.html", "<!doctype html><title>app</title>");
    write(root, "public/auth.html", "placeholder");
    write(root, "src/shared/answer.ts", "export const ANSWER = 42;");
    // imports through an alias of the vite config, which the module runner only knows because the
    // plugin hands it over
    write(root, "mock/data/answer/GET.ts", `import { ANSWER } from "@shared/answer";\nexport default { cases: [{ body: { answer: ANSWER } }] };`);

    server = await createServer({
      root,
      configFile: false,
      logLevel: "silent",
      resolve: { alias: { "@shared": "/src/shared" } },
      plugins: [picoMock()],
      server: {
        port: 0,
        // nothing listens there; a request the proxy claims fails with a 5xx rather than reaching the mock
        proxy: { "/api/claimed": { target: "http://127.0.0.1:9" } },
      },
    });
    await server.listen();
    url = `http://localhost:${(server.httpServer?.address() as AddressInfo).port}`;
  });

  afterAll(async () => {
    await server.close();
    rmSync(root, { recursive: true, force: true });
  });

  it("answers a fixture that imports through a config alias", async () => {
    const res = await fetch(`${url}/api/answer`);

    expect(await res.json()).toEqual({ answer: 42 });
  });

  it("serves the picker in place of the public/ placeholder", async () => {
    const html = await (await fetch(`${url}/auth.html`)).text();

    expect(html).toContain("pico-mock sign in");
  });

  it("leaves a path a proxy claims to the proxy", async () => {
    const res = await fetch(`${url}/api/claimed/x`);

    expect(res.headers.get("content-type") ?? "").not.toContain("application/json");
    expect(res.status).toBeGreaterThanOrEqual(500);
  });

  it("leaves the app to vite", async () => {
    const res = await fetch(`${url}/`);

    expect(await res.text()).toContain("<title>app</title>");
  });
});
