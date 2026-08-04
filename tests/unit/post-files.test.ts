import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { readPostFiles } from "../../src/lib/post-files";

const BLOG_DIR = fileURLToPath(
  new URL("../../src/content/blog", import.meta.url),
);
const LOCALES = ["fr", "en"] as const;

interface Article {
  lang: string;
  fileName: string;
  filePath: string;
  frontmatter: Record<string, string>;
}

/**
 * Minimal frontmatter reader. Only scalar `key: value` lines are needed, and
 * keeping it dependency-free means this test never validates the content
 * through the same parser the site uses — a bug in one won't hide a bug in the
 * other.
 */
function readArticles(): Article[] {
  const out: Article[] = [];
  for (const lang of LOCALES) {
    const dir = path.join(BLOG_DIR, lang);
    for (const fileName of readdirSync(dir).filter((f) => f.endsWith(".md"))) {
      const filePath = path.join(dir, fileName);
      const raw = readFileSync(filePath, "utf8");
      const block = /^---\n([\s\S]*?)\n---/.exec(raw);
      expect(block, `${lang}/${fileName} has a frontmatter block`).toBeTruthy();
      const frontmatter: Record<string, string> = {};
      for (const line of (block as RegExpExecArray)[1].split("\n")) {
        const kv = /^([a-zA-Z]+):\s*(.*)$/.exec(line);
        if (kv) frontmatter[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, "");
      }
      out.push({ lang, fileName, filePath, frontmatter });
    }
  }
  return out;
}

const articles = readArticles();

describe("blog content invariants", () => {
  it("has the published articles, evenly paired across locales", () => {
    expect(articles).toHaveLength(14);
    for (const lang of LOCALES) {
      expect(articles.filter((a) => a.lang === lang)).toHaveLength(7);
    }
  });

  it("names every file YYYY-MM-DD-<slug>.md", () => {
    for (const { fileName } of articles) {
      expect(fileName).toMatch(/^\d{4}-\d{2}-\d{2}-[a-z0-9-]+\.md$/);
    }
  });

  /**
   * This is the invariant that licenses `post-files.ts` to parse filenames only
   * (it runs at Astro config load, where `astro:content` does not exist). If a
   * filename ever drifts from its frontmatter, the sitemap would advertise a
   * `<lastmod>` or a URL that the built page doesn't match.
   */
  it("keeps the filename date and slug in sync with the frontmatter", () => {
    for (const { fileName, frontmatter } of articles) {
      const [, date, slug] = /^(\d{4}-\d{2}-\d{2})-(.+)\.md$/.exec(
        fileName,
      ) as RegExpExecArray;
      expect(frontmatter.slug, fileName).toBe(slug);
      expect(frontmatter.pubDate, fileName).toBe(date);
    }
  });

  it("declares a lang matching the directory, with unique slugs per locale", () => {
    for (const lang of LOCALES) {
      const inLocale = articles.filter((a) => a.lang === lang);
      for (const { fileName, frontmatter } of inLocale) {
        expect(frontmatter.lang, fileName).toBe(lang);
      }
      const slugs = inLocale.map((a) => a.frontmatter.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });

  it("pairs each translationKey exactly once per locale", () => {
    const byKey = new Map<string, string[]>();
    for (const { lang, frontmatter } of articles) {
      const key = frontmatter.translationKey;
      expect(key).toBeTruthy();
      byKey.set(key, [...(byKey.get(key) ?? []), lang]);
    }
    expect(byKey.size).toBe(7);
    for (const [key, langs] of byKey) {
      expect([...langs].sort(), key).toEqual(["en", "fr"]);
    }
  });

  /**
   * Replaces the old runtime `withPrimaryLocaleCovers` inheritance: both files
   * in a pair now name the same cover, and Astro dedupes the identical import.
   */
  it("gives both halves of a pair the same cover", () => {
    const byKey = new Map<string, Set<string>>();
    for (const { frontmatter } of articles) {
      const key = frontmatter.translationKey;
      byKey.set(key, (byKey.get(key) ?? new Set()).add(frontmatter.cover));
    }
    for (const [key, covers] of byKey) {
      expect([...covers], `pair "${key}" shares one cover`).toHaveLength(1);
    }
  });

  it("points every cover at a file that exists", () => {
    for (const { filePath, fileName, frontmatter } of articles) {
      const resolved = path.resolve(path.dirname(filePath), frontmatter.cover);
      expect(existsSync(resolved), `${fileName} → ${frontmatter.cover}`).toBe(
        true,
      );
    }
  });
});

describe("readPostFiles", () => {
  it("reads every article with a parsed date and slug", () => {
    const posts = readPostFiles();
    expect(posts).toHaveLength(14);
    for (const post of posts) {
      expect(post.pubDate.toString()).not.toBe("Invalid Date");
      expect(post.slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("agrees with the frontmatter on every slug/date pair", () => {
    const fromDisk = readPostFiles()
      .map((p) => `${p.lang}:${p.slug}:${p.pubDate.toISOString().slice(0, 10)}`)
      .sort();
    const expected = articles
      .map((a) => `${a.lang}:${a.frontmatter.slug}:${a.frontmatter.pubDate}`)
      .sort();
    expect(fromDisk).toEqual(expected);
  });
});
