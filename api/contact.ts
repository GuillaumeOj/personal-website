import {
  type ContactOutcome,
  contactOutcomePath,
  sendContactEmail,
  validateSubmission,
} from "../src/lib/contact.js";
import {
  json,
  mediaType,
  redirect,
  rejectForeignRequest,
} from "../src/lib/http.js";

const FORM_TYPE = "application/x-www-form-urlencoded";

/**
 * Two callers: the enhanced form posts JSON and gets JSON back; without JS the
 * browser posts the form itself (urlencoded) and gets a `303` to a static
 * thank-you or error page, picked by the posted `locale` field.
 */
export async function POST(req: Request): Promise<Response> {
  const isForm = mediaType(req) === FORM_TYPE;
  const rejected = rejectForeignRequest(
    req,
    isForm ? { types: [FORM_TYPE], requireOrigin: true } : undefined,
  );
  // A browser posting the form itself must land on a page, never on raw JSON
  // (e.g. one that omits Origin). A forged cross-site post only reaches the
  // static error page, so the guard still holds.
  const formError = (): Response =>
    redirect(
      contactOutcomePath(
        req.headers.get("referer")?.includes("/en/") ? "en" : "fr",
        "error",
      ),
    );
  if (rejected) return isForm ? formError() : rejected;

  let raw: unknown;
  try {
    raw = isForm
      ? Object.fromEntries(new URLSearchParams(await req.text()))
      : await req.json();
  } catch {
    return isForm
      ? formError()
      : json(400, { ok: false, error: "invalid json" });
  }

  const locale =
    (raw as Record<string, unknown> | null)?.locale === "en" ? "en" : "fr";
  const reply = (status: number, error?: string): Response => {
    if (isForm) {
      const outcome: ContactOutcome = error ? "error" : "thanks";
      return redirect(contactOutcomePath(locale, outcome));
    }
    return json(status, error ? { ok: false, error } : { ok: true });
  };

  const result = validateSubmission(raw);
  if (!result.ok) {
    // Honeypot hit: answer success so bots can't tell they were filtered.
    if (result.spam) return reply(200);
    return reply(400, result.error);
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error("Missing BREVO_API_KEY env var");
    return reply(500, "server misconfigured");
  }

  try {
    const sent = await sendContactEmail(result.data, apiKey);
    if (!sent.ok) {
      console.error(`Brevo API returned ${sent.status}`);
      return reply(502, "send failed");
    }
  } catch (error) {
    console.error("Brevo request failed", error);
    return reply(502, "send failed");
  }

  return reply(200);
}
