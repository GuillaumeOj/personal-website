import path from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import {
  defaultSocialImage,
  OG_HEIGHT,
  OG_WIDTH,
  projectSocialImage,
} from "../../src/lib/og";
import {
  composeDefaultCard,
  composeProjectCard,
} from "../../src/lib/og-compose";

const asset = (name: string) => path.join(process.cwd(), "src", "assets", name);
const screenshot = (name: string) => asset(path.join("projects", name));

describe("composeDefaultCard", () => {
  it("produces a 1200x630 JPEG under 300 KB for each locale", async () => {
    for (const locale of ["fr", "en"] as const) {
      const buf = await composeDefaultCard(asset("portrait.jpg"), locale);
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
