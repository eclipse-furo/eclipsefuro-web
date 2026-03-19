import { expect } from "vitest";

import { CubeDefinition } from "../protoc-gen-open-models/furo/cube/CubeDefinition";
import { OPEN_MODELS_OPTIONS } from "@furo/open-models";

describe("Oneof Support", () => {
  it("should clear sibling field when setting a oneof field (mutual exclusion)", () => {
    const cube = new CubeDefinition();
    cube.name = "hello";
    expect(cube.name.toString()).to.equal("hello");

    // Setting subMessage should clear name
    cube.subMessage = { red: 1, green: 2, blue: 3 };
    expect(cube.name.__isEmpty).to.equal(true);
    expect(cube.name.toString()).to.equal("");
    expect(cube.subMessage.red.__toLiteral()).to.equal(1);
  });

  it("should clear the other direction too", () => {
    const cube = new CubeDefinition();
    cube.subMessage = { red: 1, green: 2, blue: 3 };
    expect(cube.subMessage.red.__toLiteral()).to.equal(1);

    // Setting name should clear subMessage
    cube.name = "world";
    expect(cube.subMessage.__isEmpty).to.equal(true);
    expect(cube.name.toString()).to.equal("world");
  });

  it("should not affect fields in other oneof groups (cross-group independence)", () => {
    const cube = new CubeDefinition();
    cube.name = "hello";
    cube.otherName = "other";

    // Setting name doesn't affect otherName/intNumber
    expect(cube.otherName.toString()).to.equal("other");

    // Setting intNumber doesn't affect name
    cube.intNumber = 42n;
    expect(cube.name.toString()).to.equal("hello");
    expect(cube.otherName.__isEmpty).to.equal(true);
  });

  it("should return correct active field via __whichOneof()", () => {
    const cube = new CubeDefinition();
    expect(cube.__whichOneof("testOneof")).to.be.undefined;

    cube.name = "hello";
    expect(cube.__whichOneof("testOneof")).to.equal("name");

    cube.subMessage = { red: 1, green: 2, blue: 3 };
    expect(cube.__whichOneof("testOneof")).to.equal("subMessage");
  });

  it("should activate oneof even when setting default value (e.g. 0n for int64)", () => {
    const cube = new CubeDefinition();
    expect(cube.__whichOneof("otherOneof")).to.be.undefined;

    cube.intNumber = 0n;
    expect(cube.__whichOneof("otherOneof")).to.equal("intNumber");
  });

  it("should only serialize active oneof field in __toLiteral()", () => {
    const cube = new CubeDefinition();
    cube.name = "hello";
    const literal = cube.toLiteral();
    expect(literal.name).to.equal("hello");
    expect(literal.subMessage).to.be.undefined;

    cube.subMessage = { red: 1, green: 2, blue: 3 };
    const literal2 = cube.toLiteral();
    expect(literal2.name).to.be.undefined;
    expect(literal2.subMessage!.red).to.equal(1);
    expect(literal2.subMessage!.green).to.equal(2);
    expect(literal2.subMessage!.blue).to.equal(3);
  });

  it("should only serialize active oneof field in __toJson()", () => {
    const cube = new CubeDefinition();
    cube.name = "hello";
    const json = cube.__toJson();
    expect(json.name).to.equal("hello");
    expect(json.subMessage).to.be.undefined;
    expect(json.sub_message).to.be.undefined;
  });

  it("should omit inactive oneof fields even with EmitUnpopulated", () => {
    const prev = OPEN_MODELS_OPTIONS.EmitUnpopulated;
    OPEN_MODELS_OPTIONS.EmitUnpopulated = true;
    try {
      const cube = new CubeDefinition();
      cube.name = "hello";
      const json = cube.__toJson();
      expect(json.name).to.equal("hello");
      // subMessage is in the same oneof group but not active → should NOT appear
      expect(json.subMessage).to.be.undefined;
      expect(json.sub_message).to.be.undefined;
    } finally {
      OPEN_MODELS_OPTIONS.EmitUnpopulated = prev;
    }
  });

  it("should set oneof state correctly from __fromLiteral()", () => {
    const cube = new CubeDefinition();
    cube.fromLiteral({
      name: "fromLiteral",
      length: 200,
      breadth: 200,
      height: 200,
    });
    expect(cube.__whichOneof("testOneof")).to.equal("name");
    expect(cube.name.toString()).to.equal("fromLiteral");
  });

  it("should clear oneof group with __clearOneof()", () => {
    const cube = new CubeDefinition();
    cube.name = "hello";
    expect(cube.__whichOneof("testOneof")).to.equal("name");

    cube.__clearOneof("testOneof");
    expect(cube.__whichOneof("testOneof")).to.be.undefined;
    expect(cube.name.__isEmpty).to.equal(true);
    expect(cube.subMessage.__isEmpty).to.equal(true);
  });

  it("should report __isActiveOneofField correctly", () => {
    const cube = new CubeDefinition();
    cube.name = "hello";

    expect(cube.name.__isActiveOneofField).to.equal(true);
    expect(cube.subMessage.__isActiveOneofField).to.equal(false);

    cube.subMessage = { red: 1, green: 2, blue: 3 };
    expect(cube.name.__isActiveOneofField).to.equal(false);
    expect(cube.subMessage.__isActiveOneofField).to.equal(true);
  });

  it("should report __oneofGroup correctly", () => {
    const cube = new CubeDefinition();
    expect(cube.name.__oneofGroup).to.equal("testOneof");
    expect(cube.subMessage.__oneofGroup).to.equal("testOneof");
    expect(cube.otherName.__oneofGroup).to.equal("otherOneof");
    expect(cube.intNumber.__oneofGroup).to.equal("otherOneof");
    // non-oneof field
    expect(cube.length.__oneofGroup).to.be.undefined;
  });

  it("should fire oneof-changed event with correct details", () => {
    const cube = new CubeDefinition();
    const events: { group: string; activeField: string; previousField: string | undefined }[] = [];

    cube.__addEventListener("oneof-changed", (e: CustomEvent) => {
      events.push(e.detail);
    });

    cube.name = "hello";
    expect(events).to.have.length(1);
    expect(events[0]).to.deep.equal({ group: "testOneof", activeField: "name", previousField: undefined });

    cube.subMessage = { red: 1, green: 2, blue: 3 };
    expect(events).to.have.length(2);
    expect(events[1]).to.deep.equal({ group: "testOneof", activeField: "subMessage", previousField: "name" });

    // Setting the same field again should NOT fire the event
    cube.subMessage = { red: 4, green: 5, blue: 6 };
    expect(events).to.have.length(2);
  });

  it("should return the active FieldNode via __getOneofFieldNode()", () => {
    const cube = new CubeDefinition();
    expect(cube.__getOneofFieldNode("testOneof")).to.be.undefined;

    cube.name = "hello";
    expect(cube.__getOneofFieldNode("testOneof")).to.equal(cube.name);

    cube.subMessage = { red: 1, green: 2, blue: 3 };
    expect(cube.__getOneofFieldNode("testOneof")).to.equal(cube.subMessage);
  });

  it("should not affect non-oneof fields", () => {
    const cube = new CubeDefinition();
    cube.name = "hello";
    cube.length = 500;
    cube.breadth = 500;
    cube.height = 500;

    // Setting a oneof field should not affect regular fields
    cube.subMessage = { red: 1, green: 2, blue: 3 };
    expect(cube.length.__toLiteral()).to.equal(500);
    expect(cube.breadth.__toLiteral()).to.equal(500);
    expect(cube.height.__toLiteral()).to.equal(500);
  });

  it("should reset oneof state on __clear()", () => {
    const cube = new CubeDefinition();
    cube.name = "hello";
    expect(cube.__whichOneof("testOneof")).to.equal("name");

    cube.__clear();
    expect(cube.__whichOneof("testOneof")).to.be.undefined;
  });
});
