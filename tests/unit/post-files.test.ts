import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { SITE } from "../../src/config";
import { readPostFiles } from "../../src/lib/post-files";

const BLOG_DIR = fileURLToPath(
  new URL("../../src/content/blog", import.meta.url),
);

interface Article {
  lang: string;
  fileName: string;
  filePath: string;
  frontmatter: Record<string, string>;
}

function readArticles(): Article[] {
  const out: Article[] = [];
  for (const lang of SITE.locales) {
    const dir = path.join(BLOG_DIR, lang);
    for (const fileName of readdirSync(dir).filter((f) => f.endsWith(".md"))) {
      const filePath = path.join(dir, fileName);
      const block = /^---\n([\s\S]*?)\n---/.exec(
        readFileSync(filePath, "utf8"),
      );
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
  it("publishes articles in both locales", () => {
    expect(articles.length).toBeGreaterThan(0);
    for (const lang of SITE.locales) {
      expect(articles.filter((a) => a.lang === lang).length).toBeGreaterThan(0);
    }
  });

  /**
   * Not cosmetic: `readPostFiles()` globs `*.md` and the sitemap keys off the
   * frontmatter, but a date-prefixed name is what keeps the directory readable
   * in publication order.
   */
  it("names every file YYYY-MM-DD-<slug>.md", () => {
    for (const { fileName } of articles) {
      expect(fileName).toMatch(/^\d{4}-\d{2}-\d{2}-[a-z0-9-]+\.md$/);
    }
  });

  it("declares a lang matching the directory, with unique slugs per locale", () => {
    for (const lang of SITE.locales) {
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
    for (const [key, langs] of byKey) {
      expect([...langs].sort(), key).toEqual([...SITE.locales].sort());
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
  /**
   * The sitemap's `<lastmod>` is built from this at Astro config load, where
   * `astro:content` does not exist — so it must agree with the collection's
   * view of the same files.
   */
  it("agrees with the frontmatter on every published slug and date", () => {
    const fromDisk = readPostFiles()
      .map((p) => `${p.lang}:${p.slug}:${p.pubDate.toISOString().slice(0, 10)}`)
      .sort();
    const expected = articles
      .filter((a) => a.frontmatter.draft !== "true")
      .map((a) => `${a.lang}:${a.frontmatter.slug}:${a.frontmatter.pubDate}`)
      .sort();
    expect(fromDisk).toEqual(expected);
  });
});
