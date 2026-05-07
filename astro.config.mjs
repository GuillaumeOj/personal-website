// @ts-check
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://guillaume-ojardias.vercel.app',
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
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
