import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// Audit U2: text tokens must pass WCAG AA (4.5:1) and field borders the 3:1
// non-text minimum on every surface they sit on, in both themes.
const css = readFileSync("src/styles/global.css", "utf8");

const tokens = (selector: string): Record<string, string> => {
  const block = css.match(new RegExp(`${selector} \\{([^}]*)\\}`))?.[1] ?? "";
  return Object.fromEntries(
    [...block.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [
      m[1],
      m[2],
    ]),
  );
};

const luminance = (hex: string): number => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a: string, b: string): number => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

for (const [theme, selector] of [
  ["light", ":root"],
  ["dark", "\\.dark"],
] as const) {
  const t = tokens(selector);
  const surfaces = ["paper", "surface", "surface-sunken"];

  describe(`${theme} theme contrast`, () => {
    for (const fg of ["ink", "muted", "accent-ink"]) {
      for (const bg of surfaces) {
        it(`${fg} on ${bg} ≥ 4.5:1`, () => {
          expect(contrast(t[fg], t[bg])).toBeGreaterThanOrEqual(4.5);
        });
      }
    }
    it("field-line on paper ≥ 3:1", () => {
      expect(contrast(t["field-line"], t.paper)).toBeGreaterThanOrEqual(3);
    });
  });
}
