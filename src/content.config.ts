import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { SITE } from "./config";

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
      /**
       * Shorter `<title>` / social title (≤ 60 characters) when `title` is too
       * long for search results. The visible H1 keeps `title`.
       */
      seoTitle: z.string().max(60).optional(),
      /**
       * Meta / social description (≤ 160 characters) when `description`, the
       * visible lead, is longer than search results show.
       */
      seoDescription: z.string().max(160).optional(),
      pubDate: z.coerce.date(),
      lang: z.enum(SITE.locales),
      /** URL segment. Differs per locale; must stay stable (SEO). */
      slug: z.string(),
      /** Shared by an FR/EN pair — powers hreflang and the language switcher. */
      translationKey: z.string(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      // Path is resolved relative to the Markdown file (`../../../assets/…` →
      // `src/assets/…`). Bare or tsconfig-aliased paths do NOT resolve through
      // the content layer, so keep them relative. The rendered `alt` is the
      // article title: covers are stock photography set for mood, and repeating
      // the title feeds image search without inventing a description.
      cover: image(),
      /**
       * Where the cover comes from. Required: covers are Unsplash photos, not
       * the site's own work, so each one is credited under the post's hero
       * image (the legal notice points readers there).
       */
      coverCredit: z.object({
        author: z.string(),
        authorUrl: z.string().startsWith("https://unsplash.com/@"),
        url: z.string().startsWith("https://unsplash.com/photos/"),
      }),
      /** Guest byline. Absent (the norm) means the site author. */
      author: z.string().optional(),
    }),
});

export const collections = { blog };
