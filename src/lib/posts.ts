import { type CollectionEntry, getCollection } from "astro:content";
import type { Locale } from "../config";

async function getAllPosts(): Promise<CollectionEntry<"blog">[]> {
  return getCollection("blog");
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
