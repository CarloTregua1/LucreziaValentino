"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animated stat that counts up from zero when it scrolls into view. Non-numeric
 * values (e.g. "Italia") render as-is. Respects `prefers-reduced-motion`.
 */
export function StatCounter({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : null;
  const suffix = match ? match[2] : "";
  const [display, setDisplay] = useState(
    target === null ? value : `0${suffix}`
  );

  useEffect(() => {
    if (target === null) return;
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(`${target}${suffix}`);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.disconnect();
          const duration = 1300;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplay(`${Math.round(eased * target)}${suffix}`);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [target, suffix]);

  return (
    <div
      ref={ref}
      className="flex flex-col items-start px-4 py-10 sm:items-center sm:py-12 sm:text-center"
    >
      <p className="font-serif text-5xl leading-none text-[var(--color-foreground)] sm:text-6xl tabular-nums">
        {display}
      </p>
      <p className="mt-3 text-xs uppercase tracking-widest text-[var(--color-muted)]">
        {label}
      </p>
    </div>
  );
}
