// eslint-disable-next-line import-x/no-extraneous-dependencies
import { describe, it, expect, vi, afterEach } from "vitest";

import { buildPathAndBodyfield, describeRequest, type IUrlOptions } from "@furo/open-models/dist/internal/HttpPath";
import { StrictFetcher } from "@furo/open-models/dist/StrictFetcher";
import { Fetcher } from "@furo/open-models/dist/Fetcher";
import { OPEN_MODELS_OPTIONS } from "@furo/open-models";
import { CubeServiceGetRequest, type ICubeServiceGetRequest } from "../protoc-gen-open-models/furo/cube/CubeServiceGetRequest";
import { CubeServiceUpdateRequest, type ICubeServiceUpdateRequest } from "../protoc-gen-open-models/furo/cube/CubeServiceUpdateRequest";
import { CubeServiceUpdateResponse } from "../protoc-gen-open-models/furo/cube/CubeServiceUpdateResponse";
import { API_OPTIONS } from "../protoc-gen-open-models/API_OPTIONS";

const urlOptions: IUrlOptions = {
  serverAddr: "",
  ApiBaseURL: "/api",
  UseProtoNames: true,
  UseProtoNamesForQueryParams: true,
};

function getUrl(path: string, rqo: ICubeServiceGetRequest) {
  return buildPathAndBodyfield<ICubeServiceGetRequest>(
    { apiOptions: urlOptions, ReqType: CubeServiceGetRequest, descriptors: describeRequest(CubeServiceGetRequest) },
    path,
    undefined,
    rqo
  );
}

function updateUrl(path: string, bodyField: keyof ICubeServiceUpdateRequest | "*" | undefined, rqo: ICubeServiceUpdateRequest) {
  return buildPathAndBodyfield<ICubeServiceUpdateRequest>(
    { apiOptions: urlOptions, ReqType: CubeServiceUpdateRequest, descriptors: describeRequest(CubeServiceUpdateRequest) },
    path,
    bodyField,
    rqo
  );
}

function stubFetch(capture: { url: string; body: string }) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (request: Request) => {
      capture.url = request.url;
      capture.body = await request.text();
      return new Response("{}", { status: 200, headers: { "content-type": "application/json" } });
    })
  );
}

