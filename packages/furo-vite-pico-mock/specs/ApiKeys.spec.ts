import { describe, expect, it, vi } from "vitest";
import type { MockApiKey, MockAuthOptions, MockUser } from "../src/types.js";
import { createApiKeys } from "../src/ApiKeys.js";

const ALICE: MockUser = {
  key: "alice",
  claims: {
    sub: "01KBXM420000000000000A11CE",
    preferred_username: "alice",
    name: "Alice Example",
    given_name: "Alice",
    family_name: "Example",
    email: "alice@example.com",
    roles: ["user", "editor"],
    features: ["weekend-view", "beta"],
  },
};

const BOT: MockUser = {
  key: "ci-bot",
  kind: "service",
  claims: { ...ALICE.claims, sub: "01KBXM4200000000000000C1B0", preferred_username: "ci-bot", name: "CI Bot", roles: ["service"], features: [] },
};

const OPTIONS: MockAuthOptions = { sessionTtlSeconds: 3600, secureCookie: true };

const NOW = 1_700_000_000_000;

const keys = (...list: MockApiKey[]) => createApiKeys(list, [ALICE, BOT], OPTIONS);

/** One segment of a JWT, decoded. */
const decode = (segment: string | undefined): unknown => JSON.parse(Buffer.from(segment ?? "", "base64url").toString("utf8"));

describe("createApiKeys - the header", () => {
  it("resolves a bearer token, whatever the case of the scheme", () => {
    const api = keys({ token: "api-key-bot", user: "ci-bot", label: "bot" });

    for (const header of ["Bearer api-key-bot", "bearer api-key-bot", "BEARER  api-key-bot  "]) {
      const { principal, error } = api.resolve(header, NOW);
      expect(error).toBeUndefined();
      expect(principal?.key).toBe("ci-bot");
    }
  });

  it("resolves nothing at all without a header, so the caller can fall back to the cookie", () => {
    const api = keys({ token: "api-key-bot", user: "ci-bot" });

    expect(api.resolve(undefined, NOW)).toEqual({});
    expect(api.resolve("   ", NOW)).toEqual({});
  });

  it("refuses a header that is not `Bearer <token>`", () => {
    const api = keys({ token: "api-key-bot", user: "ci-bot" });

    for (const header of ["api-key-bot", "Basic YWxpY2U6cHc=", "Bearer", "Bearer api key"]) {
      const { principal, error } = api.resolve(header, NOW);
      expect(principal).toBeUndefined();
      expect(error?.status).toBe(401);
      expect(error?.message).toContain("`Bearer <api key>`");
    }
  });

  it("never names /auth.html - whatever sent a bearer cannot follow a login page", () => {
    const api = keys({ token: "api-key-bot", user: "ci-bot" });

    for (const header of ["Basic abc", "Bearer nope"]) {
      expect(api.resolve(header, NOW).error?.message).not.toContain("auth.html");
    }
  });
});

