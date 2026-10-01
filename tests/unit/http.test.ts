import { describe, expect, it } from "vitest";
import { rejectForeignRequest } from "../../src/lib/http";

const URL_ = "https://guillaume.ojardias.info/api/contact";

const request = (headers: Record<string, string>) =>
  new Request(URL_, { method: "POST", headers, body: "{}" });

describe("rejectForeignRequest", () => {
  it("lets a same-origin JSON post through", () => {
    const req = request({
      origin: "https://guillaume.ojardias.info",
      host: "guillaume.ojardias.info",
      "content-type": "application/json; charset=utf-8",
    });
    expect(rejectForeignRequest(req)).toBeNull();
  });

  it("accepts a Vercel preview posting to itself", () => {
    const req = request({
      origin: "https://personal-website-git-x.vercel.app",
      "x-forwarded-host": "personal-website-git-x.vercel.app",
      host: "internal",
      "content-type": "application/json",
    });
    expect(rejectForeignRequest(req)).toBeNull();
  });

  it("lets a client without Origin through (curl, server-side)", () => {
    const req = request({ "content-type": "application/json" });
    expect(rejectForeignRequest(req)).toBeNull();
  });

  it("rejects a cross-site origin with 403", () => {
    const req = request({
      origin: "https://evil.example",
      host: "guillaume.ojardias.info",
      "content-type": "application/json",
    });
    expect(rejectForeignRequest(req)?.status).toBe(403);
  });

  it("rejects an opaque or malformed origin with 403", () => {
    const req = request({
      origin: "null",
      host: "guillaume.ojardias.info",
      "content-type": "application/json",
    });
    expect(rejectForeignRequest(req)?.status).toBe(403);
  });

  it("rejects a text/plain body (no-CORS simple request) with 415", () => {
    const req = request({
      origin: "https://guillaume.ojardias.info",
      host: "guillaume.ojardias.info",
      "content-type": "text/plain",
    });
    expect(rejectForeignRequest(req)?.status).toBe(415);
  });

  it("rejects a missing content type with 415", () => {
    const req = new Request(URL_, { method: "POST" });
    expect(rejectForeignRequest(req)?.status).toBe(415);
  });
});
