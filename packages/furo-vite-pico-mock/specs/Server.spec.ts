/**
 * The whole server over http: a fixture tree in a temp directory, the koa app on a port of its own,
 * real requests against it. What the other specs pin down module by module, this one checks is
 * wired together - routing, the case envelope, sequences, the gateway, api keys, the error body and
 * the push into a stream.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { createPicoMock } from "../src/server.js";
import type { PicoMockOptions } from "../src/types.js";

const write = (root: string, file: string, content: string): void => {
  mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
  writeFileSync(path.join(root, file), content);
};

/** A project with a handful of fixtures, users and keys, under `mock/` the way the defaults expect. */
function project(): string {
  const root = mkdtempSync(path.join(tmpdir(), "pico-mock-server-"));
  write(root, "mock/data/v1/things/GET.ts", `export default { cases: [{ body: { things: ["a", "b"] }, headers: [{ "X-Fixture": "list" }] }] };`);
  write(
    root,
    "mock/data/v1/things/{thing_id}/GET.ts",
    `export default { cases: [{ body: {}, middleware: [(res, req) => { res.body = { id: req.params.thing_id, q: req.query.q ?? null }; }] }] };`
  );
  write(root, "mock/data/v1/flaky/GET.ts", `export default { sequence: [0, 0, 1], cases: [{ body: { ok: true } }, { status: 503, body: { ok: false } }] };`);
  write(
    root,
    "mock/data/v1/private/GET.ts",
    `export default { auth: "required", cases: [{ body: {}, middleware: [(res, req) => { res.body = { user: req.user?.key, via: req.user?.via }; }] }] };`
  );
  write(root, "mock/data/v1/admin/GET.ts", `export default { auth: { roles: ["admin"] }, cases: [{ body: { secret: 42 } }] };`);
  write(
    root,
    "mock/data/v1/things/POST.ts",
    `export default { cases: [{ status: 201, body: {}, middleware: [(res, req) => { res.body = req.body; res.notify("thing_created", req.body); }] }] };`
  );
  write(
    root,
    "mock/data/v1/things/watch.GET.ts",
    `export default { cases: [{ contentType: "application/x-ndjson", stream: { map: (name, payload) => (name ? { [name]: payload } : undefined), open: (send) => send({ hello: true }) } }] };`
  );
  write(root, "mock/data/v1/broken/GET.ts", `export default { cases: [{ middleware: [() => { throw new Error("boom"); }] }] };`);
  write(
    root,
    "mock/auth/users.ts",
    `const claims = (name, roles) => ({ sub: name, preferred_username: name, name, given_name: name, family_name: name, email: name + "@example.com", roles, features: [] });
export const USERS = [
  { key: "alice", claims: claims("alice", ["user", "admin"]) },
  { key: "bob", claims: claims("bob", ["user"]) },
  { key: "robot", kind: "service", claims: claims("robot", ["user"]) },
];`
  );
  write(root, "mock/auth/apiKeys.ts", `export const API_KEYS = [{ token: "key-robot", user: "robot", label: "robot key" }];`);
  return root;
}