describe("createApiKeys - refusals", () => {
  it("refuses an unknown token without echoing it", () => {
    const { principal, error } = keys({ token: "api-key-bot", user: "ci-bot" }).resolve("Bearer api-key-supersecret", NOW);

    expect(principal).toBeUndefined();
    expect(error).toMatchObject({ status: 401, error: "unauthenticated" });
    expect(error?.message).toContain("unknown or revoked");
    expect(error?.message).not.toContain("api-key-supersecret");
    expect(error?.message).toContain("cret");
  });

  it("answers a revoked key exactly the way it answers an unknown one", () => {
    const unknown = keys({ token: "api-key-bot", user: "ci-bot" }).resolve("Bearer api-key-gone", NOW).error;
    const revoked = keys({ token: "api-key-gone", user: "ci-bot", disabled: true }).resolve("Bearer api-key-gone", NOW).error;

    expect(revoked?.message).toBe(unknown?.message);
  });

  it("refuses an expired key and names the expiry", () => {
    const api = keys({ token: "api-key-old", user: "alice", label: "old", expiresAt: "2020-01-01T00:00:00Z" });
    const { principal, error } = api.resolve("Bearer api-key-old", NOW);

    expect(principal).toBeUndefined();
    expect(error?.message).toContain("2020-01-01T00:00:00.000Z");
  });

  it("accepts a key whose expiry has not arrived yet", () => {
    const api = keys({ token: "api-key-old", user: "alice", expiresAt: new Date(NOW + 1000).toISOString() });

    expect(api.resolve("Bearer api-key-old", NOW).principal?.key).toBe("alice");
    expect(api.resolve("Bearer api-key-old", NOW + 2000).error?.message).toContain("expired");
  });

  it("refuses a key naming a user that is not in users.ts, and warns about the typo", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const api = keys({ token: "api-key-ghost", user: "carol", label: `ghost-${Math.random()}` });

    const { principal, error } = api.resolve("Bearer api-key-ghost", NOW);

    expect(principal).toBeUndefined();
    expect(error?.message).toContain('there is no user "carol"');
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("refuses a key whose user is disabled", () => {
    const api = createApiKeys([{ token: "api-key-x", user: "alice", label: "x" }], [{ ...ALICE, disabled: true }], OPTIONS);

    expect(api.resolve("Bearer api-key-x", NOW).error?.message).toContain("disabled");
  });
});

describe("createApiKeys - narrowing", () => {
  it("hands over the user's own claims when the key narrows nothing", () => {
    const { principal } = keys({ token: "api-key-full", user: "alice" }).resolve("Bearer api-key-full", NOW);

    expect(principal?.claims.roles).toEqual(["user", "editor"]);
    expect(principal?.claims.features).toEqual(["weekend-view", "beta"]);
    expect(principal?.claims.email).toBe("alice@example.com");
  });

  it("intersects roles and features, and tells [] apart from absent", () => {
    const { principal } = keys({ token: "api-key-ro", user: "alice", roles: ["user"], features: [] }).resolve("Bearer api-key-ro", NOW);

    expect(principal?.claims.roles).toEqual(["user"]);
    expect(principal?.claims.features).toEqual([]);
  });

  it("cannot grant a role or a feature the user does not hold, and warns", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const api = keys({
      token: "api-key-greedy",
      user: "alice",
      label: `greedy-${Math.random()}`,
      roles: ["user", "admin"],
      features: ["beta", "nonexistent"],
    });

    const { principal } = api.resolve("Bearer api-key-greedy", NOW);

    expect(principal?.claims.roles).toEqual(["user"]);
    expect(principal?.claims.features).toEqual(["beta"]);
    expect(warn.mock.calls.flat().join(" ")).toContain("only narrow, never grant");
    warn.mockRestore();
  });

  it("mints the token from the narrowed claims, not the user's", () => {
    const { principal } = keys({ token: "api-key-ro", user: "alice", roles: ["user"], features: [] }).resolve("Bearer api-key-ro", NOW);

    expect(decode(principal?.token.split(".")[1])).toMatchObject({
      roles: ["user"],
      features: [],
      iss: "pico-mock",
      exp: Math.floor((NOW + 3600 * 1000) / 1000),
    });
  });
});

describe("createApiKeys - the principal", () => {
  it("is MockSession shaped, so a fixture cannot tell it from a session beyond `via`", () => {
    const { principal } = keys({ token: "api-key-bot", user: "ci-bot", label: "ci-bot" }).resolve("Bearer api-key-bot", NOW);

    expect(principal).toMatchObject({ key: "ci-bot", via: "api-key", kind: "service", apiKey: "ci-bot" });
    expect(typeof principal?.token).toBe("string");
    expect(principal?.claims.sub).toBe(BOT.claims.sub);
  });

  it("is a personal access token when it acts as a human", () => {
    const { principal } = keys({ token: "pat-alice", user: "alice" }).resolve("Bearer pat-alice", NOW);

    expect(principal).toMatchObject({ key: "alice", via: "api-key", kind: "human" });
  });

  it("labels the key by its last four characters when it has no label", () => {
    const { principal } = keys({ token: "api-key-abcd", user: "alice" }).resolve("Bearer api-key-abcd", NOW);

    expect(principal?.apiKey).toBe("…abcd");
    expect(principal?.apiKey).not.toContain("api-key");
  });

  it("bounds a key without an expiry by sessionTtlSeconds, so the minted token stays short lived", () => {
    const { principal } = keys({ token: "api-key-bot", user: "ci-bot" }).resolve("Bearer api-key-bot", NOW);

    expect(principal?.expiresAt).toBe(NOW + 3600 * 1000);
  });

  it("lets the key's own expiry shorten that window, but never lengthen it", () => {
    const soon = keys({ token: "api-key-soon", user: "alice", expiresAt: new Date(NOW + 5000).toISOString() });
    const far = keys({ token: "api-key-far", user: "alice", expiresAt: "2099-01-01T00:00:00Z" });

    expect(soon.resolve("Bearer api-key-soon", NOW).principal?.expiresAt).toBe(NOW + 5000);
    expect(far.resolve("Bearer api-key-far", NOW).principal?.expiresAt).toBe(NOW + 3600 * 1000);
  });

  it("does not inherit the user's sessionTtlSeconds, which is a browser concern", () => {
    const api = createApiKeys([{ token: "api-key-x", user: "alice" }], [{ ...ALICE, sessionTtlSeconds: 60 }], OPTIONS);

    expect(api.resolve("Bearer api-key-x", NOW).principal?.expiresAt).toBe(NOW + 3600 * 1000);
  });

  it("rejects an unparseable expiresAt rather than treating it as no expiry", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const api = keys({ token: "api-key-bad", user: "alice", label: `bad-${Math.random()}`, expiresAt: "next tuesday" });

    expect(api.resolve("Bearer api-key-bad", NOW).error?.message).toContain("invalid expiresAt");
    warn.mockRestore();
  });
});