describe("HttpPath: google.api.http path templates", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    OPEN_MODELS_OPTIONS.UseProtoNames = true;
    urlOptions.UseProtoNamesForQueryParams = true;
  });

  it("plain {cube_id} inserts the value as before, without encoding", () => {
    const { evaluatedPath } = getUrl("/v1/cubes/{cube_id}", { cubeId: "123", fields: "*" });
    expect(evaluatedPath).toBe("/api/v1/cubes/123?fields=*");
  });

  it("{cube_id=cubes/*} inserts the resource name with its slash and drops it from the query", () => {
    const { evaluatedPath } = getUrl("/v1/{cube_id=cubes/*}", { cubeId: "cubes/abc", fields: "*" });
    expect(evaluatedPath).toBe("/api/v1/cubes/abc?fields=*");
    expect(evaluatedPath).not.toContain("cube_id=");
    expect(evaluatedPath).not.toContain("undefined");
  });

  it("{cube_id=projects/*/cubes/*} encodes each segment but keeps the slashes", () => {
    const { evaluatedPath } = getUrl("/v1/{cube_id=projects/*/cubes/*}", { cubeId: "projects/p1/cubes/c 1" });
    expect(evaluatedPath).toBe("/api/v1/projects/p1/cubes/c%201");
  });

  it("a template variable followed by a custom verb", () => {
    const { evaluatedPath } = getUrl("/v1/{cube_id=cubes/*}:publish", { cubeId: "cubes/abc" });
    expect(evaluatedPath).toBe("/api/v1/cubes/abc:publish");
  });

  it("{cube_id=files/**} matches several segments", () => {
    const { evaluatedPath } = getUrl("/v1/{cube_id=files/**}", { cubeId: "files/a/b/c.txt" });
    expect(evaluatedPath).toBe("/api/v1/files/a/b/c.txt");
  });

  it("{entity.display_name=cubes/*} with body entity resolves the nested field and keeps it in the body", () => {
    const { evaluatedPath, evaluatedBody } = updateUrl("/v1/{entity.display_name=cubes/*}", "entity", {
      entity: { displayName: "cubes/x", description: "d" },
    });
    expect(evaluatedPath).toBe("/api/v1/cubes/x");
    const body = JSON.parse(evaluatedBody!) as Record<string, unknown>;
    expect(body).toEqual({ display_name: "cubes/x", description: "d" });
  });

  it("{entity.display_name=cubes/*} without body leaves the bound leaf out of the query", () => {
    const rqo = { entity: { displayName: "cubes/x", description: "d" } };
    const { evaluatedPath, evaluatedBody } = updateUrl("/v1/{entity.display_name=cubes/*}", undefined, rqo);
    expect(evaluatedPath).toBe("/api/v1/cubes/x?entity.description=d");
    expect(evaluatedBody).toBeUndefined();
    // the request literal is not touched
    expect(rqo.entity.displayName).toBe("cubes/x");
  });

  it("leaves the bound leaf out of the query with camelCase names too", () => {
    urlOptions.UseProtoNamesForQueryParams = false;
    OPEN_MODELS_OPTIONS.UseProtoNames = false;
    const { evaluatedPath } = updateUrl("/v1/{entity.display_name=cubes/*}", undefined, {
      entity: { displayName: "cubes/x", description: "d" },
    });
    expect(evaluatedPath).toBe("/api/v1/cubes/x?entity.description=d");
  });

  it("leaves the bound leaf out of the query when the body is another field", () => {
    const { evaluatedPath, evaluatedBody } = updateUrl("/v1/{entity.display_name=cubes/*}", "cubeId", {
      cubeId: "c1",
      entity: { displayName: "cubes/x", description: "d" },
    });
    expect(evaluatedPath).toBe("/api/v1/cubes/x?entity.description=d");
    expect(JSON.parse(evaluatedBody!)).toBe("c1");
  });

  it("a top level path field is not part of a * body", () => {
    const { evaluatedPath, evaluatedBody } = updateUrl("/v1/{cube_id=cubes/*}", "*", {
      cubeId: "cubes/1",
      entity: { description: "d" },
    });
    expect(evaluatedPath).toBe("/api/v1/cubes/1");
    const body = JSON.parse(evaluatedBody!) as Record<string, unknown>;
    expect(body).not.toHaveProperty("cube_id");
    expect(body).toHaveProperty("entity");
  });

  it("throws when the value does not match the template", () => {
    expect(() => getUrl("/v1/{cube_id=cubes/*}", { cubeId: "abc" })).toThrow(/cube_id=cubes\/\*.*got 'abc'/);
    expect(() => getUrl("/v1/{cube_id=cubes/*}", { cubeId: "cubes/a/b" })).toThrow();
    expect(() => getUrl("/v1/{cube_id=cubes/*}", {})).toThrow();
  });

  it("StrictFetcher rejects a value that does not match the template and is not left loading", async () => {
    const capture = { url: "", body: "" };
    stubFetch(capture);
    const fetcher = new StrictFetcher(API_OPTIONS, "GET", "/v1/{cube_id=cubes/*}", CubeServiceGetRequest, CubeServiceUpdateResponse);

    await expect(fetcher.invoke({ cubeId: "abc" })).rejects.toThrow(/expected cubes\/\*/);
    expect(fetcher.isLoading).toBe(false);
    expect(capture.url).toBe("");

    await fetcher.invoke({ cubeId: "cubes/abc", fields: "*" });
    expect(capture.url).toContain("/api/v1/cubes/abc?fields=*");
  });

  it("StrictFetcher PATCH {entity.display_name=cubes/*} with body entity", async () => {
    const capture = { url: "", body: "" };
    stubFetch(capture);
    const fetcher = new StrictFetcher(API_OPTIONS, "PATCH", "/v1/{entity.display_name=cubes/*}", CubeServiceUpdateRequest, CubeServiceUpdateResponse, "entity");

    await fetcher.invoke({ entity: { displayName: "cubes/x", description: "d" } });
    expect(capture.url).toMatch(/\/api\/v1\/cubes\/x$/);
    expect(JSON.parse(capture.body)).toEqual({ display_name: "cubes/x", description: "d" });
  });

  it("legacy Fetcher resolves {cube_id=cubes/*}", async () => {
    const capture = { url: "", body: "" };
    stubFetch(capture);
    const fetcher = new Fetcher<ICubeServiceGetRequest, object>(API_OPTIONS, "GET", "/v1/{cube_id=cubes/*}");

    await fetcher.invoke({ cubeId: "cubes/abc", fields: "*" });
    expect(capture.url).toContain("/api/v1/cubes/abc?fields=*");
  });
});
