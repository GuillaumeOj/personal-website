import { type Locale, SITE } from "../config";
import { ensureTrailingSlash } from "../i18n/ui";
import { occupations } from "./experience";
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

/** Job title — the Person's role (never the ProfessionalService `serviceType`). */
export const jobTitle: Record<Locale, string> = {
  fr: "Développeur web & mobile freelance",
  en: "Freelance web & mobile developer",
};

/**
 * The ProfessionalService `serviceType` — the *services offered*, not the
 * person's job title. Shared by the About and Services pages so the merged
 * `#business` entity reads one consistent list from either. schema.org's
 * `serviceType` has no locale variants, so it stays in one language.
 */
export const SERVICE_TYPES: string[] = [
  "Mobile app development",
  "Web development",
  "SaaS development",
];

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
 *
 * `url` is pinned to the single x-default canonical root (`${SITE.url}/`, the FR
 * home) on *both* locales: one `@id` must resolve to one `url`, so the EN node
 * cannot diverge to `.../en/`. Only `jobTitle` and (on the WebSite) `inLanguage`
 * vary by locale.
 */
export const personNode = (locale: Locale, image: string) => ({
  "@type": "Person",
  "@id": PERSON_ID,
  name: SITE.name,
  jobTitle: jobTitle[locale],
  email: SITE.email,
  url: `${SITE.url}/`,
  image,
  address: LYON_ADDRESS,
  sameAs: Object.values(SITE.social),
  knowsAbout,
  // Structured view of the career the About page renders as prose.
  hasOccupation: occupations(locale),
});

/** The site-wide WebSite entity, published by the Person. */
export const websiteNode = (locale: Locale) => ({
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  // Canonical trailing-slash root, matching the home canonical (not the bare
  // `SITE.url`, which is the non-canonical no-slash form).
  url: ensureTrailingSlash(SITE.url),
  name: SITE.name,
  inLanguage: inLanguage(locale),
  publisher: { "@id": PERSON_ID },
});

/**
 * The canonical local-business entity (`ProfessionalService`, `@id`
 * `BUSINESS_ID`), provided by the Person and serving Lyon/France. Single source
 * of truth referenced by `@id` across Home, About and Services so Google merges
 * them into one local business. `knowsAbout` deliberately lives on the Person
 * only — the `@id` reference carries it — so it is NOT duplicated here. The node
 * is locale-invariant (name, area, service list and address don't translate), so
 * the same entity is emitted from every page — reinforcing the merge.
 */
export const professionalServiceNode = () => ({
  "@type": "ProfessionalService",
  "@id": BUSINESS_ID,
  name: SITE.name,
  url: ensureTrailingSlash(SITE.url),
  provider: { "@id": PERSON_ID },
  areaServed: [
    { "@type": "City", name: "Lyon" },
    { "@type": "Country", name: "France" },
  ],
  serviceType: SERVICE_TYPES,
  address: LYON_ADDRESS,
  isPartOf: { "@id": WEBSITE_ID },
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
 * Home page graph: the full WebSite + Person + ProfessionalService definitions.
 * This is the primary entry point, so it carries the entities every other page
 * references by `@id` — including the `#business` local-business node, so the
 * highest-authority URL (`/`) itself asserts the local business.
 */
export const homeJsonLd = (locale: Locale, image: string) => ({
  "@context": "https://schema.org",
  "@graph": [
    websiteNode(locale),
    personNode(locale, image),
    professionalServiceNode(),
  ],
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
    // Publisher and the author fallback inline a minimal *named* Person: the
    // full Person node lives only on the home page, so a bare `@id` reference
    // wouldn't resolve a name for a validator reading an article page.
    author: input.authorName
      ? { "@type": "Person", name: input.authorName }
      : { "@type": "Person", "@id": PERSON_ID, name: SITE.name },
    publisher: { "@type": "Person", "@id": PERSON_ID, name: SITE.name },
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
  /**
   * Project platform(s). When it includes `"mobile"` the node is emitted as a
   * `SoftwareApplication` (an installable app) rather than a `CreativeWork`.
   */
  platform?: string[];
  /** ISO 8601 publication date (e.g. `${year}-01-01`), when known. */
  datePublished?: string;
  breadcrumbs: Crumb[];
}

/**
 * Project detail graph: a `CreativeWork` created by the site Person — or, for a
 * shipped mobile app (`platform` includes `"mobile"`), a `SoftwareApplication`
 * carrying `applicationCategory`/`operatingSystem` on top of the same
 * CreativeWork properties. The portfolio mixes apps and showcase sites, so the
 * generic `CreativeWork` stays the default for brochure sites. No `aggregateRating`
 * is fabricated. Plus its breadcrumb.
 */
export const projectJsonLd = (locale: Locale, input: ProjectSchemaInput) => {
  const isApp = input.platform?.includes("mobile") ?? false;
  const work = {
    "@type": isApp ? "SoftwareApplication" : "CreativeWork",
    "@id": `${input.url}#project`,
    name: input.name,
    description: input.description,
    url: input.url,
    image: input.image,
    inLanguage: inLanguage(locale),
    creator: { "@id": PERSON_ID },
    keywords: input.keywords,
    isPartOf: { "@id": WEBSITE_ID },
    ...(isApp
      ? {
          applicationCategory: "LifestyleApplication",
          operatingSystem: "iOS, Android",
        }
      : {}),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.sameAs ? { sameAs: input.sameAs } : {}),
  };
  return {
    "@context": "https://schema.org",
    "@graph": [work, breadcrumbList(input.breadcrumbs)],
  };
};

/** Fields describing an indexable hub (the projects / blog list). */
export interface CollectionPageInput {
  /** Canonical (trailing-slash) URL — used as both `@id` and `url`. */
  url: string;
  name: string;
  description: string;
  breadcrumbs: Crumb[];
}

/**
 * Hub graph: a `CollectionPage` (part of the WebSite) plus its breadcrumb
 * (Home › Projects / Home › Blog). Deliberately minimal — no `ItemList` — so the
 * two list pages carry a graph without bloating what Google crawls.
 */
export const collectionPageJsonLd = (
  locale: Locale,
  input: CollectionPageInput,
) => {
  const page = {
    "@type": "CollectionPage",
    "@id": input.url,
    url: input.url,
    name: input.name,
    description: input.description,
    inLanguage: inLanguage(locale),
    isPartOf: { "@id": WEBSITE_ID },
  };
  return {
    "@context": "https://schema.org",
    "@graph": [page, breadcrumbList(input.breadcrumbs)],
  };
};
