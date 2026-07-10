import { type CollectionEntry, getCollection } from "astro:content";
import { type Locale, SITE } from "../config";
import { mockPosts, useMocks } from "./mock-posts";

async function getAllPosts(): Promise<CollectionEntry<"blog">[]> {
  const real = await getCollection("blog");
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
