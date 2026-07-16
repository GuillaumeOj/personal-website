import { describe, expect, it } from "vitest";
import {
  assertMocksAllowed,
  type MockGuardEnv,
} from "../../src/lib/mock-posts";

// The guard must throw ONLY for a genuine Vercel production deploy that would
// silently ship the QA fixtures (no token, no escape hatch). Every build we
// rely on — dev, plain local/CI build, or an explicit opt-in — must pass.

const base: MockGuardEnv = {
  useMocks: true,
  isProd: true,
  vercelEnv: "production",
  allowMockPosts: false,
};

describe("assertMocksAllowed", () => {
  it("throws for a Vercel production deploy with mocks and no escape hatch", () => {
    expect(() => assertMocksAllowed(base)).toThrow(
      /Refusing to build production/,
    );
    expect(() => assertMocksAllowed(base)).toThrow(/NOTION_TOKEN/);
  });

  it("does not throw during astro dev (isProd false)", () => {
    expect(() => assertMocksAllowed({ ...base, isProd: false })).not.toThrow();
  });

  it("does not throw for a plain local/CI build (no VERCEL_ENV=production)", () => {
    expect(() =>
      assertMocksAllowed({ ...base, vercelEnv: undefined }),
    ).not.toThrow();
    expect(() =>
      assertMocksAllowed({ ...base, vercelEnv: "preview" }),
    ).not.toThrow();
  });

  it("does not throw when the ALLOW_MOCK_POSTS escape hatch is set", () => {
    expect(() =>
      assertMocksAllowed({ ...base, allowMockPosts: true }),
    ).not.toThrow();
  });

  it("does not throw when a real token means mocks are off", () => {
    expect(() =>
      assertMocksAllowed({ ...base, useMocks: false }),
    ).not.toThrow();
  });
});
