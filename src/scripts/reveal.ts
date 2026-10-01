import { prefersReducedMotion } from "./motion";

// Fade `.reveal` elements in as they enter the viewport. The snap landing
// reveals its own (see `snap-landing.ts`): sections slide a full screen at a
// time there, which an IntersectionObserver threshold handles poorly.
const els = [...document.querySelectorAll<HTMLElement>(".reveal")];

if (!document.documentElement.classList.contains("snap-home")) {
  if (!("IntersectionObserver" in window) || prefersReducedMotion()) {
    for (const el of els) el.classList.add("is-visible");
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    for (const el of els) io.observe(el);
  }
}
