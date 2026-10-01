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

  // Audit S5: name/email feed the subject and Reply-To headers.
  it("collapses control characters in single-line fields", () => {
    const result = validateSubmission({
      ...valid,
      name: "Jane\r\nBcc: victim@example.com",
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.data.name).toBe("Jane Bcc: victim@example.com");
    expect(
      validateSubmission({ ...valid, email: "ja\u0001ne@example.com" }).ok,
    ).toBe(false);
    const nel = validateSubmission({
      ...valid,
      name: "Jane\u0085Bcc: x\u2028y",
    });
    expect(nel.ok).toBe(true);
    if (nel.ok) expect(nel.data.name).toBe("Jane Bcc: x y");
  });

  it("rejects a message made only of control characters", () => {
    expect(validateSubmission({ ...valid, message: "\u0001\n\u0001" }).ok).toBe(
      false,
    );
  });

  it("keeps line breaks in the message but drops other control chars", () => {
    const result = validateSubmission({
      ...valid,
      message: "Line one\r\nLine two\u0007\tend",
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.message).toBe("Line one\nLine two\tend");
  });

  it("rejects a missing name, bad email, or empty message", () => {
    expect(validateSubmission({ ...valid, name: "" }).ok).toBe(false);
    expect(validateSubmission({ ...valid, email: "not-an-email" }).ok).toBe(
      false,
    );
    expect(validateSubmission({ ...valid, message: "   " }).ok).toBe(false);
  });

  it("keeps allow-listed quote fields and drops unknown ones", () => {
    const kept = validateSubmission({
      ...valid,
      budget: "15-40k",
      timeline: "1-3m",
      intent: "quote",
    });
    expect(kept.ok).toBe(true);
    if (kept.ok) {
      expect(kept.data.budget).toBe("15-40k");
      expect(kept.data.timeline).toBe("1-3m");
      expect(kept.data.intent).toBe("quote");
    }

    const dropped = validateSubmission({
      ...valid,
      budget: "1M",
      timeline: "",
      intent: "evil",
    });
    expect(dropped.ok).toBe(true);
    if (dropped.ok) {
      expect(dropped.data).not.toHaveProperty("budget");
      expect(dropped.data).not.toHaveProperty("timeline");
      expect(dropped.data).not.toHaveProperty("intent");
    }
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
    expect(payload.to[0].email).toBe("guillaume@ojardias.me");
    expect(payload.htmlContent).toContain("A&lt;b&gt;");
    expect(payload.htmlContent).toContain("x &amp; y");
    expect(payload.subject).toContain("Application mobile");
  });

  // Audit S6: safe in attribute values too, not only element text.
  it("escapes quotes, single and double", () => {
    const payload = buildBrevoPayload({
      name: `O'Brien "Jo"`,
      email: "a@b.com",
      projectType: "web",
      message: "it's",
    });
    expect(payload.htmlContent).toContain("O&#39;Brien &quot;Jo&quot;");
    expect(payload.htmlContent).toContain("it&#39;s");
    expect(payload.htmlContent).not.toMatch(/O'Brien/);
  });

  it("flags quote requests and lists budget + timeline", () => {
    const payload = buildBrevoPayload({
      name: "Jane",
      email: "jane@example.com",
      projectType: "saas",
      message: "Hi",
      budget: "gt40k",
      timeline: "asap",
      intent: "quote",
    });
    expect(payload.subject.startsWith("[Devis] ")).toBe(true);
    expect(payload.textContent).toContain("Budget : > 40 k€");
    expect(payload.textContent).toContain("Délai : Dès que possible");
    expect(payload.htmlContent).toContain("&gt; 40 k€");
  });

  it("leaves plain messages unflagged", () => {
    const payload = buildBrevoPayload({
      name: "Jane",
      email: "jane@example.com",
      projectType: "web",
      message: "Hi",
    });
    expect(payload.subject.startsWith("Nouveau message")).toBe(true);
    expect(payload.textContent).not.toContain("Budget");
  });
});
