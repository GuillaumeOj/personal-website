// @ts-check
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { SITE } from './src/config.ts';

export default defineConfig({
  site: SITE.url,
  i18n: {
    defaultLocale: SITE.defaultLocale,
    locales: [...SITE.locales],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [sitemap()],
  image: {
    remotePatterns: [{ protocol: 'https', hostname: '**.amazonaws.com' }],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
