import { type Locale, SITE } from "../config";
import { articlePath } from "../i18n/ui";

export interface ArticleAlternates {
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
 * Lives apart from `posts.ts` because it is a pure URL builder with no data
 * access — and, incidentally, that keeps it importable from plain Vitest without
 * the `astro:content` virtual module. Every published article currently has a
 * sibling, so the empty branch has no fixture in the built site and would
 * otherwise go untested.
 */
export function articleAlternates(opts: {
  locale: Locale;
  slug: string;
  siblingSlug?: string;
}): ArticleAlternates {
  const { locale, slug, siblingSlug } = opts;
  if (!siblingSlug) return {};

  const frSlug = locale === "fr" ? slug : siblingSlug;
  const enSlug = locale === "en" ? slug : siblingSlug;
  return {
    altFrUrl: new URL(articlePath("fr", frSlug), SITE.url).toString(),
    altEnUrl: new URL(articlePath("en", enSlug), SITE.url).toString(),
  };
}
