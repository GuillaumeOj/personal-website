import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import type { Locale } from "../config";

/**
 * Build-time Open Graph card generator + resolver.
 *
 * The site previously shipped the raw 896×1195 portrait (and, worse, a raw
 * 1284×2778 phone screenshot on the Fusily detail) as its `og:image`. Under
 * `twitter:card=summary_large_image` every LinkedIn/Slack/Twitter share cropped
 * that vertical image into a broken sliver. This module composes real
 * **1200×630** landscape cards with `sharp` — a warm branded canvas matching the
 * stone/amber palette, an inset visual (the portrait, or a project screenshot),
 * and legible text — and emits them into the build output under `/og/*.png` via
 * an `astro:build:done` integration hook (see `astro.config.mjs`).
 *
 * The layouts import only the pure resolver helpers below
 * (`defaultSocialImage` / `projectSocialImage` / `articleSocialImage`); the
 * heavy `sharp` composition is dynamically imported and only ever runs at build.
 */

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

/** Every locale gets its own default card (localized tagline). */
const LOCALES: readonly Locale[] = ["fr", "en"];

// Palette mirrors `src/styles/global.css` (light `:root`). A share card always
// renders on a light branded canvas — legibility beats theme-awareness here.
const PAPER = "#faf8f4";
const SURFACE = "#ffffff";
const INK_STRONG = "#1c1917";
const MUTED = "#57534e";
const ACCENT = "#ea7317";
const ACCENT_INK = "#b45309";
const LINE = "#e7e2d9";

const FONT_STACK =
  "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

// ---------------------------------------------------------------------------
// Pure resolvers — imported by the layouts. No `sharp`, no filesystem, no async.
// ---------------------------------------------------------------------------

export interface SocialImage {
  url: string;
  width: number;
  height: number;
}

/**
 * The sitewide default landscape card for a locale — used by home, /about, the
 * projects hub, the blog list, and as the cover-less-article fallback.
 * Resolves to `/og/default-{locale}.png` at 1200×630.
 */
export function defaultSocialImage(locale: Locale): SocialImage {
  return {
    url: `/og/default-${locale}.png`,
    width: OG_WIDTH,
    height: OG_HEIGHT,
  };
}

/**
 * The per-project landscape card (project screenshot inset on the branded
 * canvas). Resolves to `/og/project-{slug}-{locale}.png` at 1200×630.
 */
export function projectSocialImage(slug: string, locale: Locale): SocialImage {
  return {
    url: `/og/project-${slug}-${locale}.png`,
    width: OG_WIDTH,
    height: OG_HEIGHT,
  };
}

/**
 * Social image for a blog article.
 *
 * - With a `cover`: return the cover URL. Dimensions are best-effort — remote
 *   covers can't be measured from a pure sync resolver, but Unsplash (and any
 *   URL that encodes `?w=&h=`) carries them in the query string, so we parse
 *   those when present. Otherwise `width`/`height` are omitted and the caller
 *   simply doesn't emit `og:image:width/height` for that card.
 * - Without a `cover`: fall back to the locale's landscape default card (so
 *   cover-less posts no longer degrade to the vertical portrait).
 */
export function articleSocialImage(opts: { cover?: string; locale: Locale }): {
  url: string;
  width?: number;
  height?: number;
} {
  if (!opts.cover) return defaultSocialImage(opts.locale);
  const dims = dimsFromUrl(opts.cover);
  return { url: opts.cover, ...dims };
}

/** Extract `w`/`h` query params from a remote image URL, when both are present. */
function dimsFromUrl(url: string): { width?: number; height?: number } {
  try {
    const params = new URL(url).searchParams;
    const w = Number(params.get("w"));
    const h = Number(params.get("h"));
    if (Number.isFinite(w) && w > 0 && Number.isFinite(h) && h > 0) {
      return { width: w, height: h };
    }
  } catch {
    // Not an absolute URL / unparseable — fall through to no dims.
  }
  return {};
}

// ---------------------------------------------------------------------------
// Card copy
// ---------------------------------------------------------------------------

/** Role tagline per locale (the localized "· Lyon" marker is rendered separately). */
const TAGLINE: Record<Locale, string> = {
  fr: "Développeur web & mobile freelance",
  en: "Freelance web & mobile developer",
};

const LOCATION = "Lyon · France";
const SITE_HOST = "guillaume.ojardias.info";
const NAME = "Guillaume Ojardias";

const PROJECT_EYEBROW: Record<Locale, string> = {
  fr: "Étude de cas",
  en: "Case study",
};

/**
 * Self-contained project → card metadata, generated at build time. Kept in this
 * module (rather than derived live from `src/lib/projects.ts`) because the
 * generator runs in an `astro:build:done` context where Vite's asset pipeline is
 * no longer active, so `projects.ts`'s `import x from './x.png'` statements can't
 * be resolved. The screenshots are read straight from `src/assets/projects/`
 * instead. Keep the slugs/screenshots here in sync with `projects.ts` when a
 * project is added or renamed (each project's `cover.light` for the locale).
 */
