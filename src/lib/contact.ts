/**
 * Contact-form logic: validation + Brevo transactional email.
 * Pure and framework-agnostic so it can be unit-tested; the Vercel function in
 * `api/contact.ts` is a thin wrapper around it.
 */

import type { Locale } from "../config";

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

/**
 * Where a no-JS form post lands (`303 See Other`): a static thank-you or
 * error page per locale. With JS the form posts JSON and stays in place.
 */
export type ContactOutcome = "thanks" | "error";
export const contactOutcomePath = (
  locale: Locale,
  outcome: ContactOutcome,
): string => `${locale === "en" ? "/en" : ""}/contact/${outcome}/`;

const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  web: "Site / application web",
  saas: "SaaS",
  mobile: "Application mobile",
  other: "Autre",
};

/**
 * Optional qualifying fields, only on the quote form (/contact/quote), which
 * also posts `intent: "quote"`. Values are allow-listed; anything else is
 * dropped rather than rejected, since the fields are optional.
 */
export const BUDGETS = ["lt5k", "5-15k", "15-40k", "gt40k", "unknown"] as const;
export type Budget = (typeof BUDGETS)[number];
export const TIMELINES = ["asap", "1-3m", "3-6m", "flexible"] as const;
export type Timeline = (typeof TIMELINES)[number];
export const INTENTS = ["quote"] as const;
export type Intent = (typeof INTENTS)[number];

const BUDGET_LABELS: Record<Budget, string> = {
  lt5k: "< 5 k€",
  "5-15k": "5 – 15 k€",
  "15-40k": "15 – 40 k€",
  gt40k: "> 40 k€",
  unknown: "Ne sait pas",
};
const TIMELINE_LABELS: Record<Timeline, string> = {
  asap: "Dès que possible",
  "1-3m": "1 à 3 mois",
  "3-6m": "3 à 6 mois",
  flexible: "Flexible",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX = { name: 100, email: 200, message: 5000 };

export interface ContactSubmission {
  name: string;
  email: string;
  projectType: ProjectType;
  message: string;
  budget?: Budget;
  timeline?: Timeline;
  intent?: Intent;
}

export type ValidationResult =
  | { ok: true; data: ContactSubmission }
  | { ok: false; spam: true }
  | { ok: false; spam: false; error: string };

const asString = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

/** The value if it belongs to `allowed`, otherwise `undefined`. */
const pick = <T extends string>(
  allowed: readonly T[],
  value: unknown,
): T | undefined => (allowed.includes(value as T) ? (value as T) : undefined);

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

  const data: ContactSubmission = { name, email, projectType, message };
  const budget = pick(BUDGETS, r.budget);
  const timeline = pick(TIMELINES, r.timeline);
  const intent = pick(INTENTS, r.intent);
  if (budget) data.budget = budget;
  if (timeline) data.timeline = timeline;
  if (intent) data.intent = intent;

  return { ok: true, data };
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
  const fields: [string, string][] = [
    ["Nom", data.name],
    ["E-mail", data.email],
    ["Type de projet", typeLabel],
  ];
  if (data.budget) fields.push(["Budget", BUDGET_LABELS[data.budget]]);
  if (data.timeline) fields.push(["Délai", TIMELINE_LABELS[data.timeline]]);

  const textContent = [
    ...fields.map(([label, value]) => `${label} : ${value}`),
    "",
    data.message,
  ].join("\n");
  const htmlContent =
    "<h2>Nouveau message du site</h2>" +
    `<p>${fields
      .map(
        ([label, value]) => `<strong>${label} :</strong> ${escapeHtml(value)}`,
      )
      .join("<br>")}</p>` +
    `<p>${escapeHtml(data.message).replace(/\n/g, "<br>")}</p>`;
  // Quote requests are flagged so they stand out in the inbox.
  const prefix = data.intent === "quote" ? "[Devis] " : "";

  return {
    sender: CONTACT_FROM,
    to: [CONTACT_TO],
    replyTo: { email: data.email, name: data.name },
    subject: `${prefix}Nouveau message du site — ${typeLabel} — ${data.name}`,
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
