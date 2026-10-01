import type { Locale } from "../config";
import { articlePath, localizedPath, otherLocale } from "../i18n/ui";

/** The site path of a page's version in each locale. */
export type Alternates = Record<Locale, string>;

/**
 * The FR/EN versions of a same-slug page (home, about, services, lists,
 * project details): the `/en` prefix swapped on the current path.
 */
export function prefixAlternates(locale: Locale, pathname: string): Alternates {
  const frPath =
    locale === "fr" ? pathname : pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  return { fr: localizedPath("fr", frPath), en: localizedPath("en", frPath) };
}

/**
 * Resolve an article's FR/EN versions.
 *
 * Blog slugs differ across locales, so a post is only `paired` (and advertises
 * hreflang alternates) once its translated sibling (shared `translationKey`)
 * is published. Until then the language switcher sends the other locale to
 * its blog index.
 *
 * Lives apart from `posts.ts` because it is a pure URL builder with no data
 * access — and, incidentally, that keeps it importable from plain Vitest without
 * the `astro:content` virtual module. Every published article currently has a
 * sibling, so the unpaired branch has no fixture in the built site and would
 * otherwise go untested.
 */
export function articleAlternates(opts: {
  locale: Locale;
  slug: string;
  siblingSlug?: string;
}): { alternates: Alternates; paired: boolean } {
  const { locale, slug, siblingSlug } = opts;
  const other = otherLocale(locale);
  const own = articlePath(locale, slug);
  const sibling = siblingSlug
    ? articlePath(other, siblingSlug)
    : localizedPath(other, "/blog");
  const alternates: Alternates =
    locale === "fr" ? { fr: own, en: sibling } : { fr: sibling, en: own };
  return { alternates, paired: Boolean(siblingSlug) };
}
