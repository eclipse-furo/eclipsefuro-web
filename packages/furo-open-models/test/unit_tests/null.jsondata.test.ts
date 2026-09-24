import { expect } from "vitest";

import { CubeEvent } from "../protoc-gen-open-models/furo/cube/CubeEvent";
import { Dynamic } from "../protoc-gen-open-models/furo/type/Dynamic";

// proto3 json reads null as "field absent". OpenAI-compatible servers rely on it: they send
// `"logprobs": null` for a message field and `"content": null` for a string.
describe("null in proto name json", () => {
  it("reads null on a message field as absent instead of throwing", () => {
    const e = new CubeEvent();
    e.__fromProtoNameJson({ cube_deleted: null });
    expect(e.__toJson()).to.eql({});
  });

  it("reads null on scalar and dynamic fields as absent", () => {
    const d = new Dynamic();
    d.__fromProtoNameJson({ display_name: null, value: null, struct_value: null });
    expect(d.displayName.value).to.equal("");
    expect(d.value.value).to.equal(null);
    expect(d.__toJson()).to.eql({});
  });
});
