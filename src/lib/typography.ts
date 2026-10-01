/**
 * Typographic polish applied to every rendered page (see `src/middleware.ts`),
 * so copy can be written with plain keyboard characters:
 * - both locales: straight apostrophes between letters become ’;
 * - French: non-breaking spaces where French typography requires them, so a
 *   « ? », « : » or the « h » of « 24 h » never wraps onto its own line, and
 *   English curly quotes (from Markdown smartypants) become « guillemets ».
 */
import type { Locale } from "../config";

const NBSP = "\u00a0";
/** Narrow no-break space: before ; ! ? and inside « ». */
const NNBSP = "\u202f";

/** A straight apostrophe, raw or as the entities Astro escapes it to. */
const APOSTROPHE = /(?<=\p{L})(?:'|&#39;|&#x27;)(?=\p{L})/gu;
const UNITS = "h|min|%|€|k€|ans?|mois|jours?|semaines?|Ko|Mo|Go";

const frenchRules: [RegExp, string][] = [
  // English curly quotes → guillemets.
  [/“\s*/g, `«${NNBSP}`],
  [/\s*”/g, `${NNBSP}»`],
  // Guillemets: narrow no-break space inside, whatever was typed.
  [/«[ \u00a0\u202f]*/g, `«${NNBSP}`],
  [/[ \u00a0\u202f]*»/g, `${NNBSP}»`],
  // High punctuation: narrow no-break space before ; ! ? (replacing a typed
  // space, or added after a word when the mark ends a sentence, so URLs,
  // query strings and HTML entities like &amp; stay intact), full no-break
  // space before :
  [/[ \u00a0\u202f]+([;!?])/g, `${NNBSP}$1`],
  [/(?<=[\p{L}\d)»])(?<!&#?\w+)([;!?]+)(?=\s|$)/gu, `${NNBSP}$1`],
  [/[ \u00a0\u202f]+:(?=\s|$|<)/g, `${NBSP}:`],
  // Number + unit, and thousands groups (« 1 500 »).
  [new RegExp(`(\\d) (${UNITS})(?![\\p{L}\\d])`, "gu"), `$1${NBSP}$2`],
  [/(?<=\d) (?=\d{3}(?!\d))/g, NNBSP],
];

/** Typeset a plain-text string (no markup) for `locale`. */
export function typeset(text: string, locale: Locale): string {
  let out = text.replace(APOSTROPHE, "’");
  if (locale === "fr") {
    for (const [pattern, replacement] of frenchRules) {
      out = out.replace(pattern, replacement);
    }
  }
  return out;
}

/** Placeholder (private-use character) for a shielded raw block. */
const SHIELD = "\ue000";
const SHIELDED = /\ue000(\d+)\ue000/g;
/**
 * Elements whose content is code or data, never prose. Only the content is
 * shielded: the opening tag stays, so its prose attributes (a textarea's
 * placeholder) are still typeset.
 */
const RAW = /(<(script|style|pre|code|textarea)\b[^>]*>)([\s\S]*?)(<\/\2>)/gi;
/** Attributes holding visible or announced prose. */
const PROSE_ATTR =
  /(\s(?:alt|title|aria-label|placeholder)="|<meta\s[^>]*?\bcontent=")([^"]*)"/gi;

/**
 * Typeset the text of a rendered HTML document: text between tags plus prose
 * attributes (alt, title, aria-label, placeholder, meta content). Code, pre,
 * scripts (including JSON-LD), styles and textareas are left untouched.
 */
export function typesetHtml(html: string, locale: Locale): string {
  const raw: string[] = [];
  const shielded = html.replace(
    RAW,
    (_, open: string, _tag: string, inner: string, close: string) => {
      raw.push(inner);
      return `${open}${SHIELD}${raw.length - 1}${SHIELD}${close}`;
    },
  );

  const done = shielded
    // Text between tags.
    .replace(/>([^<]+)</g, (_, text: string) => `>${typeset(text, locale)}<`)
    // Prose attributes, inside tags.
    .replace(/<[^>]+>/g, (tag) =>
      tag.replace(
        PROSE_ATTR,
        (_, attr: string, value: string) => `${attr}${typeset(value, locale)}"`,
      ),
    );

  return done.replace(SHIELDED, (_, i) => raw[Number(i)]);
}
