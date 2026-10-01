const root = document.documentElement;
const els = [...document.querySelectorAll<HTMLElement>(".reveal")];

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  for (const el of els) el.classList.add("is-visible");
} else {
  armSnap();
  revealOnScroll();
}

/**
 * Arm root scroll-snapping on the first scroll intent. Enabling it on load
 * would make the browser re-snap during layout, scrolling the page while it
 * paints and wiping the Largest Contentful Paint candidate (Lighthouse's trace
 * engine then throws NO_LCP). Automated audits never interact, so snap stays
 * off through measurement; real users get it from their first gesture. See
 * the `.snap-armed` note in global.css.
 */
function armSnap(): void {
  const types = ["wheel", "touchstart", "pointerdown", "keydown"] as const;
  const arm = () => {
    root.classList.add("snap-armed");
    for (const type of types) window.removeEventListener(type, arm);
  };
  for (const type of types) {
    window.addEventListener(type, arm, { passive: true });
  }
}

/**
 * Full-height sections slide ~100vh at once. Reveal each element the moment it
 * scrolls into view (leading-edge, rAF-throttled) so content is already fading
 * in as the section arrives instead of popping in only after the snap settles.
 * `scrollend` is a safety net for anything still hidden once motion stops.
 */
function revealOnScroll(): void {
  const inView = (el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    return (
      r.top < window.innerHeight * 0.95 && r.bottom > window.innerHeight * 0.05
    );
  };
  let ticking = false;
  const onScroll = () => {
    // Fire on the leading edge (via rAF) so reveals start mid-slide rather
    // than 50ms after the snap has come to rest.
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      reveal();
    });
  };
  const reveal = () => {
    // Read every candidate before writing so no measurement flushes a pending
    // style change; stagger through the shared --reveal-delay.
    const pending = els.filter(
      (el) => !el.classList.contains("is-visible") && inView(el),
    );
    pending.forEach((el, i) => {
      // Small lead-in delay, then a capped stagger so a section full of
      // reveals doesn't leave the last few elements hidden long after the
      // snap has settled.
      el.style.setProperty("--reveal-delay", `${120 + Math.min(i, 6) * 55}ms`);
      el.classList.add("is-visible");
    });
    // Nothing left to animate — stop listening so the closures release.
    if (els.every((el) => el.classList.contains("is-visible"))) {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", reveal);
    }
  };
  reveal();
  window.addEventListener("scroll", onScroll, { passive: true });
  if ("onscrollend" in window) window.addEventListener("scrollend", reveal);
}

// A module (own scope), bundled by Astro.
export {};
