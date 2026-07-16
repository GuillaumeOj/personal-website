import type { CollectionEntry } from "astro:content";
import { type Locale, SITE } from "../config";
import { mockPosts, useMocks } from "./mock-posts";

/**
 * Load the real (Notion-backed) posts. `getCollection` lives in the
 * `astro:content` virtual module, which only exists inside the Astro runtime, so
 * it's imported lazily: that lets this module also be pulled into
 * `astro.config.mjs` (the sitemap `lastmod` precompute) where the virtual module
 * isn't resolvable. There it throws and we fall back to no real posts — the mock
 * fixtures (dev/test) still supply dates, and a token-backed prod config phase
 * simply gets the build date on blog URLs.
 */
async function loadRealPosts(): Promise<CollectionEntry<"blog">[]> {
  try {
    const { getCollection } = await import("astro:content");
    return await getCollection("blog");
  } catch {
    return [];
  }
}

async function getAllPosts(): Promise<CollectionEntry<"blog">[]> {
  const real = await loadRealPosts();
  const posts = useMocks ? [...real, ...mockPosts] : real;
  return withPrimaryLocaleCovers(posts);
}

/**
 * Covers are only set on the primary-locale (`SITE.defaultLocale`) version of
 * each article. Give every translation the cover of its primary-locale sibling
 * (matched on `translationKey`) so it shares the same image without needing its
 * own cover in Notion. Posts with no primary-locale cover are left untouched.
 */
function withPrimaryLocaleCovers(
  posts: CollectionEntry<"blog">[],
): CollectionEntry<"blog">[] {
  const coverByKey = new Map<string, string>();
  for (const post of posts) {
    if (
      post.data.lang === SITE.defaultLocale &&
      post.data.translationKey &&
      post.data.cover
    ) {
      coverByKey.set(post.data.translationKey, post.data.cover);
    }
  }
  return posts.map((post) => {
    const cover = coverByKey.get(post.data.translationKey);
    return cover ? { ...post, data: { ...post.data, cover } } : post;
  });
}

export async function getPostsForLocale(
  locale: Locale,
  limit?: number,
): Promise<CollectionEntry<"blog">[]> {
  const posts = (await getAllPosts())
    .filter((post) => post.data.lang === locale && !post.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  return limit === undefined ? posts : posts.slice(0, limit);
}

export async function findSibling(
  translationKey: string,
  locale: Locale,
): Promise<CollectionEntry<"blog"> | undefined> {
  const posts = await getAllPosts();
  return posts.find(
    (p) =>
      p.data.translationKey === translationKey &&
      p.data.lang === locale &&
      !p.data.draft,
  );
}

export async function findBySlug(
  slug: string,
  locale: Locale,
): Promise<CollectionEntry<"blog"> | undefined> {
  const posts = await getPostsForLocale(locale);
  return posts.find((p) => p.data.slug === slug);
}
