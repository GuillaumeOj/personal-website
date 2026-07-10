import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  classifyPayload,
  isPageEvent,
  verifySignature,
} from "../../src/lib/notion-webhook";

function sign(body: string, secret: string): string {
  const hex = createHmac("sha256", secret).update(body).digest("hex");
  return `sha256=${hex}`;
}

describe("classifyPayload", () => {
  it("detects a verification payload and extracts the token", () => {
    const body = JSON.stringify({ verification_token: "secret_abc123" });
    const result = classifyPayload(body);
    expect(result).toEqual({ kind: "verification", token: "secret_abc123" });
  });

  it("detects an event payload and extracts the type", () => {
    const body = JSON.stringify({
      id: "evt_1",
      type: "page.content_updated",
      data: { page_id: "p1" },
    });
    expect(classifyPayload(body)).toEqual({
      kind: "event",
      type: "page.content_updated",
    });
  });

  it("returns unknown when neither verification_token nor type is present", () => {
    expect(classifyPayload(JSON.stringify({ foo: "bar" }))).toEqual({
      kind: "unknown",
    });
  });

  it("throws on invalid JSON", () => {
    expect(() => classifyPayload("not json")).toThrow();
  });
});

describe("verifySignature", () => {
  const secret = "secret_test_token";
  const body = JSON.stringify({ id: "evt_1", type: "page.created" });

  it("accepts a valid signature", () => {
    expect(verifySignature(body, sign(body, secret), secret)).toBe(true);
  });

  it("rejects a tampered body", () => {
    const tampered = `${body} `;
    expect(verifySignature(tampered, sign(body, secret), secret)).toBe(false);
  });

  it("rejects a signature computed with a different secret", () => {
    expect(verifySignature(body, sign(body, "other_secret"), secret)).toBe(
      false,
    );
  });

  it("rejects a missing header", () => {
    expect(verifySignature(body, null, secret)).toBe(false);
  });

  it("rejects a header without the sha256= prefix", () => {
    const hex = createHmac("sha256", secret).update(body).digest("hex");
    expect(verifySignature(body, hex, secret)).toBe(false);
  });

  it("rejects a header of the wrong length", () => {
    expect(verifySignature(body, "sha256=abc", secret)).toBe(false);
  });
});

describe("isPageEvent", () => {
  it("accepts page.* event types", () => {
    expect(isPageEvent("page.created")).toBe(true);
    expect(isPageEvent("page.content_updated")).toBe(true);
    expect(isPageEvent("page.properties_updated")).toBe(true);
    expect(isPageEvent("page.deleted")).toBe(true);
  });

  it("rejects non-page event types", () => {
    expect(isPageEvent("database.created")).toBe(false);
    expect(isPageEvent("comment.created")).toBe(false);
    expect(isPageEvent("")).toBe(false);
  });
});
