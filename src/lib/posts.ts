import { type CollectionEntry, getCollection } from 'astro:content';
import type { Locale } from '../config';
import { mockPosts, useMocks } from './mock-posts';

async function getAllPosts(): Promise<CollectionEntry<'blog'>[]> {
  const real = await getCollection('blog');
  if (useMocks) return [...real, ...mockPosts];
  return real;
}

export async function getPostsForLocale(
  locale: Locale,
  limit?: number,
): Promise<CollectionEntry<'blog'>[]> {
  const posts = (await getAllPosts())
    .filter((post) => post.data.lang === locale && !post.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  return limit === undefined ? posts : posts.slice(0, limit);
}

export async function findSibling(
  translationKey: string,
  locale: Locale,
): Promise<CollectionEntry<'blog'> | undefined> {
  const posts = await getAllPosts();
  return posts.find(
    (p) =>
      p.data.translationKey === translationKey &&
      p.data.lang === locale &&
      !p.data.draft,
  );
}
