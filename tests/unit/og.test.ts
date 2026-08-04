import path from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import {
  articleSocialImage,
  composeDefaultCard,
  composeProjectCard,
  defaultSocialImage,
  OG_HEIGHT,
  OG_WIDTH,
  projectSocialImage,
} from "../../src/lib/og";

const screenshot = (name: string) =>
  path.join(process.cwd(), "src", "assets", "projects", name);

describe("composeDefaultCard", () => {
  it("produces a 1200x630 PNG for each locale", async () => {
    for (const locale of ["fr", "en"] as const) {
      const buf = await composeDefaultCard(locale);
      const meta = await sharp(buf).metadata();
      expect(meta.width).toBe(1200);
      expect(meta.height).toBe(630);
      expect(meta.format).toBe("png");
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
      url: "/og/default-fr.png",
      width: OG_WIDTH,
      height: OG_HEIGHT,
    });
    expect(defaultSocialImage("en")).toEqual({
      url: "/og/default-en.png",
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

describe("articleSocialImage", () => {
  it("falls back to the landscape default when there is no cover", () => {
    expect(articleSocialImage({ locale: "fr" })).toEqual({
      url: "/og/default-fr.png",
      width: 1200,
      height: 630,
    });
  });

  it("passes through the card the layout resolved", () => {
    // Covers are local assets cropped to 1200×630 by `getImage()` in
    // BlogPostLayout, so dimensions are always known. The previous resolver took
    // a remote URL and guessed them from `?w=&h=` — which real Unsplash covers
    // never carried, so articles shipped without og:image:width/height.
    const cover = {
      url: "/_astro/cover.abc123_xyz.jpeg",
      width: 1200,
      height: 630,
    };
    expect(articleSocialImage({ cover, locale: "en" })).toEqual(cover);
  });
});
