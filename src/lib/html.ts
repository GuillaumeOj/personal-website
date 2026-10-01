/**
 * Escape text for HTML/XML element content and quoted attributes (both quote
 * styles). Shared by the contact notification email and the OG card SVGs, so
 * a hardening applied to one output path reaches the other (audit S6).
 */
export const escapeHtml = (s: string): string =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
