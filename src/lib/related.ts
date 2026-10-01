import type { CollectionEntry } from "astro:content";
import type { Locale } from "../config";
import { getPostsForLocale } from "./posts";
import { getProjects, type Project } from "./projects";

type Post = CollectionEntry<"blog">;

/**
 * Cross-links between projects and blog posts (audit E6), driven by each
 * project's `relatedPosts` (translation keys), so posts and project pages
 * aren't only reachable from their index.
 */

/** Whether `post` is one of the articles written about `project`. */
const isAbout = (project: Project, post: Post): boolean =>
  project.relatedPosts?.includes(post.data.translationKey) ?? false;

/** The posts written about `project`, in `locale`, newest first. */
export const postsForProject = async (
  project: Project,
  locale: Locale,
): Promise<Post[]> =>
  (await getPostsForLocale(locale)).filter((post) => isAbout(project, post));

/** The projects a post is about. */
export const projectsForPost = (post: Post): Project[] =>
  getProjects().filter((project) => isAbout(project, post));

/**
 * Up to `limit` other posts to read after `post`: those about the same
 * project first, then the most recent.
 */
export const relatedPosts = async (
  post: Post,
  locale: Locale,
  limit = 3,
): Promise<Post[]> => {
  const shared = new Set(
    projectsForPost(post).flatMap((project) => project.relatedPosts ?? []),
  );
  const others = (await getPostsForLocale(locale)).filter(
    (other) => other.data.translationKey !== post.data.translationKey,
  );
  const sameProject = others.filter((o) => shared.has(o.data.translationKey));
  const rest = others.filter((o) => !shared.has(o.data.translationKey));
  return [...sameProject, ...rest].slice(0, limit);
};
