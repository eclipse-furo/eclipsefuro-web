import { expect } from "vitest";
import { CubeDefinition } from "../protoc-gen-open-models/furo/cube/CubeDefinition";
import { Materials } from "../protoc-gen-open-models/furo/cube/Materials";

// ARRAY and MAP build their children with a zero-arg `new Constructor()`, which the ENUM
// base class cannot satisfy. Repeated and map-valued enums therefore use the generated
// MaterialsENUM subclass, which binds the enum object and its default value.
describe("repeated enum (ARRAY of ENUM)", () => {
  it("must keep every value from the init literal", async () => {
    const c = new CubeDefinition({ materials: [Materials.MATERIALS_GLASS, Materials.MATERIALS_WOOD] });

    expect(c.materials.length).toBe(2);
    expect(c.toLiteral().materials).toEqual([Materials.MATERIALS_GLASS, Materials.MATERIALS_WOOD]);
  });

  it("must support push and the array setter", async () => {
    const c = new CubeDefinition();

    c.materials.push(Materials.MATERIALS_PAPER);
    expect(c.toLiteral().materials).toEqual([Materials.MATERIALS_PAPER]);

    c.materials = [Materials.MATERIALS_METALS, Materials.MATERIALS_RUBBER];
    expect(c.materials.length).toBe(2);
    expect(c.materials.at(0)?.value).toBe(Materials.MATERIALS_METALS);
    expect(c.materials.at(1)?.value).toBe(Materials.MATERIALS_RUBBER);
  });

  it("must fall back to the enum default for an out of range value", async () => {
    const c = new CubeDefinition();

    c.materials = ["NOT_A_MEMBER" as Materials];
    expect(c.materials.at(0)?.value).toBe(Materials.MATERIALS_UNSPECIFIED);
  });

  it("must round trip through toJson", async () => {
    const c = new CubeDefinition({ materials: [Materials.MATERIALS_LEATHER] });

    expect(JSON.parse(c.__stringify()).materials).toEqual([Materials.MATERIALS_LEATHER]);
  });
});

describe("enum valued map (MAP of ENUM)", () => {
  it("must keep every value from the init literal", async () => {
    const c = new CubeDefinition({
      materialByPart: { lid: Materials.MATERIALS_GLASS, base: Materials.MATERIALS_WOOD },
    });

    expect(c.materialByPart.value.size).toBe(2);
    expect(c.toLiteral().materialByPart).toEqual({
      lid: Materials.MATERIALS_GLASS,
      base: Materials.MATERIALS_WOOD,
    });
  });

  it("must expose the bound ENUM node as the map value", async () => {
    const c = new CubeDefinition({ materialByPart: { lid: Materials.MATERIALS_CERAMICS } });

    expect(c.materialByPart.value.get("lid")?.value).toBe(Materials.MATERIALS_CERAMICS);
  });

  it("must fall back to the enum default for an out of range value", async () => {
    const c = new CubeDefinition({ materialByPart: { lid: "NOT_A_MEMBER" as Materials } });

    expect(c.materialByPart.value.get("lid")?.value).toBe(Materials.MATERIALS_UNSPECIFIED);
  });
});
