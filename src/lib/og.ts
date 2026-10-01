import type { Locale } from "../config";

/**
 * Open Graph card URLs. The site previously shipped the raw vertical portrait
 * as its `og:image`, which every `summary_large_image` share cropped into a
 * sliver; it now serves real **1200×630** landscape cards under `/og/`,
 * composed with `sharp` (`lib/og-compose.ts`) by the prerendered endpoints in
 * `src/pages/og/`. This module only resolves their URLs: no `sharp`, no
 * filesystem, so the layouts can import it.
 */

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

export interface SocialImage {
  url: string;
  width: number;
  height: number;
}

/**
 * The sitewide default landscape card for a locale — used by home, /about, the
 * projects hub, the blog list, and as the cover-less-article fallback.
 * Resolves to `/og/default-{locale}.jpg` at 1200×630: a JPEG, since the
 * portrait photo made the PNG ~680 KB and some scrapers (WhatsApp) skip images
 * much above 300 KB.
 */
export function defaultSocialImage(locale: Locale): SocialImage {
  return {
    url: `/og/default-${locale}.jpg`,
    width: OG_WIDTH,
    height: OG_HEIGHT,
  };
}

/**
 * The per-project landscape card (project screenshot inset on the branded
 * canvas). Resolves to `/og/project-{slug}-{locale}.png` at 1200×630.
 */
/** The project card's id in its URL, the `[card]` param of its endpoint. */
export const projectCardId = (slug: string, locale: Locale): string =>
  `${slug}-${locale}`;

export function projectSocialImage(slug: string, locale: Locale): SocialImage {
  return {
    url: `/og/project-${projectCardId(slug, locale)}.png`,
    width: OG_WIDTH,
    height: OG_HEIGHT,
  };
}

// Blog articles have no resolver here: `cover` is required by the content
// schema, so every article crops its own 1200×630 card with `getImage()` in
// BlogPostLayout and passes it straight to BaseLayout. There is no cover-less
// branch left to fall back from.
