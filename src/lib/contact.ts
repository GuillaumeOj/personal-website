/**
 * Contact-form logic: validation + Brevo transactional email.
 * Pure and framework-agnostic so it can be unit-tested; the Vercel function in
 * `api/contact.ts` is a thin wrapper around it.
 */

import type { Locale, Localized } from "../config";
import { escapeHtml } from "./html.js";

export const PROJECT_TYPES = ["web", "saas", "mobile", "other"] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

/**
 * Project-type labels: the form options (`lib/contact-page.ts`) and the
 * notification email (French) both read them, so a new type needs one edit.
 */
export const PROJECT_TYPE_LABELS: Record<ProjectType, Localized> = {
  web: { fr: "Site / application web", en: "Website / web app" },
  saas: { fr: "SaaS", en: "SaaS" },
  mobile: { fr: "Application mobile", en: "Mobile app" },
  other: { fr: "Autre", en: "Other" },
};

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

const text = (value: unknown): string =>
  typeof value === "string" ? value : "";

// biome-ignore lint/suspicious/noControlCharactersInRegex: stripping them is the point
const CONTROL_CHARS = /[\u0000-\u001f\u007f-\u009f\u2028\u2029]+/g;
// biome-ignore lint/suspicious/noControlCharactersInRegex: stripping them is the point
const CONTROL_CHARS_BUT_TAB_LF = /[\u0000-\u0008\u000b-\u001f\u007f-\u009f]/g;

/**
 * Single-line fields (name, email) end up in the email subject and Reply-To:
 * collapse any control character (C0, DEL, C1 incl. NEL), CR/LF and the
 * Unicode line/paragraph separators included, to a space so a value can
 * never smuggle in a header line.
 */
const singleLine = (value: unknown): string =>
  text(value).replace(CONTROL_CHARS, " ").trim();

/**
 * The message keeps its line breaks and tabs, minus other control chars, and
 * is trimmed afterwards so a body of only control characters counts as empty.
 */
const multiLine = (value: unknown): string =>
  text(value)
    .replace(/\r\n?|[\u2028\u2029]/g, "\n")
    .replace(CONTROL_CHARS_BUT_TAB_LF, "")
    .trim();

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
  if (text(r.company).trim() !== "") return { ok: false, spam: true };

  const name = singleLine(r.name);
  const email = singleLine(r.email);
  const message = multiLine(r.message);
  const projectType = (PROJECT_TYPES as readonly unknown[]).includes(
    r.projectType,
  )
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

/** Build the Brevo `POST /v3/smtp/email` payload for a valid submission. */
export function buildBrevoPayload(data: ContactSubmission) {
  const typeLabel = PROJECT_TYPE_LABELS[data.projectType].fr;
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
