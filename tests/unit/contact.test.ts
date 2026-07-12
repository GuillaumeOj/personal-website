import { describe, expect, it } from "vitest";
import { buildBrevoPayload, validateSubmission } from "../../src/lib/contact";

const valid = {
  name: "Jane Doe",
  email: "jane@example.com",
  projectType: "web",
  message: "Hello, I would like to build a SaaS.",
};

describe("validateSubmission", () => {
  it("accepts a well-formed submission", () => {
    const result = validateSubmission(valid);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.projectType).toBe("web");
  });

  it('trims fields and defaults an unknown projectType to "other"', () => {
    const result = validateSubmission({
      ...valid,
      name: "  Jane  ",
      projectType: "bogus",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.name).toBe("Jane");
      expect(result.data.projectType).toBe("other");
    }
  });

  it("rejects a missing name, bad email, or empty message", () => {
    expect(validateSubmission({ ...valid, name: "" }).ok).toBe(false);
    expect(validateSubmission({ ...valid, email: "not-an-email" }).ok).toBe(
      false,
    );
    expect(validateSubmission({ ...valid, message: "   " }).ok).toBe(false);
  });

  it("flags a filled honeypot as spam", () => {
    const result = validateSubmission({ ...valid, company: "Acme Corp" });
    expect(result).toEqual({ ok: false, spam: true });
  });
});

describe("buildBrevoPayload", () => {
  it("sets reply-to to the submitter and escapes HTML", () => {
    const payload = buildBrevoPayload({
      name: "A<b>",
      email: "a@b.com",
      projectType: "mobile",
      message: "x & y",
    });
    expect(payload.replyTo).toEqual({ email: "a@b.com", name: "A<b>" });
    expect(payload.to[0].email).toBe("contact@ojardias.me");
    expect(payload.htmlContent).toContain("A&lt;b&gt;");
    expect(payload.htmlContent).toContain("x &amp; y");
    expect(payload.subject).toContain("Application mobile");
  });
});
