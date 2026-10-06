import { describe, expect, it } from "vitest";
import type { MockNotification, MockSession } from "../src/types.js";
import { createInbox, matches, mintNotification, senderName } from "../src/Notify.js";

const ALICE = { key: "alice", roles: ["user"] };
const SYSTEM = { key: "system", roles: ["admin", "system"] };

/** A principal the way `principalOf` builds it - an api key and a session look the same here. */
const session = (name: string, via: MockSession["via"] = "session"): MockSession =>
  ({ key: "ci-bot", claims: { name }, token: "", expiresAt: 0, via, kind: "human" }) as MockSession;

/** A stored notification with nothing but its id to tell it apart. */
const note = (id: string, read = false): MockNotification => ({
  id,
  event: "test",
  title: id,
  text: "",
  sender: "spec",
  create_time: "2026-01-01T00:00:00.000Z",
  read,
});

const idsOf = (list: MockNotification[]): string[] => list.map((n) => n.id);

describe("matches", () => {
  it("reaches everyone with all, the default, and a stream without a session too", () => {
    expect(matches("all", ALICE, "system")).toBe(true);
    expect(matches(undefined, ALICE, undefined)).toBe(true);
    expect(matches("all", undefined, undefined)).toBe(true);
  });

  it("skips the sender with others", () => {
    expect(matches("others", SYSTEM, "system")).toBe(false);
    expect(matches("others", ALICE, "system")).toBe(true);
  });

  it("reaches everyone with others when nobody is signed in to send", () => {
    expect(matches("others", ALICE, undefined)).toBe(true);
  });

  it("reaches only the sender with self, and nobody without a sender", () => {
    expect(matches("self", SYSTEM, "system")).toBe(true);
    expect(matches("self", ALICE, "system")).toBe(false);
    expect(matches("self", ALICE, undefined)).toBe(false);
  });

  it("picks users by key and by role", () => {
    expect(matches({ users: ["alice"] }, ALICE, undefined)).toBe(true);
    expect(matches({ users: ["alice"] }, SYSTEM, undefined)).toBe(false);
    expect(matches({ roles: ["admin"] }, SYSTEM, undefined)).toBe(true);
    expect(matches({ roles: ["admin"] }, ALICE, undefined)).toBe(false);
  });

  it("never lets a targeted push reach a stream without a session", () => {
    expect(matches("others", undefined, "system")).toBe(false);
    expect(matches({ roles: ["user"] }, undefined, undefined)).toBe(false);
  });
});

describe("senderName", () => {
  it("names the principal, whichever credential it came with", () => {
    expect(senderName(session("CI Bot", "api-key"))).toBe("CI Bot");
    expect(senderName(session("Alice Anderson"))).toBe("Alice Anderson");
  });

  it("falls back to the mock itself when there is no principal", () => {
    expect(senderName(undefined)).toBe("pico-mock");
  });
});

describe("mintNotification", () => {
  it("fills in the id, the time, the sender and the read flag", () => {
    const n = mintNotification({ to: "all", event: "cube_created", title: "A cube", text: "Cube 1x2x3" }, "System", Date.UTC(2026, 0, 2));

    expect(n).toMatchObject({
      event: "cube_created",
      title: "A cube",
      text: "Cube 1x2x3",
      sender: "System",
      create_time: "2026-01-02T00:00:00.000Z",
      read: false,
    });
    expect(n.id).toMatch(/^[0-9A-HJKMNP-TV-Z]{26}$/);
  });

  it("defaults the event and the text", () => {
    expect(mintNotification({ to: "all", title: "t" }, "s")).toMatchObject({ event: "notification", text: "" });
  });
});

describe("createInbox", () => {
  it("seeds an inbox on first use and lists it newest first", () => {
    const inbox = createInbox(new Map(), () => [note("seed")]);
    inbox.deliver("alice", note("n1"));
    inbox.deliver("alice", note("n2"));

    expect(idsOf(inbox.list("alice"))).toEqual(["n2", "n1", "seed"]);
  });

  it("keeps the inboxes of the users apart", () => {
    const inbox = createInbox(new Map(), () => []);
    inbox.deliver("alice", note("for-alice"));

    expect(idsOf(inbox.list("system"))).toEqual([]);
    expect(idsOf(inbox.list("alice"))).toEqual(["for-alice"]);
  });

  it("lists only the unread ones when asked, and counts them", () => {
    const inbox = createInbox(new Map(), () => [note("old", true)]);
    inbox.deliver("alice", note("new"));

    expect(idsOf(inbox.list("alice", { unreadOnly: true }))).toEqual(["new"]);
    expect(inbox.unreadCount("alice")).toBe(1);
  });

  it("marks by id and all at once, answering with what is left unread", () => {
    const inbox = createInbox(new Map(), () => []);
    ["a", "b", "c"].forEach((id) => {
      inbox.deliver("alice", note(id));
    });

    expect(inbox.markRead("alice", ["a"])).toBe(2);
    expect(inbox.markRead("alice", ["unknown"])).toBe(2);
    expect(inbox.markRead("alice", "all")).toBe(0);
  });

  it("hands out a copy of the list, so a fixture slicing it leaves the inbox alone", () => {
    const inbox = createInbox(new Map(), () => [note("seed")]);
    inbox.list("alice").pop();

    expect(idsOf(inbox.list("alice"))).toEqual(["seed"]);
  });
});