interface ProjectCard {
  slug: string;
  name: Record<Locale, string>;
  /** Light screenshot filename under `src/assets/projects/`, per locale. */
  screenshot: Record<Locale, string>;
}

const PROJECT_CARDS: ProjectCard[] = [
  {
    slug: "fusily",
    name: { fr: "Fusily", en: "Fusily" },
    screenshot: { fr: "fusily-fr-light.webp", en: "fusily-en-light.webp" },
  },
  {
    slug: "ma-garde-sereine",
    name: { fr: "Ma Garde Sereine", en: "Ma Garde Sereine" },
    screenshot: {
      fr: "ma-garde-sereine-fr-light.png",
      en: "ma-garde-sereine-en-light.png",
    },
  },
  {
    slug: "personal-website",
    name: { fr: "Site personnel", en: "Personal website" },
    screenshot: {
      fr: "personal-website-fr-light.png",
      en: "personal-website-en-light.png",
    },
  },
  {
    slug: "dotcraft",
    name: { fr: "dotcraft", en: "dotcraft" },
    screenshot: { fr: "dotcraft-fr.png", en: "dotcraft-en.png" },
  },
  {
    slug: "eva-biezunski-avocate",
    name: { fr: "Eva Biezunski Avocate", en: "Eva Biezunski Avocate" },
    screenshot: { fr: "eb-avocat.png", en: "eb-avocat.png" },
  },
];

// ---------------------------------------------------------------------------
// SVG helpers
// ---------------------------------------------------------------------------

const esc = (s: string): string =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/**
 * Greedy word-wrap tuned for the card fonts. `maxChars` is an approximate
 * budget per line (proportional to the box width / font size); good enough for
 * the short, known strings these cards render.
 */
function wrap(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
      if (lines.length === maxLines - 1) break;
    } else {
      current = candidate;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  return lines.slice(0, maxLines);
}

function textLines(
  lines: string[],
  opts: {
    x: number;
    y: number;
    size: number;
    lineHeight: number;
    weight: number;
    fill: string;
    spacing?: number;
  },
): string {
  const { x, y, size, lineHeight, weight, fill, spacing } = opts;
  return lines
    .map(
      (line, i) =>
        `<text x="${x}" y="${y + i * lineHeight}" font-family="${FONT_STACK}" font-size="${size}" font-weight="${weight}" fill="${fill}"${
          spacing ? ` letter-spacing="${spacing}"` : ""
        }>${esc(line)}</text>`,
    )
    .join("");
}

/** The amber eyebrow: a short tick followed by an uppercase label. */
function eyebrow(x: number, y: number, label: string): string {
  return `
    <rect x="${x}" y="${y - 6}" width="34" height="4" rx="2" fill="${ACCENT}" />
    <text x="${x + 48}" y="${y}" font-family="${FONT_STACK}" font-size="24" font-weight="600" letter-spacing="2" fill="${ACCENT_INK}">${esc(
      label.toUpperCase(),
    )}</text>`;
}

// ---------------------------------------------------------------------------
// Composition (sharp)
// ---------------------------------------------------------------------------

// `sharp` is imported statically (top of file) rather than via a dynamic
// `import()` here: `generateOgImages` runs in the `astro:build:done` hook, by
// which point Vite's module runner is torn down and a dynamic import would fail
// ("module runner has been closed"). A static import is resolved at module load
// (config load), while the runner is still alive. `getSharp` is kept as a thin
// async accessor so the call sites are unchanged.
async function getSharp(): Promise<typeof sharp> {
  return sharp;
}

// Resolve source assets from the project root (`process.cwd()`) rather than
// `import.meta.url`: the Astro config loader bundles this module, which would
// rewrite `import.meta.url` to the config's temp location and break the path.
// `astro build` and `vitest` both run from the project root.
const assetUrl = (rel: string): string =>
  path.join(process.cwd(), "src", "assets", rel);

/** Round the corners of an already-rasterised PNG buffer. */
async function roundCorners(buf: Buffer, radius: number): Promise<Buffer> {
  const sharp = await getSharp();
  const meta = await sharp(buf).metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  const mask = Buffer.from(
    `<svg width="${w}" height="${h}"><rect x="0" y="0" width="${w}" height="${h}" rx="${radius}" ry="${radius}" fill="#fff"/></svg>`,
  );
  return sharp(buf)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
}

/**
 * Compose the default (portrait) card for a locale: the portrait cover-cropped
 * into a full-height right panel, name + tagline + Lyon marker on the left.
 * Returns a 1200×630 PNG buffer.
 */
