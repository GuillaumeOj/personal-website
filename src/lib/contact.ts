/**
 * Contact-form logic: validation + Brevo transactional email.
 * Pure and framework-agnostic so it can be unit-tested; the Vercel function in
 * `api/contact.ts` is a thin wrapper around it.
 */

export type ProjectType = "web" | "saas" | "mobile" | "other";
const PROJECT_TYPES: ProjectType[] = ["web", "saas", "mobile", "other"];

/** Recipient of the notification email. */
const CONTACT_TO = {
  email: "guillaume@ojardias.me",
  name: "Guillaume Ojardias",
};
/** Sender — MUST be a verified sender/domain in the Brevo account. */
const CONTACT_FROM = {
  email: "guillaume@ojardias.me",
  name: "Site guillaume.ojardias.info",
};

const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  web: "Site / application web",
  saas: "SaaS",
  mobile: "Application mobile",
  other: "Autre",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX = { name: 100, email: 200, message: 5000 };

export interface ContactSubmission {
  name: string;
  email: string;
  projectType: ProjectType;
  message: string;
}

export type ValidationResult =
  | { ok: true; data: ContactSubmission }
  | { ok: false; spam: true }
  | { ok: false; spam: false; error: string };

const asString = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

const invalid = (error: string): ValidationResult => ({
  ok: false,
  spam: false,
  error,
});

/**
 * Validate a raw request body. A `spam: true` result means the honeypot was
 * filled — callers should respond with a fake success so bots learn nothing.
 */
export function validateSubmission(raw: unknown): ValidationResult {
  if (typeof raw !== "object" || raw === null) return invalid("invalid body");
  const r = raw as Record<string, unknown>;

  // Honeypot: a real user never fills the hidden `company` field.
  if (asString(r.company) !== "") return { ok: false, spam: true };

  const name = asString(r.name);
  const email = asString(r.email);
  const message = asString(r.message);
  const projectType = PROJECT_TYPES.includes(r.projectType as ProjectType)
    ? (r.projectType as ProjectType)
    : "other";

  if (!name || name.length > MAX.name) return invalid("invalid name");
  if (!EMAIL_RE.test(email) || email.length > MAX.email) {
    return invalid("invalid email");
  }
  if (!message || message.length > MAX.message)
    return invalid("invalid message");

  return { ok: true, data: { name, email, projectType, message } };
}

const escapeHtml = (s: string): string =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Build the Brevo `POST /v3/smtp/email` payload for a valid submission. */
export function buildBrevoPayload(data: ContactSubmission) {
  const typeLabel = PROJECT_TYPE_LABELS[data.projectType];
  const textContent = [
    `Nom : ${data.name}`,
    `E-mail : ${data.email}`,
    `Type de projet : ${typeLabel}`,
    "",
    data.message,
  ].join("\n");
  const htmlContent =
    "<h2>Nouveau message du site</h2>" +
    `<p><strong>Nom :</strong> ${escapeHtml(data.name)}<br>` +
    `<strong>E-mail :</strong> ${escapeHtml(data.email)}<br>` +
    `<strong>Type de projet :</strong> ${escapeHtml(typeLabel)}</p>` +
    `<p>${escapeHtml(data.message).replace(/\n/g, "<br>")}</p>`;

  return {
    sender: CONTACT_FROM,
    to: [CONTACT_TO],
    replyTo: { email: data.email, name: data.name },
    subject: `Nouveau message du site — ${typeLabel} — ${data.name}`,
    textContent,
    htmlContent,
  };
}

/** Send the notification email via Brevo. Resolves with the HTTP status. */
export async function sendContactEmail(
  data: ContactSubmission,
  apiKey: string,
): Promise<{ ok: boolean; status: number }> {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(buildBrevoPayload(data)),
    signal: AbortSignal.timeout(8000),
  });
  return { ok: res.ok, status: res.status };
}
