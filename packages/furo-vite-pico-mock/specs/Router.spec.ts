import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { createRouter } from "../src/Router.js";

/**
 * The router only ever asks the filesystem whether something is a file or a directory, so a fixture
 * tree built out of empty modules exercises it exactly like the real `data/` does.
 */
describe("createRouter", () => {
  let base: string;
  let dataDir: string;
  let router: ReturnType<typeof createRouter>;

  const touch = (root: string, rel: string): void => {
    const file = path.join(root, rel);
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, "export default { cases: [] };\n");
  };

  beforeAll(() => {
    base = mkdtempSync(path.join(tmpdir(), "pico-mock-router-"));
    dataDir = path.join(base, "data");

    touch(dataDir, "v1/cubes/GET.ts");
    touch(dataDir, "v1/cubes/POST.ts");
    touch(dataDir, "v1/cubes/search.POST.ts");
    touch(dataDir, "v1/cubes/{cube_id}/GET.ts");
    touch(dataDir, "v1/cubes/{cube_id}/PATCH.ts");
    // A literal id directory that deliberately holds only GET, so PATCH has to fall back to the
    // template - that is the backtracking case.
    touch(dataDir, "v1/cubes/42/GET.ts");

    // An unversioned path, the way the proto declares /profile.
    touch(dataDir, "profile/GET.ts");

    // A resource-level custom method, which is where an id holding colons of its own gets tested.
    touch(dataDir, "v1/variants/{variant_id}/markVariantDefault.POST.ts");

    // A fixture outside the tree, reachable only by following a symlink that is inside it.
    const outside = path.join(base, "outside");
    touch(outside, "GET.ts");
    symlinkSync(outside, path.join(dataDir, "v1", "escape"), "dir");

    router = createRouter({ dataDir });
  });

  afterAll(() => {
    rmSync(base, { recursive: true, force: true });
  });

  /** Resolve, and fail loudly with the 404 text when a route was expected. */
  const routed = (urlPath: string, method: string) => {
    const route = router.resolveRoute(urlPath, method);
    if ("notFound" in route) {
      throw new Error(`expected a route for ${method} ${urlPath}, got: ${route.notFound}`);
    }
    return route;
  };

  /** Resolve, and fail loudly with the file when no route was expected. */
  const missed = (urlPath: string, method: string): string => {
    const route = router.resolveRoute(urlPath, method);
    if (!("notFound" in route)) {
      throw new Error(`expected no route for ${method} ${urlPath}, got: ${route.file}`);
    }
    return route.notFound;
  };

  it("resolves an unversioned path, the way /profile is declared", () => {
    // The rule is the google.api.http path minus /api, so a leading /v1 is not required - the
    // proto declares /profile that way.
    expect(routed("/api/profile", "GET")).toMatchObject({
      file: path.join(dataDir, "profile/GET.ts"),
      params: {},
    });
  });

  it("maps a literal path onto its method file", () => {
    expect(routed("/api/v1/cubes", "GET").file).toBe(path.join(dataDir, "v1/cubes/GET.ts"));
    expect(routed("/api/v1/cubes", "GET").params).toEqual({});
  });

  it("captures a {template} segment as a param", () => {
    const route = routed("/api/v1/cubes/7", "GET");
    expect(route.file).toBe(path.join(dataDir, "v1/cubes/{cube_id}/GET.ts"));
    expect(route.params).toEqual({ cube_id: "7" });
  });

  it("prefers a literal directory over the template", () => {
    const route = routed("/api/v1/cubes/42", "GET");
    expect(route.file).toBe(path.join(dataDir, "v1/cubes/42/GET.ts"));
    expect(route.params).toEqual({});
  });

  it("backtracks to the template when the literal directory has no fixture for the method", () => {
    // `42/` exists but holds only GET.ts, so PATCH has to come back out and take {cube_id}. This is
    // what makes a pinned fixture an override per *method* rather than per id.
    const route = routed("/api/v1/cubes/42", "PATCH");
    expect(route.file).toBe(path.join(dataDir, "v1/cubes/{cube_id}/PATCH.ts"));
    expect(route.params).toEqual({ cube_id: "42" });
  });

  it("splits a custom method off the last segment", () => {
    const route = routed("/api/v1/cubes:search", "POST");
    expect(route.file).toBe(path.join(dataDir, "v1/cubes/search.POST.ts"));
    expect(route.customMethod).toBe("search");
    expect(route.params).toEqual({});
  });

  /*
   * A variant that ships with the client is identified as `app:<scope>:<key>`, and the fetcher puts
   * it into the path unencoded. Splitting the custom method at the *last* colon is what keeps such an
   * id whole: taking the first one would leave `app` as the id and `cube-search:compact:markVariantDefault`
   * as the method, and the route would miss.
   */
  it("splits the custom method off an id that contains colons of its own", () => {
    const route = routed("/api/v1/variants/app:cube-search:compact:markVariantDefault", "POST");
    expect(route.file).toBe(path.join(dataDir, "v1/variants/{variant_id}/markVariantDefault.POST.ts"));
    expect(route.customMethod).toBe("markVariantDefault");
    expect(route.params).toEqual({ variant_id: "app:cube-search:compact" });
  });

  it("does not fall back to the plain method file when a custom method has no fixture", () => {
    expect(missed("/api/v1/cubes:nope", "POST")).toContain("nope.POST.ts");
  });

  it("percent decodes a captured param", () => {
    expect(routed("/api/v1/cubes/a%2Fb", "GET").params).toEqual({ cube_id: "a/b" });
  });

  it("leaves a segment alone when it is not valid percent encoding", () => {
    // decodeURIComponent throws on a truncated escape; a mock is not the place to reject a request
    // over it, so the raw segment is handed to the middleware as it arrived.
    expect(routed("/api/v1/cubes/%E0%A4%A", "GET").params).toEqual({ cube_id: "%E0%A4%A" });
  });

  it("reports the template directory it reached when the miss is deeper", () => {
    // The two halves of the message deliberately disagree: the file to create is named with the
    // literal segments, while "got as far as" walks the same literal-then-template path a match
    // does, so it lands in {cube_id}/ and can list what actually lives there.
    const message = missed("/api/v1/cubes/7/nope", "GET");
    expect(message).toContain(`Create ${path.join("v1", "cubes", "7", "nope", "GET.ts")}.`);
    expect(message).toContain(`as far as ${path.join("v1", "cubes", "{cube_id}")}/`);
    expect(message).toContain("which has: GET.ts, PATCH.ts");
  });

  it.each([
    ["/api/v1/../v1/cubes", "GET"],
    ["/api/v1/cubes/.", "GET"],
    ["/api/../../etc", "GET"],
  ])("refuses %s because a dot segment could leave data/", (urlPath, method) => {
    expect(missed(urlPath, method)).toBe('A "." or ".." segment is not routable.');
  });

  it("refuses a fixture reached through a symlink out of the tree", () => {
    expect(missed("/api/v1/escape", "GET")).toContain("resolves outside");
  });

  it("names the file to create and lists the siblings when nothing matches", () => {
    const message = missed("/api/v1/cubes", "DELETE");
    expect(message).toContain(path.join("v1", "cubes", "DELETE.ts"));
    expect(message).toContain("GET.ts");
    expect(message).toContain("POST.ts");
    // `search.POST.ts` is a fixture of the same directory, so it is listed too.
    expect(message).toContain("search.POST.ts");
  });

  it("says a directory has no fixtures rather than listing nothing", () => {
    expect(missed("/api/v1", "GET")).toContain("no fixtures");
  });

  it("has no route for the bare prefix", () => {
    expect(missed("/api/", "GET")).toContain("GET.ts");
  });

  it("makes the 404 paths relative to baseDir, not to the data directory", () => {
    // How the server uses it: baseDir is the repo root, so the message names
    // `mock/data/…` the way a developer would type it.
    const scoped = createRouter({ dataDir, baseDir: base });
    const route = scoped.resolveRoute("/api/v1/cubes", "DELETE");
    if (!("notFound" in route)) throw new Error("expected no route");
    expect(route.notFound).toContain(path.join("data", "v1", "cubes", "DELETE.ts"));
  });

  it("can be built over a directory that does not exist", () => {
    // A project that has not created its tree yet: construction must not throw - the missing tree
    // turns into 404s at request time instead, naming the file to create.
    const absent = createRouter({ dataDir: path.join(base, "absent"), baseDir: base });
    const route = absent.resolveRoute("/api/v1/cubes", "GET");
    if (!("notFound" in route)) throw new Error("expected no route");
    expect(route.notFound).toBe(`Create ${path.join("absent", "v1", "cubes", "GET.ts")}; there is no absent yet.`);
  });

  it("refuses to guess between two template directories at one level", () => {
    const ambiguous = path.join(base, "ambiguous");
    touch(ambiguous, "{a}/GET.ts");
    touch(ambiguous, "{b}/GET.ts");

    expect(() => createRouter({ dataDir: ambiguous }).resolveRoute("/api/1", "GET")).toThrow(/more than one template directory: \{a\}, \{b\}/);
  });
});
