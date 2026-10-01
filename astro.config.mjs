// @ts-check
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";
import { SITE } from "./src/config.ts";
import { readPostFiles } from "./src/lib/post-files.ts";
import { isIndexable, lastmodByPath } from "./src/lib/sitemap.ts";

// <lastmod> dates (see `lib/sitemap.ts`). Read straight off disk
// (`readPostFiles`) rather than through `astro:content`: that virtual module
// does not exist in the config loader, so querying the collection here always
// failed and silently yielded no dates.
const lastmods = lastmodByPath(readPostFiles());

// The legal notice must show the publisher's postal address and phone number,
// but they stay out of this public repo: they are build-time env vars set on
// Vercel (inlined into the static HTML via `astro:env`). Local, CI and preview
// builds render a placeholder; a production build without them is refused so
// an incomplete legal notice can never ship.
const LEGAL_ENV = ["LEGAL_ADDRESS", "LEGAL_PHONE"];
if (process.env.VERCEL_ENV === "production") {
  const missing = LEGAL_ENV.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(
      `Missing ${missing.join(", ")}: required by the legal notice in production builds.`,
    );
  }
}

export default defineConfig({
  site: SITE.url,
  // One URL per page: the trailing-slash form. Vercel 308-redirects the bare
  // form (`trailingSlash` in vercel.json); internal links use the slash form.
  trailingSlash: "always",
  env: {
    schema: Object.fromEntries(
      LEGAL_ENV.map((name) => [
        name,
        envField.string({
          context: "server",
          access: "public",
          optional: true,
        }),
      ]),
    ),
  },
  i18n: {
    defaultLocale: SITE.defaultLocale,
    locales: [...SITE.locales],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      filter: isIndexable,
      // Emit <xhtml:link rel="alternate" hreflang> for pages that exist in both
      // locales under the same slug (home, /about, listings). Pages with
      // per-locale slugs (blog/project details) simply get no alternate.
      i18n: {
        defaultLocale: SITE.defaultLocale,
        locales: { fr: "fr", en: "en" },
      },
      // Attach <lastmod> where a real date exists (matched on the
      // trailing-slash pathname).
      serialize(item) {
        const lastmod = lastmods.get(new URL(item.url).pathname);
        if (lastmod) item.lastmod = lastmod;
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
