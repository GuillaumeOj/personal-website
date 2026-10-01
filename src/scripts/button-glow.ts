import { prefersReducedMotion } from "./motion";

// Point a button's amber glow at the cursor (CSS handles the rest). Skipped
// without a real hover pointer or under reduced motion.
if (window.matchMedia("(hover: hover)").matches && !prefersReducedMotion()) {
  document.addEventListener(
    "pointermove",
    (event) => {
      const target = event.target;
      const btn = target instanceof Element ? target.closest(".btn") : null;
      if (!(btn instanceof HTMLElement)) return;
      const rect = btn.getBoundingClientRect();
      btn.style.setProperty("--glow-x", `${event.clientX - rect.left}px`);
      btn.style.setProperty("--glow-y", `${event.clientY - rect.top}px`);
    },
    { passive: true },
  );
}
