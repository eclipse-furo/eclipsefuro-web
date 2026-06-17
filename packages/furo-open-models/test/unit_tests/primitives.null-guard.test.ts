import { expect } from "vitest";

import { BOOLEAN, BYTES, DOUBLE, FLOAT, INT32, INT64, SINT32, SINT64, STRING, UINT32, UINT64 } from "@furo/open-models";

// Guard against malformed API responses which sometimes send a `null` (or a
// wrong-typed value) instead of the expected primitive. FieldNode.__updateWithLiteral
// only skips fields that are `undefined`, so a `null` is forwarded into the child
// primitive. Each primitive must coerce it to its natural empty value instead of
// throwing or storing `null`.

describe("primitives null-guard", () => {
  describe("number types coerce null to 0", () => {
    const cases: Array<[string, new (...args: never[]) => INT32 | UINT32 | SINT32 | FLOAT | DOUBLE]> = [
      ["INT32", INT32],
      ["UINT32", UINT32],
      ["SINT32", SINT32],
      ["FLOAT", FLOAT],
      ["DOUBLE", DOUBLE],
    ];

    cases.forEach(([name, Ctor]) => {
      it(`${name} via __updateWithLiteral(null)`, () => {
        const node = new Ctor();
        expect(() => node.__updateWithLiteral(null as never)).to.not.throw();
        expect(node.value).to.equal(0);
        expect(node.toString()).to.equal("0");
      });

      it(`${name} via value setter`, () => {
        const node = new Ctor();
        expect(() => {
          (node as INT32).value = null as never;
        }).to.not.throw();
        expect(node.value).to.equal(0);
      });
    });
  });

  describe("64-bit types coerce null to 0n", () => {
    const cases: Array<[string, new (...args: never[]) => INT64 | UINT64 | SINT64]> = [
      ["INT64", INT64],
      ["UINT64", UINT64],
      ["SINT64", SINT64],
    ];

    cases.forEach(([name, Ctor]) => {
      it(`${name} via __updateWithLiteral(null)`, () => {
        const node = new Ctor();
        expect(() => node.__updateWithLiteral(null as never)).to.not.throw();
        expect(node.value).to.equal(0n);
      });

      it(`${name} via value setter`, () => {
        const node = new Ctor();
        expect(() => {
          (node as INT64).value = null as never;
        }).to.not.throw();
        expect(node.value).to.equal(0n);
      });
    });
  });

  describe("BOOLEAN coerces null to false", () => {
    it("via __updateWithLiteral(null)", () => {
      const node = new BOOLEAN();
      expect(() => node.__updateWithLiteral(null as never)).to.not.throw();
      expect(node.value).to.equal(false);
      expect(node.toString()).to.equal("false");
    });

    it("via value setter", () => {
      const node = new BOOLEAN();
      expect(() => {
        node.value = null as never;
      }).to.not.throw();
      expect(node.value).to.equal(false);
    });
  });

  describe("STRING coerces null to empty string", () => {
    it("via __updateWithLiteral(null)", () => {
      const node = new STRING();
      expect(() => node.__updateWithLiteral(null as never)).to.not.throw();
      expect(node.value).to.equal("");
    });

    it("via value setter", () => {
      const node = new STRING();
      expect(() => {
        node.value = null as never;
      }).to.not.throw();
      expect(node.value).to.equal("");
    });
  });

  describe("BYTES coerces null to an empty Uint8Array", () => {
    it("via __updateWithLiteral(null)", () => {
      const node = new BYTES();
      expect(() => node.__updateWithLiteral(null as never)).to.not.throw();
      expect(node.value).to.be.instanceof(Uint8Array);
      expect(node.value.length).to.equal(0);
    });

    it("via value setter", () => {
      const node = new BYTES();
      expect(() => {
        node.value = null as never;
      }).to.not.throw();
      expect(node.value).to.be.instanceof(Uint8Array);
      expect(node.value.length).to.equal(0);
    });
  });
});
