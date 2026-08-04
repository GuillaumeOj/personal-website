// @ts-check
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { SITE } from "./src/config.ts";
import { articlePath } from "./src/i18n/ui.ts";
import { generateOgImages } from "./src/lib/og.ts";
import { readPostFiles } from "./src/lib/post-files.ts";

// Sitemap freshness signal (<lastmod>). Blog URLs carry their article's pubDate;
// every other URL carries the build date. Precomputed once here (config load) as
// a pathname → ISO-date map, since @astrojs/sitemap's `serialize` runs per URL.
// Projects/static pages have no per-item date, so they get the build date
// deliberately (the modified-date upgrade is a separate, later step).
//
// Dates are read straight off disk (`readPostFiles`) rather than through
// `astro:content`: that virtual module does not exist in the config loader, so
// querying the collection here always failed and silently yielded no dates.
const BUILD_DATE = new Date().toISOString();
const blogLastmod = new Map();
for (const post of readPostFiles()) {
  blogLastmod.set(
    articlePath(post.lang, post.slug),
    post.pubDate.toISOString(),
  );
}

export default defineConfig({
  site: SITE.url,
  i18n: {
    defaultLocale: SITE.defaultLocale,
    locales: [...SITE.locales],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    // Build-time Open Graph cards. Composes real 1200×630 landscape share cards
    // (branded canvas + portrait/screenshot + text) with `sharp` and writes them
    // to `dist/og/*.png`, so LinkedIn/Slack/Twitter shares stop cropping the old
    // vertical portrait. Only runs on `astro build` (never `astro dev`). The
    // generator lives in `src/lib/og.ts`. It is imported statically (like the
    // sitemap helpers above) rather than lazily inside the hook: by the time
    // `astro:build:done` runs, Vite's module runner is torn down, so a dynamic
    // `import()` of the TS module fails ("module runner has been closed"). The
    // module is self-contained (no `.png`/`projects.ts` imports), so a top-level
    // import resolves cleanly through the config loader.
    {
      name: "og-cards",
      hooks: {
        "astro:build:done": async ({ dir, logger }) => {
          const written = await generateOgImages(dir);
          logger.info(`Generated ${written.length} OG card(s) into /og/`);
        },
      },
    },
    sitemap({
      // Drop the legal notice + privacy policy: they're `noindex` (thin,
      // low-value), so they shouldn't advertise themselves for crawling.
      filter: (page) =>
        !/\/(legal-notice|privacy-policy)\/?$/.test(new URL(page).pathname),
      // Emit <xhtml:link rel="alternate" hreflang> for pages that exist in both
      // locales under the same slug (home, /about, listings). Pages with
      // per-locale slugs (blog/project details) simply get no alternate.
      i18n: {
        defaultLocale: SITE.defaultLocale,
        locales: { fr: "fr-FR", en: "en-US" },
      },
      // Attach <lastmod>: the article's pubDate for blog URLs, the build date
      // for everything else (matched on the trailing-slash pathname).
      serialize(item) {
        const { pathname } = new URL(item.url);
        item.lastmod = blogLastmod.get(pathname) ?? BUILD_DATE;
        return item;
      },
    }),
  ],
  markdown: {
    // Article bodies are Markdown now, so code fences go through Astro's
    // bundled Shiki instead of the Notion renderer's hljs plugin (which emitted
    // classes no stylesheet ever styled — code blocks shipped unhighlighted).
    // The site toggles dark mode with a `.dark` class, not a media query, so
    // both themes are emitted. `defaultColor: false` makes Shiki inline *only*
    // `--shiki-light`/`--shiki-dark` custom properties and no `color` of its
    // own, so `global.css` can bind them per theme with ordinary specificity —
    // picking a default instead would inline one theme's colours and force
    // every override to be `!important`.
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
      // Long Django/TypeScript lines would otherwise force a horizontal
      // scrollbar inside the prose column on mobile.
      wrap: true,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
