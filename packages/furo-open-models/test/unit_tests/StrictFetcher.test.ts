// eslint-disable-next-line import-x/no-extraneous-dependencies
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { CubeService } from "../protoc-gen-open-models/furo/cube/CubeService";
import { API_OPTIONS } from "../protoc-gen-open-models/API_OPTIONS";
import { OPEN_MODELS_OPTIONS } from "@furo/open-models";

describe("StrictFetcher", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    // Reset to defaults
    API_OPTIONS.serverAddr = "";
    API_OPTIONS.ApiBaseURL = "/api";
    API_OPTIONS.UseProtoNames = true;
    API_OPTIONS.UseProtoNamesForQueryParams = true;
    OPEN_MODELS_OPTIONS.UseProtoNames = true;
    OPEN_MODELS_OPTIONS.EmitDefaultValues = false;
    OPEN_MODELS_OPTIONS.EmitUnpopulated = false;
  });

  it("should use proto names from field descriptors for query params when UseProtoNamesForQueryParams=true", async () => {
    API_OPTIONS.UseProtoNamesForQueryParams = true;
    OPEN_MODELS_OPTIONS.UseProtoNames = true;

    let capturedUrl = "";
    vi.stubGlobal(
      "fetch",
      vi.fn((request: Request) => {
        capturedUrl = request.url;
        return Promise.resolve(
          new Response(JSON.stringify({ entity: { display_name: "Test" } }), {
            status: 200,
            headers: { "content-type": "application/json" },
          })
        );
      })
    );

    const service = new CubeService();
    // Get uses path /v1/cubes/{cube_id}, cubeId goes to path, fields goes to query
    await service.Get.invoke({ cubeId: "123", fields: "*" });

    // 'fields' has protoName 'fields' (same), 'cubeId' has protoName 'cube_id' (used in path)
    expect(capturedUrl).toContain("/api/v1/cubes/123?fields=*");
  });

  it("should use camelCase keys for query params when UseProtoNamesForQueryParams=false", async () => {
    API_OPTIONS.UseProtoNamesForQueryParams = false;
    OPEN_MODELS_OPTIONS.UseProtoNames = false;

    let capturedUrl = "";
    vi.stubGlobal(
      "fetch",
      vi.fn((request: Request) => {
        capturedUrl = request.url;
        return Promise.resolve(
          new Response(JSON.stringify({ entity: { displayName: "Test" } }), {
            status: 200,
            headers: { "content-type": "application/json" },
          })
        );
      })
    );

    const service = new CubeService();
    await service.Get.invoke({ cubeId: "123", fields: "*" });

    expect(capturedUrl).toContain("/api/v1/cubes/123?fields=*");
  });

  it("should replace path templates using proto name to camelCase mapping", async () => {
    API_OPTIONS.UseProtoNames = true;
    OPEN_MODELS_OPTIONS.UseProtoNames = true;

    let capturedUrl = "";
    vi.stubGlobal(
      "fetch",
      vi.fn((request: Request) => {
        capturedUrl = request.url;
        return Promise.resolve(
          new Response(JSON.stringify({ entity: { display_name: "Test" } }), {
            status: 200,
            headers: { "content-type": "application/json" },
          })
        );
      })
    );

    const service = new CubeService();
    await service.Get.invoke({ cubeId: "abc-def" });

    // {cube_id} in path should be replaced with the value from rqo.cubeId
    expect(capturedUrl).toContain("/api/v1/cubes/abc-def");
  });

  it('should use FieldNode serialization for body with bodyField="*" and UseProtoNames=true', async () => {
    API_OPTIONS.UseProtoNames = true;
    OPEN_MODELS_OPTIONS.UseProtoNames = true;

    let capturedBody = "";
    vi.stubGlobal(
      "fetch",
      vi.fn(async (request: Request) => {
        capturedBody = await request.text();
        return new Response(JSON.stringify({ entity: { display_name: "Updated" } }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      })
    );

    // For this test, we need a fetcher with bodyField="*"
    // The Update fetcher has bodyField='entity', so let's use GetList which has no bodyField
    // Instead, let's create a custom StrictFetcher for this test
    const { StrictFetcher } = await import("@furo/open-models/dist/StrictFetcher");
    const { CubeServiceGetRequest } = await import("../protoc-gen-open-models/furo/cube/CubeServiceGetRequest");
    const { CubeServiceGetResponse } = await import("../protoc-gen-open-models/furo/cube/CubeServiceGetResponse");

    const fetcher = new StrictFetcher(API_OPTIONS, "POST", "/v1/test", CubeServiceGetRequest, CubeServiceGetResponse, "*");

    await fetcher.invoke({ cubeId: "123", fields: "name" });

    const body = JSON.parse(capturedBody);
    // With UseProtoNames=true, body keys should be proto names via FieldNode serialization
    expect(body).toHaveProperty("cube_id");
    expect(body).toHaveProperty("fields");
    expect(body.cube_id).toBe("123");
    expect(body.fields).toBe("name");
  });

  it("should use FieldNode serialization for named bodyField and UseProtoNames=true", async () => {
    API_OPTIONS.UseProtoNames = true;
    OPEN_MODELS_OPTIONS.UseProtoNames = true;

    let capturedBody = "";
    vi.stubGlobal(
      "fetch",
      vi.fn(async (request: Request) => {
        capturedBody = await request.text();
        return new Response(JSON.stringify({ entity: { display_name: "Updated" } }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      })
    );

    const service = new CubeService();
    // Update has bodyField='entity', path /v1/cubes/{cube_id}
    await service.Update.invoke({
      cubeId: "456",
      entity: { displayName: "My Cube", description: "A test cube" },
    });

    const body = JSON.parse(capturedBody);
    // The entity body should have proto names from FieldNode serialization
    expect(body).toHaveProperty("display_name", "My Cube");
    expect(body).toHaveProperty("description", "A test cube");
    // cubeId should NOT be in the body — it goes to the path
    expect(body).not.toHaveProperty("cube_id");
    expect(body).not.toHaveProperty("cubeId");
  });

  it("should convert response JSON via FieldNode __fromProtoNameJson + __toLiteral", async () => {
    API_OPTIONS.UseProtoNames = true;
    OPEN_MODELS_OPTIONS.UseProtoNames = true;

    // Server returns proto-name JSON
    vi.stubGlobal(
      "fetch",
      vi.fn(() => {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              entity: { display_name: "Returned Cube", description: "From server" },
            }),
            {
              status: 200,
              headers: { "content-type": "application/json" },
            }
          )
        );
      })
    );

    const service = new CubeService();
    const result = await service.Get.invoke({ cubeId: "789" });

    // Result should be in camelCase literal form
    expect(result).toHaveProperty("entity");
    expect(result.entity).toHaveProperty("displayName", "Returned Cube");
    expect(result.entity).toHaveProperty("description", "From server");
  });

  it("should pass through response as-is when UseProtoNames=false", async () => {
    API_OPTIONS.UseProtoNames = false;
    OPEN_MODELS_OPTIONS.UseProtoNames = false;

    vi.stubGlobal(
      "fetch",
      vi.fn(() => {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              entity: { displayName: "CamelCase Cube" },
            }),
            {
              status: 200,
              headers: { "content-type": "application/json" },
            }
          )
        );
      })
    );

    const service = new CubeService();
    const result = await service.Get.invoke({ cubeId: "101" });

    expect(result).toHaveProperty("entity");
    expect(result.entity).toHaveProperty("displayName", "CamelCase Cube");
  });

  it("should send camelCase body keys when UseProtoNames=false", async () => {
    API_OPTIONS.UseProtoNames = false;
    OPEN_MODELS_OPTIONS.UseProtoNames = false;

    let capturedBody = "";
    vi.stubGlobal(
      "fetch",
      vi.fn(async (request: Request) => {
        capturedBody = await request.text();
        return new Response(JSON.stringify({ entity: { displayName: "Updated" } }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      })
    );

    const service = new CubeService();
    await service.Update.invoke({
      cubeId: "456",
      entity: { displayName: "My Cube" },
    });

    const body = JSON.parse(capturedBody);
    // With UseProtoNames=false, body should pass through as-is (camelCase)
    expect(body).toHaveProperty("displayName", "My Cube");
  });

  it("should call onResponse handler on successful response", async () => {
    API_OPTIONS.UseProtoNames = true;
    OPEN_MODELS_OPTIONS.UseProtoNames = true;

    vi.stubGlobal(
      "fetch",
      vi.fn(() => {
        return Promise.resolve(
          new Response(JSON.stringify({ entity: { display_name: "Test" } }), {
            status: 200,
            headers: { "content-type": "application/json" },
          })
        );
      })
    );

    const service = new CubeService();
    let handlerCalled = false;
    service.Get.onResponse = () => {
      handlerCalled = true;
    };

    await service.Get.invoke({ cubeId: "123" });
    expect(handlerCalled).toBe(true);
  });

  it("should reject and call onResponseError on 4xx response", async () => {
    API_OPTIONS.UseProtoNames = true;
    OPEN_MODELS_OPTIONS.UseProtoNames = true;

    vi.stubGlobal(
      "fetch",
      vi.fn(() => {
        return Promise.resolve(
          new Response(JSON.stringify({ error: "not found" }), {
            status: 404,
            headers: { "content-type": "application/json" },
          })
        );
      })
    );

    const service = new CubeService();
    let errorHandlerCalled = false;
    service.Get.onResponseError = () => {
      errorHandlerCalled = true;
    };

    await expect(service.Get.invoke({ cubeId: "missing" })).rejects.toBeDefined();
    expect(errorHandlerCalled).toBe(true);
  });
});
