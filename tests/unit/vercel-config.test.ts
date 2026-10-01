import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// `astro preview` doesn't serve vercel.json headers, so e2e can't see them:
// guard the config itself. Audit S3.
const config = JSON.parse(readFileSync("vercel.json", "utf8")) as {
  headers: { source: string; headers: { key: string; value: string }[] }[];
  rewrites: { source: string; destination: string }[];
};
const siteWide = Object.fromEntries(
  (config.headers.find((h) => h.source === "/(.*)")?.headers ?? []).map((h) => [
    h.key,
    h.value,
  ]),
);

describe("vercel.json security headers", () => {
  it("sends a CSP that forbids framing, plugins and foreign scripts", () => {
    const csp = siteWide["Content-Security-Policy"] ?? "";
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("form-action 'self'");
    expect(csp).toMatch(/script-src 'self'(?: 'unsafe-inline')?;/);
  });

  it("sends the companion hardening headers", () => {
    expect(siteWide).toMatchObject({
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    });
    expect(siteWide["Permissions-Policy"]).toContain("camera=()");
    expect(siteWide["Strict-Transport-Security"]).toContain("max-age=");
  });
});

describe("vercel.json rewrites", () => {
  // The build only emits sitemap-index.xml; crawlers that guess /sitemap.xml
  // get the index through this rewrite (invisible to `astro preview`).
  it("serves /sitemap.xml as the sitemap index", () => {
    expect(config.rewrites).toContainEqual({
      source: "/sitemap.xml",
      destination: "/sitemap-index.xml",
    });
  });
});
