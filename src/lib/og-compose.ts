import sharp from "sharp";
import { type Locale, SITE } from "../config";
import { escapeHtml as esc } from "./html";
import { OG_HEIGHT, OG_WIDTH } from "./og";
import { jobTitle } from "./schema";

/** The endpoint response for a composed card. */
export const imageResponse = (
  card: Buffer,
  type: "image/jpeg" | "image/png",
): Response =>
  new Response(new Uint8Array(card), { headers: { "Content-Type": type } });

/**
 * The source file of an imported image. Astro sets `fsPath` on every local
 * image import at build time but leaves it out of the public `ImageMetadata`
 * type; `sharp` needs the original file, not the hashed `/_astro/` URL.
 */
export const sourcePath = (image: ImageMetadata): string =>
  (image as ImageMetadata & { fsPath: string }).fsPath;

/**
 * Build-time composition of the Open Graph cards with `sharp`: a warm branded
 * canvas matching the stone/amber palette, an inset visual (the portrait, or a
 * project screenshot) and legible text. Called by the prerendered endpoints in
 * `src/pages/og/`, which pass the source image paths.
 */

// Palette mirrors `src/styles/global.css` (light `:root`). A share card always
// renders on a light branded canvas — legibility beats theme-awareness here.
const PAPER = "#faf8f4";
const SURFACE = "#ffffff";
const INK_STRONG = "#1c1917";
const MUTED = "#57534e";
const ACCENT = "#ea7317";
const ACCENT_INK = "#9a4a0c";
const LINE = "#e7e2d9";

const FONT_STACK =
  "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

// ---------------------------------------------------------------------------
// Card copy
// ---------------------------------------------------------------------------

const LOCATION = "Lyon · France";
const SITE_HOST = new URL(SITE.url).host;
const NAME = SITE.name;

const PROJECT_EYEBROW: Record<Locale, string> = {
  fr: "Étude de cas",
  en: "Case study",
};

// ---------------------------------------------------------------------------
// SVG helpers
// ---------------------------------------------------------------------------

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
  },
): string {
  const { x, y, size, lineHeight, weight, fill } = opts;
  return lines
    .map(
      (line, i) =>
        `<text x="${x}" y="${y + i * lineHeight}" font-family="${FONT_STACK}" font-size="${size}" font-weight="${weight}" fill="${fill}">${esc(line)}</text>`,
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

/** Round the corners of an already-rasterised PNG buffer. */
async function roundCorners(buf: Buffer, radius: number): Promise<Buffer> {
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
 * Returns a 1200×630 JPEG buffer.
 */
export async function composeDefaultCard(
  portraitPath: string,
  locale: Locale,
): Promise<Buffer> {
  const panelW = 440;
  const panelX = OG_WIDTH - panelW;

  const portrait = await sharp(portraitPath)
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
    ${textLines(wrap(jobTitle[locale], 26, 2), { x: textX, y: 372, size: 36, lineHeight: 48, weight: 500, fill: MUTED })}
    ${textLines([SITE_HOST], { x: textX, y: 556, size: 24, lineHeight: 30, weight: 600, fill: ACCENT_INK })}
  </svg>`;

  return sharp(Buffer.from(svg))
    .composite([{ input: portrait, left: panelX, top: 0 }])
    .jpeg({ quality: 82, mozjpeg: true })
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
