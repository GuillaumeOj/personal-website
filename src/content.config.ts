import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({
    base: "./src/content/blog",
    pattern: "{fr,en}/*.md",
    // Explicit on purpose. The default `generateIdDefault` returns the raw
    // frontmatter `slug` when there is one — and there always is here — so the
    // store would be keyed on the URL slug, dropping the locale. FR/EN slugs
    // differ today, but the day a pair shares one the entries would silently
    // collide. Key on the file path instead: `fr/2026-05-07-mon-parcours`.
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      lang: z.enum(["fr", "en"]),
      /** URL segment. Differs per locale; must stay stable (SEO). */
      slug: z.string(),
      /** Shared by an FR/EN pair — powers hreflang and the language switcher. */
      translationKey: z.string(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      // Path is resolved relative to the Markdown file (`../../../assets/…` →
      // `src/assets/…`). Bare or tsconfig-aliased paths do NOT resolve through
      // the content layer, so keep them relative.
      cover: image(),
      /**
       * Optional override. Covers are stock photography chosen to set a mood,
       * so the default stays the article title — a deliberate call (it feeds
       * image search, and the alternative for a purely decorative image would
       * be `alt=""`). Set this when a cover actually depicts something.
       */
      coverAlt: z.string().optional(),
      /** Guest byline. Absent (the norm) means the site author. */
      author: z.string().optional(),
    }),
});

export const collections = { blog };
