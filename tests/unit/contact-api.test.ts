import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "../../api/contact";

const ORIGIN = "https://guillaume.ojardias.info";
const fields = {
  name: "Jane",
  email: "jane@example.com",
  projectType: "web",
  message: "A booking app.",
};

const jsonPost = (body: unknown) =>
  new Request(`${ORIGIN}/api/contact`, {
    method: "POST",
    headers: {
      origin: ORIGIN,
      host: "guillaume.ojardias.info",
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

const formPost = (
  body: Record<string, string>,
  origin: string | null = ORIGIN,
) =>
  new Request(`${ORIGIN}/api/contact`, {
    method: "POST",
    headers: {
      ...(origin ? { origin } : {}),
      host: "guillaume.ojardias.info",
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(body).toString(),
  });

describe("POST /api/contact", () => {
  const brevo = vi.fn();

  beforeEach(() => {
    vi.stubEnv("BREVO_API_KEY", "test-key");
    brevo.mockResolvedValue(new Response("{}", { status: 201 }));
    vi.stubGlobal("fetch", brevo);
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("answers JSON to the enhanced form", async () => {
    const res = await POST(jsonPost(fields));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(brevo).toHaveBeenCalledOnce();
  });

  it("names the invalid field for the enhanced form", async () => {
    const res = await POST(jsonPost({ ...fields, email: "nope" }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, error: "invalid email" });
  });

  it("redirects a no-JS post to the localized thank-you page", async () => {
    const res = await POST(formPost({ ...fields, locale: "en" }));
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe("/en/contact/thanks/");
    expect(brevo).toHaveBeenCalledOnce();
  });

  it("redirects an invalid no-JS post to the error page", async () => {
    const res = await POST(formPost({ ...fields, message: "", locale: "fr" }));
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe("/contact/error/");
    expect(brevo).not.toHaveBeenCalled();
  });

  it("redirects to the error page when sending fails", async () => {
    brevo.mockResolvedValue(new Response("{}", { status: 500 }));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await POST(formPost({ ...fields, locale: "fr" }));
    expect(res.headers.get("location")).toBe("/contact/error/");
  });

  it("refuses a form post without Origin, landing on the error page", async () => {
    const res = await POST(formPost(fields, null));
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe("/contact/error/");
    expect(brevo).not.toHaveBeenCalled();
  });
});
