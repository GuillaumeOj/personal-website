import { type Locale, SITE } from "../config";
import { articlePath } from "../i18n/ui";

export interface ArticleAlternates {
  hasAlternate: boolean;
  altFrUrl?: string;
  altEnUrl?: string;
}

/**
 * Resolve the hreflang alternates for an article.
 *
 * Blog slugs differ across locales, so a post can only advertise alternates once
 * its translated sibling (shared `translationKey`) is published; otherwise it
 * gets the canonical only.
 *
 * Lives apart from `posts.ts` so it stays free of the `astro:content` import —
 * that virtual module only exists inside the Astro runtime, and this needs to be
 * reachable from plain Vitest. Every published article currently has a sibling,
 * so the empty branch has no fixture in the built site and would otherwise go
 * untested.
 */
export function articleAlternates(opts: {
  locale: Locale;
  slug: string;
  siblingSlug?: string;
}): ArticleAlternates {
  const { locale, slug, siblingSlug } = opts;
  if (!siblingSlug) return { hasAlternate: false };

  const frSlug = locale === "fr" ? slug : siblingSlug;
  const enSlug = locale === "en" ? slug : siblingSlug;
  return {
    hasAlternate: true,
    altFrUrl: new URL(articlePath("fr", frSlug), SITE.url).toString(),
    altEnUrl: new URL(articlePath("en", enSlug), SITE.url).toString(),
  };
}
