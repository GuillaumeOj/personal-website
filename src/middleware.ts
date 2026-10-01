import { defineMiddleware } from "astro:middleware";
import { isLocale } from "./config";
import { typesetHtml } from "./lib/typography";

/**
 * Typeset every rendered HTML page (apostrophes, French non-breaking spaces,
 * guillemets) in one place, so copy in data modules, frontmatter and Markdown
 * can be written with plain keyboard characters. Runs at build time for the
 * prerendered pages. The locale comes from `<html lang>`.
 */
export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  if (!response.headers.get("content-type")?.includes("text/html")) {
    return response;
  }
  const html = await response.text();
  const lang = /<html[^>]*\slang="([a-z]{2})/i.exec(html)?.[1] ?? "";
  const body = isLocale(lang) ? typesetHtml(html, lang) : html;
  return new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
});
