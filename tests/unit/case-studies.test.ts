import { describe, expect, it } from "vitest";
import { caseStudyFor } from "../../src/lib/case-studies";
import { getProjects } from "../../src/lib/projects";

// Audit E5: every project page is a real case study (400–700 words) with a
// search-length meta description.
const words = (text: string): number =>
  text.split(/\s+/).filter(Boolean).length;

for (const project of getProjects()) {
  describe(`${project.slug} case study`, () => {
    for (const locale of ["fr", "en"] as const) {
      it(`${locale}: exists with a 130–155-character meta description`, () => {
        const { metaDescription } = caseStudyFor(project.slug, locale);
        expect(metaDescription.length).toBeGreaterThanOrEqual(130);
        expect(metaDescription.length).toBeLessThanOrEqual(155);
      });

      it(`${locale}: page copy totals 400–700 words`, () => {
        const { description, aim, longDescription } = project.content[locale];
        const body = caseStudyFor(project.slug, locale)
          .sections.flatMap((s) => [s.heading, ...s.paragraphs])
          .join(" ");
        const total = words(`${description} ${aim} ${longDescription} ${body}`);
        expect(total).toBeGreaterThanOrEqual(400);
        expect(total).toBeLessThanOrEqual(700);
      });
    }
  });
}
