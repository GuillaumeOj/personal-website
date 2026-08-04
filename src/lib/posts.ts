import { type CollectionEntry, getCollection } from "astro:content";
import type { Locale } from "../config";

export async function getPostsForLocale(
  locale: Locale,
  limit?: number,
): Promise<CollectionEntry<"blog">[]> {
  const posts = (await getCollection("blog"))
    .filter((post) => post.data.lang === locale && !post.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  return limit === undefined ? posts : posts.slice(0, limit);
}

export async function findSibling(
  translationKey: string,
  locale: Locale,
): Promise<CollectionEntry<"blog"> | undefined> {
  const posts = await getCollection("blog");
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
