import { expect } from "vitest";

import { Numeric } from "../protoc-gen-open-models/furo/type/Numeric";
import { Identifier } from "../protoc-gen-open-models/furo/type/Identifier";
import { BookingCenter } from "../protoc-gen-open-models/furo/type/BookingCenter";
import { CubeDefinition } from "../protoc-gen-open-models/furo/cube/CubeDefinition";
import { OPEN_MODELS_OPTIONS } from "@furo/open-models/dist/OPEN_MODELS_OPTIONS";

OPEN_MODELS_OPTIONS.EmitUnpopulated = false;
OPEN_MODELS_OPTIONS.EmitDefaultValues = false;

describe("__clear notifications", () => {
  describe("empty state", () => {
    it("should reset __isEmpty on a numeric primitive, so it is no longer emitted", () => {
      const numeric = new Numeric();
      numeric.primitiveInt32 = 10;
      expect(numeric.primitiveInt32.__isEmpty).to.be.false;
      expect(numeric.__toJson()).to.eql({ primitive_int32: 10 });

      numeric.primitiveInt32.__clear();
      expect(numeric.primitiveInt32.__isEmpty).to.be.true;
      expect(numeric.__toJson()).to.eql({});
    });

    it("should reset __isEmpty on an enum, so it is no longer emitted", () => {
      const id = new Identifier();
      id.bookingCenter = BookingCenter.BBC_SG;
      expect(id.bookingCenter.__isEmpty).to.be.false;

      id.bookingCenter.__clear();
      expect(id.bookingCenter.__isEmpty).to.be.true;
      expect(id.__toLiteral()).to.not.have.property("bookingCenter");
    });
  });

  describe("notify only on a real change", () => {
    it("should notify once when a populated primitive is cleared twice", () => {
      const id = new Identifier();
      id.id = "hello";

      let notified = 0;
      id.id.__addEventListener("this-field-value-changed", () => {
        notified += 1;
      });

      id.id.__clear();
      id.id.__clear();
      expect(notified).to.equal(1);
    });

    it("should not notify when an untouched primitive is cleared", () => {
      const id = new Identifier();

      let notified = 0;
      id.id.__addEventListener("this-field-value-changed", () => {
        notified += 1;
      });

      id.id.__clear();
      expect(notified).to.equal(0);
    });

    it("should notify once when a populated array is cleared twice", () => {
      // stringArray is populated from the model defaults with A, B, C
      const id = new Identifier();

      let notified = 0;
      id.stringArray.__addEventListener("this-array-changed", () => {
        notified += 1;
      });

      id.stringArray.__clear();
      id.stringArray.__clear();
      expect(notified).to.equal(1);
    });

    it("should notify once when a populated map is cleared twice", () => {
      const id = new Identifier({ attributes: { key: "BBBB" } });

      let notified = 0;
      id.attributes.__addEventListener("this-map-changed", () => {
        notified += 1;
      });

      id.attributes.__clear();
      id.attributes.__clear();
      expect(notified).to.equal(1);
    });

    it("should notify a child only once when the parent is cleared twice", () => {
      const numeric = new Numeric();
      numeric.primitiveInt32 = 10;

      let notified = 0;
      numeric.primitiveInt32.__addEventListener("this-field-value-changed", () => {
        notified += 1;
      });

      numeric.__clear();
      numeric.__clear();
      expect(notified).to.equal(1);
    });
  });

  describe("oneof", () => {
    it("should notify the sibling that gets cleared when a oneof member is set", () => {
      const cube = new CubeDefinition();
      cube.name = "hello";

      let notified = 0;
      cube.name.__addEventListener("this-field-value-changed", () => {
        notified += 1;
      });

      cube.subMessage = { red: 1, green: 2, blue: 3 };
      expect(cube.name.__isEmpty).to.be.true;
      expect(notified).to.equal(1);
    });

    it("should notify the members that get cleared by __clearOneof", () => {
      const cube = new CubeDefinition();
      cube.name = "hello";

      let notified = 0;
      cube.name.__addEventListener("this-field-value-changed", () => {
        notified += 1;
      });

      cube.__clearOneof("testOneof");
      expect(cube.__whichOneof("testOneof")).to.be.undefined;
      expect(notified).to.equal(1);
    });
  });
});
