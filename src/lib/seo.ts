import { type Locale, SITE } from "../config";
import { absoluteUrl } from "../i18n/ui";
import { defaultSocialImage } from "./og";

/** The brand suffix only when it still fits in what search results show. */
export const TITLE_MAX = 65;

/**
 * The `<title>` and the social-card title of a page.
 *
 * The brand suffix (` — {SITE.name}`) is appended only while the result fits
 * in ~65 characters; a long title keeps its own words instead. `raw` titles
 * (About, which is brand-forward) are used verbatim.
 *
 * The social card (og/twitter) title is the page's own headline with the brand
 * stripped, whether it sits as a suffix (most pages) or a prefix (About):
 * `og:site_name` already carries the name and the card renders it with the
 * portrait, so repeating it wastes the most valuable line of the share.
 */
export function pageTitles(
  title: string,
  raw = false,
): { full: string; social: string } {
  const brandSuffix = ` — ${SITE.name}`;
  const brandPrefix = `${SITE.name} — `;
  const branded = `${title}${brandSuffix}`;
  const full = raw || branded.length > TITLE_MAX ? title : branded;
  const social = full.endsWith(brandSuffix)
    ? full.slice(0, -brandSuffix.length)
    : full.startsWith(brandPrefix)
      ? full.slice(brandPrefix.length)
      : full;
  return { full, social };
}

/**
 * The absolute social-preview image and its dimensions. Pages without their
 * own image get the locale's landscape 1200×630 default card; content pages
 * (blog posts, project details) pass their own image with its dimensions, so
 * scrapers can always render the card without a fetch round-trip.
 */
export function socialImage(
  locale: Locale,
  image?: { url: string; width?: number; height?: number },
): { url: string; width?: number; height?: number } {
  const card = image ?? defaultSocialImage(locale);
  return { ...card, url: absoluteUrl(card.url) };
}