export async function composeDefaultCard(locale: Locale): Promise<Buffer> {
  const sharp = await getSharp();

  const panelW = 440;
  const panelX = OG_WIDTH - panelW;

  const portrait = await sharp(assetUrl("portrait.jpg"))
    .resize(panelW, OG_HEIGHT, { fit: "cover", position: "top" })
    .png()
    .toBuffer();

  const textX = 80;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_WIDTH}" height="${OG_HEIGHT}" viewBox="0 0 ${OG_WIDTH} ${OG_HEIGHT}">
    <rect width="${OG_WIDTH}" height="${OG_HEIGHT}" fill="${PAPER}" />
    <rect x="0" y="0" width="12" height="${OG_HEIGHT}" fill="${ACCENT}" />
    <rect x="${panelX - 4}" y="0" width="4" height="${OG_HEIGHT}" fill="${LINE}" />
    ${eyebrow(textX, 196, LOCATION)}
    ${textLines([NAME], { x: textX, y: 300, size: 70, lineHeight: 78, weight: 800, fill: INK_STRONG })}
    ${textLines(wrap(TAGLINE[locale], 26, 2), { x: textX, y: 372, size: 36, lineHeight: 48, weight: 500, fill: MUTED })}
    ${textLines([SITE_HOST], { x: textX, y: 556, size: 24, lineHeight: 30, weight: 600, fill: ACCENT_INK })}
  </svg>`;

  return sharp(Buffer.from(svg))
    .composite([{ input: portrait, left: panelX, top: 0 }])
    .png()
    .toBuffer();
}

/**
 * Compose a per-project card: the project screenshot letterboxed on a rounded
 * surface panel (works for both tall phone shots and wide web shots), project
 * name + case-study eyebrow on the left. Returns a 1200×630 PNG buffer.
 */
export async function composeProjectCard(
  screenshotPath: string,
  name: string,
  locale: Locale,
): Promise<Buffer> {
  const sharp = await getSharp();

  // Right-hand surface panel that frames the screenshot.
  const panel = { x: 600, y: 96, w: 520, h: 438, pad: 26, radius: 24 };
  const innerW = panel.w - panel.pad * 2;
  const innerH = panel.h - panel.pad * 2;

  const fitted = await sharp(screenshotPath)
    .resize(innerW, innerH, { fit: "inside", withoutEnlargement: false })
    .png()
    .toBuffer();
  const rounded = await roundCorners(fitted, 12);
  const fittedMeta = await sharp(rounded).metadata();
  const fw = fittedMeta.width ?? innerW;
  const fh = fittedMeta.height ?? innerH;
  const shotLeft = Math.round(panel.x + panel.pad + (innerW - fw) / 2);
  const shotTop = Math.round(panel.y + panel.pad + (innerH - fh) / 2);

  const textX = 80;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_WIDTH}" height="${OG_HEIGHT}" viewBox="0 0 ${OG_WIDTH} ${OG_HEIGHT}">
    <rect width="${OG_WIDTH}" height="${OG_HEIGHT}" fill="${PAPER}" />
    <rect x="0" y="0" width="12" height="${OG_HEIGHT}" fill="${ACCENT}" />
    <rect x="${panel.x}" y="${panel.y}" width="${panel.w}" height="${panel.h}" rx="${panel.radius}" ry="${panel.radius}" fill="${SURFACE}" stroke="${LINE}" stroke-width="2" />
    ${eyebrow(textX, 190, PROJECT_EYEBROW[locale])}
    ${textLines(wrap(name, 15, 2), { x: textX, y: 300, size: 58, lineHeight: 66, weight: 800, fill: INK_STRONG })}
    ${textLines([`${NAME} · Lyon`], { x: textX, y: 452, size: 28, lineHeight: 36, weight: 500, fill: MUTED })}
    ${textLines([SITE_HOST], { x: textX, y: 512, size: 24, lineHeight: 30, weight: 600, fill: ACCENT_INK })}
  </svg>`;

  return sharp(Buffer.from(svg))
    .composite([{ input: rounded, left: shotLeft, top: shotTop }])
    .png()
    .toBuffer();
}

// ---------------------------------------------------------------------------
// Generation (astro:build:done)
// ---------------------------------------------------------------------------

/**
 * Generate every OG card (per-locale default + per-project) and write them to
 * `<outDir>/og/*.png`. Idempotent: re-run overwrites the same files. Called from
 * the Astro integration's `astro:build:done` hook with the build output `dir`.
 */
export async function generateOgImages(outDir: URL): Promise<string[]> {
  const ogDir = new URL("./og/", outDir);
  await mkdir(fileURLToPath(ogDir), { recursive: true });

  const written: string[] = [];
  const write = async (name: string, buf: Buffer) => {
    const target = fileURLToPath(new URL(name, ogDir));
    await writeFile(target, buf);
    written.push(name);
  };

  for (const locale of LOCALES) {
    const card = await composeDefaultCard(locale);
    await write(`default-${locale}.png`, card);
  }

  for (const card of PROJECT_CARDS) {
    for (const locale of LOCALES) {
      const shotPath = assetUrl(`projects/${card.screenshot[locale]}`);
      // Guard: skip (don't fail the build) if a mapped screenshot is missing.
      try {
        await readFile(shotPath);
      } catch {
        console.warn(
          `[og] screenshot not found for "${card.slug}" (${locale}): ${shotPath} — skipping its card.`,
        );
        continue;
      }
      const buf = await composeProjectCard(shotPath, card.name[locale], locale);
      await write(`project-${card.slug}-${locale}.png`, buf);
    }
  }

  return written;
}
