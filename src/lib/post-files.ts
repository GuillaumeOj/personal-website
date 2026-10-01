import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { type Locale, SITE } from "../config";

const BLOG_DIR = fileURLToPath(new URL("../content/blog", import.meta.url));

export interface PostFile {
  lang: Locale;
  slug: string;
  pubDate: Date;
  /** Last substantive update, when the post sets `updatedDate`. */
  updatedDate?: Date;
}

/**
 * Pull the scalar frontmatter fields out of a Markdown file.
 *
 * Deliberately not a YAML library: only four unquoted-or-quoted scalars are
 * needed, and the one YAML parser on disk (`js-yaml`) is a transitive dependency
 * of Astro rather than a declared one — relying on it resolving would break the
 * moment hoisting changes.
 */
export function readFrontmatter(filePath: string): Record<string, string> {
  const block = /^---\r?\n([\s\S]*?)\r?\n---/.exec(
    readFileSync(filePath, "utf8"),
  );
  if (!block) return {};
  const fields: Record<string, string> = {};
  for (const line of block[1].split("\n")) {
    const match = /^([a-zA-Z]+):\s*(.*)$/.exec(line);
    if (match) fields[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
  }
  return fields;
}

/**
 * A frontmatter `YYYY-MM-DD` as UTC midnight. Anything else (a datetime, an
 * unpadded day) fails the build here, with the file named, rather than as a
 * bare `RangeError: Invalid time value` from the sitemap config.
 */
const utcDay = (day: string, fileName: string): Date => {
  const date = new Date(`${day}T00:00:00.000Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date "${day}" in ${fileName}: use YYYY-MM-DD`);
  }
  return date;
};

/**
 * Read the published articles straight off disk, without `astro:content`.
 *
 * `astro.config.mjs` needs each post's `pubDate` to stamp `<lastmod>` on blog
 * URLs, but it computes that at config-load time — where the `astro:content`
 * virtual module does not exist. The previous Notion-backed code called
 * `getPostsForLocale()` there, swallowed the resulting import failure and
 * returned `[]`, so in production *every* blog URL silently fell back to the
 * build date. (It looked fine in CI only because the mock fixtures supplied
 * dates through a different code path.)
 *
 * Astro offers no later hook that would help: the sitemap integration's
 * `serialize` receives only the URL, and by `astro:build:done` Vite's module
 * runner is torn down (a dynamic `import()` there fails with "module runner
 * has been closed"). Reading the
 * files ourselves is the supported route, so this parses the same frontmatter
 * the content collection does rather than inferring anything from filenames.
 */
export function readPostFiles(): PostFile[] {
  // Fail loudly if the content root itself is missing. This runs from
  // `astro.config.mjs`, where a mis-resolved `BLOG_DIR` (the config loader
  // bundles this module and has been known to rewrite `import.meta.url` to its
  // temp location) would otherwise return an empty list and silently strip
  // every blog URL of its `<lastmod>`.
  if (!existsSync(BLOG_DIR)) {
    throw new Error(`Blog content directory not found: ${BLOG_DIR}`);
  }
  const posts: PostFile[] = [];
  for (const lang of SITE.locales) {
    const dir = path.join(BLOG_DIR, lang);
    // A locale with no articles yet is legitimate; crashing config load with a
    // raw ENOENT would be a baffling way to report it.
    if (!existsSync(dir)) continue;
    for (const fileName of readdirSync(dir)) {
      if (!fileName.endsWith(".md")) continue;
      const { slug, pubDate, updatedDate, draft } = readFrontmatter(
        path.join(dir, fileName),
      );
      // Drafts render no page, so a `<lastmod>` for one would point at a 404.
      if (!slug || !pubDate || draft === "true") continue;
      posts.push({
        lang,
        slug,
        pubDate: utcDay(pubDate, fileName),
        ...(updatedDate ? { updatedDate: utcDay(updatedDate, fileName) } : {}),
      });
    }
  }
  return posts;
}
