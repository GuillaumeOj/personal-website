// Fade `.reveal` elements in as they enter the viewport. The snap landing
// renders snap-landing.ts instead (BaseLayout picks one): its sections slide a
// full screen at a time, which an IntersectionObserver threshold handles poorly.
const els = document.querySelectorAll<HTMLElement>(".reveal");

if (
  !("IntersectionObserver" in window) ||
  window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
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

// A module (own scope), bundled by Astro.
export {};
