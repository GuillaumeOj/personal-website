import path from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { type Locale, SITE } from "../../src/config";
import {
  composeDefaultCard,
  composeProjectCard,
  defaultSocialImage,
  OG_HEIGHT,
  OG_WIDTH,
  PROJECT_CARDS,
  projectSocialImage,
} from "../../src/lib/og";
import { localizedName, type Project, projects } from "../../src/lib/projects";

const screenshot = (name: string) =>
  path.join(process.cwd(), "src", "assets", "projects", name);

describe("composeDefaultCard", () => {
  it("produces a 1200x630 JPEG under 300 KB for each locale", async () => {
    for (const locale of ["fr", "en"] as const) {
      const buf = await composeDefaultCard(locale);
      const meta = await sharp(buf).metadata();
      expect(meta.width).toBe(1200);
      expect(meta.height).toBe(630);
      expect(meta.format).toBe("jpeg");
      // Some scrapers (WhatsApp) skip images much above 300 KB.
      expect(buf.length).toBeLessThan(300_000);
    }
  });
});

describe("composeProjectCard", () => {
  it("insets a wide screenshot into a 1200x630 PNG", async () => {
    const buf = await composeProjectCard(
      screenshot("dotcraft-fr.png"),
      "dotcraft",
      "fr",
    );
    const meta = await sharp(buf).metadata();
    expect(meta.width).toBe(1200);
    expect(meta.height).toBe(630);
    expect(meta.format).toBe("png");
  });

  it("insets a tall phone screenshot into a 1200x630 PNG", async () => {
    const buf = await composeProjectCard(
      screenshot("fusily-fr-light.webp"),
      "Fusily",
      "fr",
    );
    const meta = await sharp(buf).metadata();
    expect(meta.width).toBe(1200);
    expect(meta.height).toBe(630);
    expect(meta.format).toBe("png");
  });
});

describe("defaultSocialImage", () => {
  it("returns the locale card URL at 1200x630", () => {
    expect(defaultSocialImage("fr")).toEqual({
      url: "/og/default-fr.jpg",
      width: OG_WIDTH,
      height: OG_HEIGHT,
    });
    expect(defaultSocialImage("en")).toEqual({
      url: "/og/default-en.jpg",
      width: 1200,
      height: 630,
    });
  });
});

describe("projectSocialImage", () => {
  it("returns the per-project card URL at 1200x630", () => {
    expect(projectSocialImage("fusily", "fr")).toEqual({
      url: "/og/project-fusily-fr.png",
      width: 1200,
      height: 630,
    });
    expect(projectSocialImage("fusily", "en")).toEqual({
      url: "/og/project-fusily-en.png",
      width: 1200,
      height: 630,
    });
  });
});

// `PROJECT_CARDS` is a hand-kept mirror of `projects.ts` (the build hook can't
// resolve its image imports). A project missing here gets no card, and its
// `og:image` silently points at a 404 — so guard the mirror.
describe("PROJECT_CARDS stays in sync with projects.ts", () => {
  // Under vitest, image imports resolve to their `/src/assets/...` path string
  // rather than `ImageMetadata` (so `resolveImage` can't be used): pick the
  // locale's variant, then its light side, and keep the filename.
  const lightCoverFile = (project: Project, locale: Locale): string => {
    // biome-ignore lint/suspicious/noExplicitAny: path strings, see above
    const cover = project.cover as any;
    const image = cover[locale] ?? cover;
    return path.basename(String(image.light ?? image));
  };
  const perLocale = (fn: (locale: Locale) => string) =>
    Object.fromEntries(SITE.locales.map((l) => [l, fn(l)]));
  const bySlug = (a: { slug: string }, b: { slug: string }) =>
    a.slug.localeCompare(b.slug);

  // A missing screenshot can't slip through: each expected filename comes from
  // a cover import, which fails to resolve if the file is gone.
  it("has one card per project, with its name and own light cover", () => {
    const expected = projects.map((p) => ({
      slug: p.slug,
      name: perLocale((l) => localizedName(p, l)),
      screenshot: perLocale((l) => lightCoverFile(p, l)),
    }));
    expect([...PROJECT_CARDS].sort(bySlug)).toEqual(expected.sort(bySlug));
  });
});
