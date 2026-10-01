import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Audit E4: what search results show for every post — `seoTitle` /
// `seoDescription` when set, else the visible title / lead — fits.
const BLOG = "src/content/blog";
const field = (frontmatter: string, key: string): string | undefined =>
  new RegExp(`^${key}:\\s*"?(.*?)"?$`, "m").exec(frontmatter)?.[1];

const posts = ["fr", "en"].flatMap((lang) =>
  readdirSync(path.join(BLOG, lang)).map((file) => {
    const text = readFileSync(path.join(BLOG, lang, file), "utf8");
    return { file: `${lang}/${file}`, fm: text.split("---")[1] };
  }),
);

describe("post search snippets", () => {
  for (const { file, fm } of posts) {
    it(`${file}: title ≤ 60 and description 50–160 characters`, () => {
      const title = field(fm, "seoTitle") ?? field(fm, "title") ?? "";
      const description =
        field(fm, "seoDescription") ?? field(fm, "description") ?? "";
      expect(title.length).toBeLessThanOrEqual(60);
      expect(description.length).toBeLessThanOrEqual(160);
      expect(description.length).toBeGreaterThanOrEqual(50);
    });
  }
});
