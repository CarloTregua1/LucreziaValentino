"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Inertia-based smooth scrolling for a premium, cohesive feel. Mounted once in
 * the shop layout so it covers client navigation too.
 *
 * Disabled when the user prefers reduced motion, and on touch devices: Lenis
 * fights the native momentum scrolling and dynamic URL-bar resizing on phones,
 * which feels janky. There, native scrolling is the better experience.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
