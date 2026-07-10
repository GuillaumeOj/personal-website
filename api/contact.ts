import { sendContactEmail, validateSubmission } from "../src/lib/contact.js";
import { json } from "../src/lib/http.js";

export async function POST(req: Request): Promise<Response> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return json(400, { ok: false, error: "invalid json" });
  }

  const result = validateSubmission(raw);
  if (!result.ok) {
    // Honeypot hit: answer 200 so bots can't tell they were filtered.
    if (result.spam) return json(200, { ok: true });
    return json(400, { ok: false, error: result.error });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error("Missing BREVO_API_KEY env var");
    return json(500, { ok: false, error: "server misconfigured" });
  }

  try {
    const sent = await sendContactEmail(result.data, apiKey);
    if (!sent.ok) {
      console.error(`Brevo API returned ${sent.status}`);
      return json(502, { ok: false, error: "send failed" });
    }
  } catch (error) {
    console.error("Brevo request failed", error);
    return json(502, { ok: false, error: "send failed" });
  }

  return json(200, { ok: true });
}
