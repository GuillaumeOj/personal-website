import { expect, type Page } from "@playwright/test";
import { SITE } from "../../src/config";

/** Production origin: canonical, og:image and JSON-LD URLs are absolute on it. */
export const ORIGIN = SITE.url;

/** A sample FR/EN article pair (differing slugs) and a same-slug project. */
export const SAMPLE_ARTICLE = {
  fr: "/blog/mon-parcours-qui-je-suis/",
  en: "/en/blog/my-journey-who-i-am/",
} as const;
export const SAMPLE_PROJECT = "/projects/fusily/";

/** The section indexes and their visible Home › {Hub} trail. */
export const HUBS = [
  { path: "/services/", trail: ["Accueil", "Prestations"] },
  { path: "/en/services/", trail: ["Home", "Services"] },
  { path: "/projects/", trail: ["Accueil", "Projets"] },
  { path: "/en/projects/", trail: ["Home", "Projects"] },
  { path: "/blog/", trail: ["Accueil", "Blog"] },
  { path: "/en/blog/", trail: ["Home", "Blog"] },
] as const;

/** `content` of a <meta> in <head>, e.g. `meta[property="og:image"]`. */
export const metaContent = (page: Page, selector: string) =>
  page.locator(`head ${selector}`).getAttribute("content");

/** hreflang alternate href for a language (fr / en / x-default). */
export const altHref = (page: Page, lang: string) =>
  page
    .locator(`head link[rel="alternate"][hreflang="${lang}"]`)
    .getAttribute("href");

export interface LdNode {
  "@type": string;
  [key: string]: unknown;
}

const flatten = (raw: string): LdNode[] => {
  const parsed = JSON.parse(raw);
  return (parsed["@graph"] ?? [parsed]) as LdNode[];
};

/**
 * Every JSON-LD node on the page, each `@graph` spread, so a test can find a
 * node by `@type` regardless of how the graphs are split across <script>s.
 */
export async function jsonLdNodes(page: Page): Promise<LdNode[]> {
  const blocks = await page
    .locator('head script[type="application/ld+json"]')
    .allTextContents();
  return blocks.flatMap(flatten);
}

/** Same as `jsonLdNodes`, over raw HTML instead of a live page. */
export const jsonLdNodesFromHtml = (html: string): LdNode[] =>
  [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ].flatMap((m) => flatten(m[1]));

/** The node of a `@type`, asserting it exists. */
export function nodeOfType(nodes: LdNode[], type: string): LdNode {
  const node = nodes.find((n) => n["@type"] === type);
  expect(node, `expected a ${type} JSON-LD node`).toBeTruthy();
  return node as LdNode;
}

/**
 * The page's share card: og:image is absolute on the production origin and
 * contains `card`, carries its 1200×630 landscape dimensions, and
 * twitter:image mirrors it. Returns the og:image URL.
 */
export async function expectShareCard(page: Page, card: string) {
  const img = await metaContent(page, 'meta[property="og:image"]');
  expect(img).toContain(ORIGIN);
  expect(img).toContain(card);
  expect(await metaContent(page, 'meta[property="og:image:width"]')).toBe(
    "1200",
  );
  expect(await metaContent(page, 'meta[property="og:image:height"]')).toBe(
    "630",
  );
  expect(await metaContent(page, 'meta[name="twitter:image"]')).toBe(img);
  return img as string;
}
