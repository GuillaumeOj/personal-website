import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Locale } from "../config";

const BLOG_DIR = fileURLToPath(new URL("../content/blog", import.meta.url));

/** Filenames are `YYYY-MM-DD-<slug>.md` — the date and slug are both meaningful. */
const FILENAME = /^(\d{4}-\d{2}-\d{2})-([a-z0-9-]+)\.md$/;

export interface PostFile {
  lang: Locale;
  slug: string;
  pubDate: Date;
  fileName: string;
}

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
 * Now that articles are files, the frontmatter is readable without any Astro
 * runtime. Only the filename is parsed — no YAML — which is safe because
 * `tests/unit/post-files.test.ts` asserts every filename's date and slug match
 * that file's frontmatter.
 */
export function readPostFiles(): PostFile[] {
  // Fail loudly if the content root itself is missing. This runs from
  // `astro.config.mjs`, where a mis-resolved `BLOG_DIR` (the config loader has
  // been known to rewrite `import.meta.url` — see the `assetUrl` note in
  // `lib/og.ts`) would otherwise return an empty list and silently push every
  // blog URL back onto the build date, which is the exact bug this replaced.
  if (!existsSync(BLOG_DIR)) {
    throw new Error(`Blog content directory not found: ${BLOG_DIR}`);
  }
  const posts: PostFile[] = [];
  for (const lang of ["fr", "en"] as const) {
    const dir = path.join(BLOG_DIR, lang);
    // A locale with no articles yet is legitimate; crashing config load with a
    // raw ENOENT would be a baffling way to report it.
    if (!existsSync(dir)) continue;
    for (const fileName of readdirSync(dir)) {
      const match = FILENAME.exec(fileName);
      if (!match) continue;
      const [, date, slug] = match;
      posts.push({
        lang,
        slug,
        pubDate: new Date(`${date}T00:00:00.000Z`),
        fileName,
      });
    }
  }
  return posts;
}
