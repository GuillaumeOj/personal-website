import { type Locale, SITE } from "../config";
import { localizedPath } from "../i18n/ui";
import { tech } from "./home";

/**
 * Site-wide schema.org helpers. The Person, ProfessionalService and WebSite are
 * shared entities referenced by a stable `@id` across pages, so every page that
 * mentions them points at the *same* node rather than redefining it — Google
 * merges `@id`-matched nodes into one entity across the whole site. The full
 * Person/WebSite definitions live on the home page (`homeJsonLd`); About adds
 * the ProfessionalService; other pages reference them by `@id`.
 */

export const PERSON_ID = `${SITE.url}/#person`;
export const BUSINESS_ID = `${SITE.url}/#business`;
export const WEBSITE_ID = `${SITE.url}/#website`;

/** schema.org `inLanguage` (IETF BCP 47) for a locale. */
export const inLanguage = (locale: Locale): string =>
  locale === "fr" ? "fr-FR" : "en-US";

/** Job title, reused by the Person node and the service's `serviceType`. */
export const jobTitle: Record<Locale, string> = {
  fr: "Développeur web & mobile freelance",
  en: "Freelance web & mobile developer",
};

/** Postal address — Lyon, shared by the Person and ProfessionalService. */
export const LYON_ADDRESS = {
  "@type": "PostalAddress",
  addressLocality: "Lyon",
  addressRegion: "Auvergne-Rhône-Alpes",
  addressCountry: "FR",
} as const;

/** The flat list of technologies the Person `knowsAbout`. */
export const knowsAbout: string[] = tech.groups.flatMap((group) => group.items);

/**
 * The canonical Person entity. Defined in full on the home page and referenced
 * by `@id` (`PERSON_ID`) elsewhere. `image` is an absolute URL to the portrait.
 */
export const personNode = (locale: Locale, image: string) => ({
  "@type": "Person",
  "@id": PERSON_ID,
  name: SITE.name,
  jobTitle: jobTitle[locale],
  url: new URL(localizedPath(locale, "/"), SITE.url).toString(),
  image,
  address: LYON_ADDRESS,
  sameAs: Object.values(SITE.social),
  knowsAbout,
});

/** The site-wide WebSite entity, published by the Person. */
export const websiteNode = (locale: Locale) => ({
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE.url,
  name: SITE.name,
  inLanguage: inLanguage(locale),
  publisher: { "@id": PERSON_ID },
});

/** A breadcrumb crumb: a visible `name` and its absolute `url`. */
export interface Crumb {
  name: string;
  url: string;
}

/** A `BreadcrumbList` from ordered crumbs (root first). */
export const breadcrumbList = (items: Crumb[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: item.url,
  })),
});

/**
 * Home page graph: the full WebSite + Person definitions. This is the primary
 * entry point, so it carries the entities every other page references by `@id`.
 */
export const homeJsonLd = (locale: Locale, image: string) => ({
  "@context": "https://schema.org",
  "@graph": [websiteNode(locale), personNode(locale, image)],
});

/** Fields describing a single blog article, resolved by the layout. */
export interface BlogPostSchemaInput {
  url: string;
  title: string;
  description: string;
  /** Absolute cover URL, or undefined when the post has no cover. */
  image?: string;
  /** ISO 8601 publication date. */
  datePublished: string;
  /** ISO 8601 last-modified date, when known. */
  dateModified?: string;
  /** Post author name; falls back to the site Person when absent. */
  authorName?: string;
  breadcrumbs: Crumb[];
}

/**
 * Blog post graph: a `BlogPosting` (authored by the named author or the site
 * Person, published by the site Person, part of the WebSite) plus its
 * breadcrumb trail.
 */
export const blogPostJsonLd = (locale: Locale, input: BlogPostSchemaInput) => {
  const posting = {
    "@type": "BlogPosting",
    "@id": `${input.url}#article`,
    headline: input.title,
    description: input.description,
    inLanguage: inLanguage(locale),
    datePublished: input.datePublished,
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    ...(input.image ? { image: input.image } : {}),
    author: input.authorName
      ? { "@type": "Person", name: input.authorName }
      : { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    mainEntityOfPage: input.url,
    isPartOf: { "@id": WEBSITE_ID },
  };
  return {
    "@context": "https://schema.org",
    "@graph": [posting, breadcrumbList(input.breadcrumbs)],
  };
};

/** Fields describing a single portfolio project, resolved by the layout. */
export interface ProjectSchemaInput {
  url: string;
  name: string;
  description: string;
  image: string;
  /** Live project URL, when public. */
  sameAs?: string;
  /** Tech stack, surfaced as `keywords`. */
  keywords: string[];
  breadcrumbs: Crumb[];
}

/**
 * Project detail graph: a `CreativeWork` created by the site Person (kept
 * deliberately generic — the portfolio mixes apps and showcase sites, so it
 * doesn't claim `SoftwareApplication` for a brochure site) plus its breadcrumb.
 */
export const projectJsonLd = (locale: Locale, input: ProjectSchemaInput) => {
  const work = {
    "@type": "CreativeWork",
    "@id": `${input.url}#project`,
    name: input.name,
    description: input.description,
    url: input.url,
    image: input.image,
    inLanguage: inLanguage(locale),
    creator: { "@id": PERSON_ID },
    keywords: input.keywords,
    isPartOf: { "@id": WEBSITE_ID },
    ...(input.sameAs ? { sameAs: input.sameAs } : {}),
  };
  return {
    "@context": "https://schema.org",
    "@graph": [work, breadcrumbList(input.breadcrumbs)],
  };
};
