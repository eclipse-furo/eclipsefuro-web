import { expect } from "vitest";

import { Value } from "@furo/open-models/dist/well_known/Value";
import { Dynamic } from "../protoc-gen-open-models/furo/type/Dynamic";

describe("well known Value", () => {
  it("round-trips a string, an array and an object unchanged", () => {
    const shapes = ["hello", [{ type: "text", text: "hi" }, 1, null], { someKey: { nested_key: [true] } }];
    shapes.forEach(shape => {
      const d = new Dynamic();
      d.__fromProtoNameJson({ value: shape });
      expect(d.value.value).to.eql(shape);
      expect(d.__toJson()).to.eql({ value: shape });
    });
  });

  it("never renames the keys inside it, while the message's own fields are mapped", () => {
    const d = new Dynamic();
    d.__fromProtoNameJson({
      display_name: "n",
      value: { additionalProperties: false, snake_key: 1 },
      list_value: [{ camelKey: 1 }],
      struct_value: { properties: { userId: { type: "string" } } },
    });

    expect(d.__toLiteral()).to.eql({
      displayName: "n",
      value: { additionalProperties: false, snake_key: 1 },
      listValue: [{ camelKey: 1 }],
      structValue: { properties: { userId: { type: "string" } } },
    });
    expect(d.__toJson()).to.eql({
      display_name: "n",
      value: { additionalProperties: false, snake_key: 1 },
      list_value: [{ camelKey: 1 }],
      struct_value: { properties: { userId: { type: "string" } } },
    });
  });

  it("is empty, and not sent, until a value is set", () => {
    const d = new Dynamic();
    expect(d.value.value).to.equal(null);
    expect(d.__toJson()).to.not.have.property("value");

    d.value = "x";
    expect(d.__toJson()).to.eql({ value: "x" });

    d.value.__clear();
    expect(d.value.value).to.equal(null);
    expect(d.__toJson()).to.not.have.property("value");
  });

  it("accepts every shape through the setter", () => {
    const v = new Value();
    v.value = 42;
    expect(v.__toJson()).to.equal(42);
    v.value = false;
    expect(v.__toJson()).to.equal(false);
    v.value = ["a", "b"];
    expect(v.__toJson()).to.eql(["a", "b"]);
    expect(v.toString()).to.equal('["a","b"]');
    v.value = "plain";
    expect(v.toString()).to.equal("plain");
  });
});