async function serve(options: PicoMockOptions): Promise<{ server: Server; url: string }> {
  const handle = createPicoMock(options).callback();
  const server = createServer((req, res) => {
    void handle(req, res);
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  return { server, url: `http://127.0.0.1:${(server.address() as AddressInfo).port}` };
}

/** The `name=value` of the session cookie a login sets. */
const cookieOf = (res: Response): string => (res.headers.get("set-cookie") ?? "").split(";")[0] ?? "";

describe("createPicoMock over http", () => {
  let root: string;
  let server: Server;
  let url: string;

  beforeAll(async () => {
    root = project();
    ({ server, url } = await serve({ root }));
  });

  afterAll(() => {
    server.closeAllConnections();
    server.close();
    rmSync(root, { recursive: true, force: true });
  });

  it("answers a fixture with its body and headers", async () => {
    const res = await fetch(`${url}/api/v1/things`);

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("application/json; charset=utf-8");
    expect(res.headers.get("x-fixture")).toBe("list");
    expect(await res.json()).toEqual({ things: ["a", "b"] });
  });

  it("hands the path params and the query to the middleware", async () => {
    const res = await fetch(`${url}/api/v1/things/7?q=x`);

    expect(await res.json()).toEqual({ id: "7", q: "x" });
  });

  it("answers HEAD from the GET fixture", async () => {
    const res = await fetch(`${url}/api/v1/things`, { method: "HEAD" });

    expect(res.status).toBe(200);
  });

  it("rotates through the sequence", async () => {
    const statuses = [];
    for (let i = 0; i < 4; i++) statuses.push((await fetch(`${url}/api/v1/flaky`)).status);

    expect(statuses).toEqual([200, 200, 503, 200]);
  });

  it("answers a missing fixture with a google.rpc.Status naming the file to create", async () => {
    const res = await fetch(`${url}/api/v1/nothing`);
    const body = (await res.json()) as { code: number; error: string; message: string };

    expect(res.status).toBe(404);
    expect(body.code).toBe(5);
    expect(body.error).toBe("pico_mock_no_fixture");
    expect(body.message).toContain(path.join("mock", "data", "v1", "nothing", "GET.ts"));
  });

  it("turns an exception in a middleware into a 500 with an error body", async () => {
    const res = await fetch(`${url}/api/v1/broken`);

    expect(res.status).toBe(500);
    expect(await res.json()).toMatchObject({ error: "pico_mock_error", message: "boom", code: 13 });
  });

  it("echoes a json body and leaves everything outside the api alone", async () => {
    const created = await fetch(`${url}/api/v1/things`, { method: "POST", headers: { "content-type": "application/json" }, body: '{"name":"new"}' });
    expect(created.status).toBe(201);
    expect(await created.json()).toEqual({ name: "new" });

    expect((await fetch(`${url}/index.html`)).status).toBe(404);
  });

  describe("the gateway", () => {
    it("refuses an auth fixture without a session, pointing at the login page", async () => {
      const res = await fetch(`${url}/api/v1/private`);

      expect(res.status).toBe(401);
      expect(await res.json()).toMatchObject({ error: "unauthenticated", code: 16, message: expect.stringContaining("/auth.html") });
    });

    it("serves the picker on the login page, without the service account", async () => {
      const res = await fetch(`${url}/auth.html?return=/cubes`);
      const html = await res.text();

      expect(res.headers.get("content-type")).toContain("text/html");
      expect(html).toContain("/api/_pico-mock/login?user=alice&#38;return=%2Fcubes");
      expect(html).not.toContain("user=robot");
      expect(html).toContain(path.join("mock", "auth", "users.ts"));
    });

    it("signs in, serves the user, and signs out again", async () => {
      const login = await fetch(`${url}/api/_pico-mock/login?user=bob&return=/somewhere`, { redirect: "manual" });
      expect(login.status).toBe(303);
      expect(login.headers.get("location")).toBe("/somewhere");
      const cookie = cookieOf(login);
      expect(cookie).toMatch(/^pico_mock_session=/);
      // no Secure by default: Safari drops it on http://localhost
      expect(login.headers.get("set-cookie")).not.toContain("Secure");

      const res = await fetch(`${url}/api/v1/private`, { headers: { cookie } });
      expect(await res.json()).toEqual({ user: "bob", via: "session" });

      const logout = await fetch(`${url}/logout.html`, { headers: { cookie }, redirect: "manual" });
      expect(logout.status).toBe(303);
      expect((await fetch(`${url}/api/v1/private`, { headers: { cookie } })).status).toBe(401);
    });

    it("never returns to the api or the gateway pages after a login", async () => {
      const login = await fetch(`${url}/api/_pico-mock/login?user=bob&return=/auth.html`, { redirect: "manual" });

      expect(login.headers.get("location")).toBe("/");
    });

    it("answers 403 to a user without the role", async () => {
      const bob = cookieOf(await fetch(`${url}/api/_pico-mock/login?user=bob`, { redirect: "manual" }));
      const alice = cookieOf(await fetch(`${url}/api/_pico-mock/login?user=alice`, { redirect: "manual" }));

      expect((await fetch(`${url}/api/v1/admin`, { headers: { cookie: bob } })).status).toBe(403);
      expect(await (await fetch(`${url}/api/v1/admin`, { headers: { cookie: alice } })).json()).toEqual({ secret: 42 });
    });

    it("accepts an api key and refuses an unknown one, naming the keys file", async () => {
      const ok = await fetch(`${url}/api/_pico-mock/whoami`, { headers: { authorization: "Bearer key-robot" } });
      expect(await ok.json()).toMatchObject({ key: "robot", via: "api-key", kind: "service", api_key: "robot key" });

      const bad = await fetch(`${url}/api/v1/things`, { headers: { authorization: "Bearer nope" } });
      expect(bad.status).toBe(401);
      expect(await bad.json()).toMatchObject({ message: expect.stringContaining(path.join("mock", "auth", "apiKeys.ts")) });
    });

    it("names its routes when asked for one it does not have", async () => {
      const res = await fetch(`${url}/api/_pico-mock/nope`);

      expect(res.status).toBe(404);
      expect(await res.json()).toMatchObject({ error: "pico_mock_no_route" });
    });
  });

  it("pushes what a fixture notifies into an open ndjson stream", async () => {
    const cookie = cookieOf(await fetch(`${url}/api/_pico-mock/login?user=alice`, { redirect: "manual" }));
    const controller = new AbortController();
    const stream = await fetch(`${url}/api/v1/things:watch`, { headers: { cookie }, signal: controller.signal });
    expect(stream.headers.get("content-type")).toBe("application/x-ndjson");

    const reader = (stream.body as ReadableStream<Uint8Array>).getReader();
    const decoder = new TextDecoder();
    let seen = "";
    const lines = async (count: number): Promise<string[]> => {
      for (;;) {
        const found = seen.split("\n").filter((l) => l.trim() !== "");
        if (found.length >= count) return found;
        const { value, done } = await reader.read();
        if (done) return found;
        seen += decoder.decode(value);
      }
    };

    expect(await lines(1)).toEqual(['{"hello":true}']);

    await fetch(`${url}/api/v1/things`, { method: "POST", headers: { "content-type": "application/json", cookie }, body: '{"name":"pushed"}' });

    expect((await lines(2))[1]).toBe('{"thing_created":{"name":"pushed"}}');
    controller.abort();
  });
});

describe("createPicoMock options", () => {
  let root: string;

  beforeAll(() => {
    root = project();
  });

  afterAll(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("serves under another api prefix and gateway, with its own error body", async () => {
    const { server, url } = await serve({
      root,
      apiPrefix: "/backend",
      gatewayPrefix: "/_gate",
      loginPath: "/login",
      formatError: ({ status, message }) => ({ problem: message, status }),
    });
    try {
      expect(await (await fetch(`${url}/backend/v1/things`)).json()).toEqual({ things: ["a", "b"] });
      expect((await fetch(`${url}/api/v1/things`)).status).toBe(404);

      const missing = await fetch(`${url}/backend/v1/private`);
      expect(await missing.json()).toEqual({ problem: expect.stringContaining("sign in at /login"), status: 401 });

      expect(await (await fetch(`${url}/login`)).text()).toContain("/_gate/login?user=alice");
    } finally {
      server.close();
    }
  });

  it("takes its tree and users from elsewhere", async () => {
    write(root, "elsewhere/fixtures/hello/GET.ts", `export default { cases: [{ body: "hi", contentType: "text/plain" }] };`);
    const { server, url } = await serve({ root, dir: "elsewhere", dataDir: "elsewhere/fixtures" });
    try {
      expect(await (await fetch(`${url}/api/hello`)).text()).toBe("hi");
      // there is no elsewhere/auth/users.ts, so there is nobody to sign in as
      const picker = await (await fetch(`${url}/auth.html`)).text();
      expect(picker).toContain("There is nobody to sign in as yet");
      expect(picker).toContain(path.join("elsewhere", "auth", "users.ts"));
    } finally {
      server.close();
    }
  });

  it("serves no gateway pages when they are switched off", () => {
    const mock = createPicoMock({ root, loginPath: false, logoutPath: false });

    expect(mock.handles("/auth.html")).toBe(false);
    expect(mock.handles("/logout.html")).toBe(false);
    expect(mock.handles("/api/v1/things?x=1")).toBe(true);
    expect(mock.handles("/src/main.ts")).toBe(false);
  });
});

// node:sqlite is unflagged from Node 22.13 on; the package still supports older nodes.
const hasSqlite = (() => {
  try {
    return Boolean(process.getBuiltinModule("node:sqlite")); // throws on a node without getBuiltinModule
  } catch {
    return false;
  }
})();

describe.skipIf(!hasSqlite)("a fixture backed by node:sqlite", () => {
  let root: string;
  let server: Server;
  let url: string;

  beforeAll(async () => {
    root = mkdtempSync(path.join(tmpdir(), "pico-mock-sqlite-"));
    write(
      root,
      "mock/data/v1/cubes/_db.ts",
      `import { DatabaseSync } from "node:sqlite";

export interface TCube { id: string; name: string }

const store = globalThis as typeof globalThis & { __picoMockSpecCubesDb?: DatabaseSync };
export const db = (store.__picoMockSpecCubesDb ??= open());

function open(): DatabaseSync {
  const db = new DatabaseSync(":memory:");
  db.exec("CREATE TABLE IF NOT EXISTS cubes (id TEXT PRIMARY KEY, name TEXT NOT NULL)");
  if (!db.prepare("SELECT 1 FROM cubes LIMIT 1").get()) {
    db.prepare("INSERT INTO cubes (id, name) VALUES (?, ?)").run("42", "the answer");
  }
  return db;
}`
    );
    write(
      root,
      "mock/data/v1/cubes/{cube_id}/GET.ts",
      `import { db, type TCube } from "../_db";

export default {
  cases: [{
    middleware: [(res: any, req: any) => {
      const cube = db.prepare("SELECT id, name FROM cubes WHERE id = ?").get(req.params.cube_id) as TCube | undefined;
      if (!cube) {
        res.replace({ status: 404, body: { error: "not_found", message: "no cube " + req.params.cube_id, code: 5, details: [] } });
        return;
      }
      res.body = { cube };
    }],
  }],
};`
    );
    write(
      root,
      "mock/data/v1/cubes/POST.ts",
      `import { db } from "./_db";

export default {
  cases: [{
    status: 201,
    middleware: [(res: any, req: any) => {
      const { id, name } = req.body.cube;
      db.prepare("INSERT INTO cubes (id, name) VALUES (?, ?)").run(id, name);
      res.body = { cube: { id, name } };
    }],
  }],
};`
    );
    ({ server, url } = await serve({ root }));
  });

  afterAll(() => {
    (globalThis as { __picoMockSpecCubesDb?: { close(): void } }).__picoMockSpecCubesDb?.close();
    delete (globalThis as { __picoMockSpecCubesDb?: unknown }).__picoMockSpecCubesDb;
    server.closeAllConnections();
    server.close();
    rmSync(root, { recursive: true, force: true });
  });

  it("reads the seed, writes a row and reads it back, across requests", async () => {
    expect(await (await fetch(`${url}/api/v1/cubes/42`)).json()).toEqual({ cube: { id: "42", name: "the answer" } });

    const created = await fetch(`${url}/api/v1/cubes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ cube: { id: "7", name: "seven" } }),
    });
    expect(created.status).toBe(201);

    expect(await (await fetch(`${url}/api/v1/cubes/7`)).json()).toEqual({ cube: { id: "7", name: "seven" } });
    expect((await fetch(`${url}/api/v1/cubes/8`)).status).toBe(404);
  });
});

describe("createPicoMock module loading", () => {
  let root: string;
  let server: Server;
  let url: string;

  beforeAll(async () => {
    root = mkdtempSync(path.join(tmpdir(), "pico-mock-loading-"));
    write(root, "mock/data/_shared.ts", `export const greeting = "hello";`);
    write(root, "mock/data/_late.ts", `export const late = "loaded late";`);
    write(root, "mock/data/greet/GET.ts", `import { greeting } from "../_shared"; export default { cases: [{ body: { greeting } }] };`);
    write(
      root,
      "mock/data/lazy/GET.ts",
      `export default { cases: [{ body: {}, middleware: [async (res) => { res.body = { late: (await import("../_late")).late }; }] }] };`
    );
    ({ server, url } = await serve({ root }));
  });

  afterAll(() => {
    server.close();
    rmSync(root, { recursive: true, force: true });
  });

  it("evaluates an edited module the fixture imports on the next request", async () => {
    expect(await (await fetch(`${url}/api/greet`)).json()).toEqual({ greeting: "hello" });

    write(root, "mock/data/_shared.ts", `export const greeting = "hi again";`);

    expect(await (await fetch(`${url}/api/greet`)).json()).toEqual({ greeting: "hi again" });
  });

  it("lets middleware import a module at request time", async () => {
    // a runner closed right after the fixture was loaded fails this with "module runner has been closed"
    const res = await fetch(`${url}/api/lazy`);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ late: "loaded late" });
  });

  it("answers concurrent requests, each from its own fixture", async () => {
    const answers = await Promise.all(Array.from({ length: 20 }, (_, i) => fetch(`${url}/api/${i % 2 ? "greet" : "lazy"}`).then((r) => r.json())));

    answers.forEach((body, i) => {
      expect(body).toEqual(i % 2 ? { greeting: "hi again" } : { late: "loaded late" });
    });
  });
});
