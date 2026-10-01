import { articlePath, localizedPath } from "../i18n/ui";
import type { PostFile } from "./post-files";

/**
 * The `noindex` pages — legal pages (notice, privacy policy, terms,
 * accessibility statement) and the no-JS contact-form outcomes — stay out of
 * the sitemap: they shouldn't advertise themselves for crawling.
 */
const NOINDEX =
  /\/(legal-notice|privacy-policy|terms-of-service|accessibility|contact\/(thanks|error))\/?$/;

export const isIndexable = (url: string): boolean =>
  !NOINDEX.test(new URL(url).pathname);

/**
 * Sitemap freshness signal (<lastmod>), only where a real date exists: a
 * post's `updatedDate` (else its `pubDate`), and for each blog index the date
 * of its newest post. Other pages get none: a build timestamp changes on every
 * deploy, which teaches crawlers to ignore `<lastmod>` site-wide.
 *
 * Returns a trailing-slash pathname → ISO-date map, computed once since
 * @astrojs/sitemap's `serialize` runs per URL.
 */
export function lastmodByPath(posts: PostFile[]): Map<string, string> {
  const lastmods = new Map<string, string>();
  for (const post of posts) {
    const date = (post.updatedDate ?? post.pubDate).toISOString();
    lastmods.set(articlePath(post.lang, post.slug), date);
    const index = localizedPath(post.lang, "/blog");
    if ((lastmods.get(index) ?? "") < date) lastmods.set(index, date);
  }
  return lastmods;
}
