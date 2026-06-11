"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Reveals any element marked with `data-reveal` as it scrolls into view by
 * toggling an `.is-visible` class (the actual transition lives in globals.css,
 * gated behind `.js-reveal` so content stays visible without JS).
 *
 * Mount once per page. Re-scans on route change so it also works after client
 * navigation. Respects `prefers-reduced-motion`.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    // Mobile: the reveal effect is disabled entirely (felt choppy), so the
    // `.js-reveal` gate is never set there and content is already visible —
    // nothing to observe. Keep this in sync with the gate in the root layout.
    if (!window.matchMedia("(min-width: 768px)").matches) return;

    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );
    if (els.length === 0) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          io.unobserve(el);

          // Promote to its own layer only for the duration of the animation,
          // then release it so we never hold more than a few composited layers
          // at once (persistent `will-change` is what makes mobile choppy).
          el.style.willChange = "opacity, transform";
          const release = () => {
            el.style.willChange = "";
          };
          el.addEventListener("transitionend", release, { once: true });
          // Fallback in case the transition is interrupted and never fires.
          window.setTimeout(release, 1100);

          el.classList.add("is-visible");
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
