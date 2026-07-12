// @ts-check
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { SITE } from "./src/config.ts";

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
    }),
  ],
  image: {
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
