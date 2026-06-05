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
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
