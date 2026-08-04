import type { MarkdownHeading } from "astro";

export interface TocHeading {
  id: string;
  text: string;
}

/**
 * Narrow Astro's markdown headings to the ones the floating table of contents
 * shows. Only `##` is listed: articles use `###` for sub-steps, and surfacing
 * those turns a 6-item rail into a 20-item wall.
 *
 * Ids come from Astro's own heading plugin (github-slugger), so they always
 * match the `id` attributes in the rendered HTML — the previous Notion pipeline
 * had to inject them by regex and keep a private slugify in sync.
 */
export function tocFromHeadings(headings: MarkdownHeading[]): TocHeading[] {
  return headings
    .filter((heading) => heading.depth === 2)
    .map((heading) => ({ id: heading.slug, text: heading.text }));
}
