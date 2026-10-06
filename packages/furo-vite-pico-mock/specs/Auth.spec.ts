import { describe, expect, it } from "vitest";
import type { MockSession, MockUser } from "../src/types.js";
import {
  SESSION_COOKIE,
  clearedCookie,
  createSessions,
  mintJwt,
  parseCookies,
  renderPicker,
  returnFromReferer,
  safeReturn,
  sessionCookie,
} from "../src/Auth.js";

const ALICE: MockUser = {
  key: "alice",
  claims: {
    sub: "01KBXM420000000000000A11CE",
    preferred_username: "alice",
    name: "Alice Example",
    given_name: "Alice",
    family_name: "Example",
    email: "alice@example.com",
    roles: ["user"],
    features: [],
  },
};

/** A `Cookie` header carrying the session among other cookies, the way a browser sends it. */
const cookieFor = (sid: string): string => `theme=dark; ${SESSION_COOKIE}=${sid}; lang=en`;

/** One segment of a JWT, decoded. */
const decode = (segment: string | undefined): unknown => JSON.parse(Buffer.from(segment ?? "", "base64url").toString("utf8"));

describe("parseCookies", () => {
  it("splits the header and trims around names and values", () => {
    expect(parseCookies("a=1; b = 2 ;c=x=y")).toEqual({ a: "1", b: "2", c: "x=y" });
  });

  it("keeps the first of two cookies with the same name", () => {
    expect(parseCookies("a=1; a=2")).toEqual({ a: "1" });
  });

  it("ignores a missing header and parts without a name", () => {
    expect(parseCookies(undefined)).toEqual({});
    expect(parseCookies("junk; =x")).toEqual({});
  });

  it("treats a name like constructor as a plain cookie", () => {
    expect(parseCookies("constructor=1")).toEqual({ constructor: "1" });
  });
});

describe("createSessions", () => {
  it("resolves the session a login started", () => {
    const sessions = createSessions(new Map());
    const { sid, session } = sessions.login(ALICE, 60, 1_000_000);

    expect(session.key).toBe("alice");
    expect(session.kind).toBe("human");
    expect(session.claims).toEqual(ALICE.claims);
    expect(session.expiresAt).toBe(1_060_000);
    expect(sessions.resolve(cookieFor(sid), 1_000_000)?.session).toBe(session);
  });

  it("resolves nothing without a cookie or for an unknown one", () => {
    const sessions = createSessions(new Map());
    sessions.login(ALICE, 60);

    expect(sessions.resolve(undefined)).toBeUndefined();
    expect(sessions.resolve("theme=dark")).toBeUndefined();
    expect(sessions.resolve(cookieFor("forged"))).toBeUndefined();
  });

  it("drops a session once it ran out", () => {
    const store = new Map<string, MockSession>();
    const sessions = createSessions(store);
    const { sid } = sessions.login(ALICE, 60, 0);

    expect(sessions.resolve(cookieFor(sid), 59_999)).toBeDefined();
    expect(sessions.resolve(cookieFor(sid), 60_000)).toBeUndefined();
    expect(store.size).toBe(0);
  });

  it("ends a session on logout", () => {
    const sessions = createSessions(new Map());
    const { sid } = sessions.login(ALICE, 60);
    sessions.logout(sid);

    expect(sessions.resolve(cookieFor(sid))).toBeUndefined();
  });

  it("looks a session up by its id, and drops it once it ran out", () => {
    const sessions = createSessions(new Map());
    const { sid, session } = sessions.login(ALICE, 60, 0);

    expect(sessions.get(sid, 59_999)).toBe(session);
    expect(sessions.get(sid, 60_000)).toBeUndefined();
    expect(sessions.get(sid, 0)).toBeUndefined();
    expect(sessions.get("unknown")).toBeUndefined();
  });

  it("hands out a different session id per login", () => {
    const sessions = createSessions(new Map());
    expect(sessions.login(ALICE, 60).sid).not.toBe(sessions.login(ALICE, 60).sid);
  });
});

describe("mintJwt", () => {
  it("mints a three part HS256 token carrying the claims and the lifetime", () => {
    const parts = mintJwt(ALICE.claims, 10, 70).split(".");

    expect(parts).toHaveLength(3);
    expect(decode(parts[0])).toEqual({ alg: "HS256", typ: "JWT" });
    expect(decode(parts[1])).toMatchObject({ sub: ALICE.claims.sub, roles: ["user"], iss: "pico-mock", iat: 10, exp: 70 });
    expect(parts[2]).toMatch(/^[\w-]+$/);
  });
});

describe("safeReturn", () => {
  it("keeps a path of the app", () => {
    expect(safeReturn("/cubes/1?tab=2")).toBe("/cubes/1?tab=2");
    expect(safeReturn("/page-home")).toBe("/page-home");
  });

  it("falls back to / for anything that leaves the app", () => {
    ["https://evil.example", "//evil.example", "/\\evil.example", "cubes", "/a\nb", "/api/profile", "/auth.html", "/logout.html?x=1"].forEach((value) => {
      expect(safeReturn(value)).toBe("/");
    });
    expect(safeReturn(undefined)).toBe("/");
  });
});

describe("returnFromReferer", () => {
  it("takes path and query of the referer", () => {
    expect(returnFromReferer("http://localhost:8080/cubes/1?tab=2")).toBe("/cubes/1?tab=2");
  });

  it("gives up on a missing or broken referer", () => {
    expect(returnFromReferer(undefined)).toBeUndefined();
    expect(returnFromReferer("not a url")).toBeUndefined();
  });
});

describe("sessionCookie", () => {
  it("is HttpOnly, SameSite=Lax and lives as long as the session", () => {
    const cookie = sessionCookie("abc", 60, true);

    expect(cookie.startsWith(`${SESSION_COOKIE}=abc;`)).toBe(true);
    expect(cookie).toContain("Path=/");
    expect(cookie).toContain("Max-Age=60");
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("SameSite=Lax");
    expect(cookie).toContain("Secure");
  });

  it("leaves Secure out when told to", () => {
    expect(sessionCookie("abc", 60, false)).not.toContain("Secure");
  });

  it("clears with an empty value and no lifetime", () => {
    const cookie = clearedCookie(true);
    expect(cookie.startsWith(`${SESSION_COOKIE}=;`)).toBe(true);
    expect(cookie).toContain("Max-Age=0");
  });
});

describe("renderPicker", () => {
  it("links every user to the login with the return path", () => {
    const html = renderPicker([ALICE], "/cubes/1", undefined);

    // the href is html escaped, so the & of the query string arrives as &#38;
    expect(html).toContain("/api/_pico-mock/login?user=alice&#38;return=%2Fcubes%2F1");
    expect(html).toContain("Alice Example");
    expect(html).not.toContain("Sign out");
  });

  it("marks the signed in user and offers to sign out", () => {
    const html = renderPicker([ALICE], "/", "alice");

    expect(html).toContain("(signed in)");
    expect(html).toContain("/api/_pico-mock/logout");
  });

  it("escapes what it takes from users.ts", () => {
    const html = renderPicker([{ ...ALICE, claims: { ...ALICE.claims, name: "<b>Alice</b>" } }], "/", undefined);

    expect(html).toContain("&#60;b&#62;Alice&#60;/b&#62;");
    expect(html).not.toContain("<b>Alice</b>");
  });
});
