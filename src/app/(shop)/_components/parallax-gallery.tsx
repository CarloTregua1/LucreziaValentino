"use client";

import { useEffect, useRef } from "react";

const IMAGES: Array<{ src: string; alt: string }> = [
  {
    src: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1600&q=85",
    alt: "Calcolatrice e ricevute sulla scrivania",
  },
  {
    src: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&q=85",
    alt: "Macchina da scrivere d'epoca",
  },
  {
    src: "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=1600&q=85",
    alt: "Architettura italiana in luce calda",
  },
  {
    src: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1600&q=85",
    alt: "Documenti di studio",
  },
  {
    src: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1600&q=85",
    alt: "Carte e penna sul tavolo",
  },
  {
    src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=85",
    alt: "Tetti italiani all'alba",
  },
  {
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=85",
    alt: "Studio minimale",
  },
];

export function ParallaxGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // Tunables:
    // ACTIVE_RANGE — fraction of the section's transit through the viewport
    // during which the horizontal sweep happens. 1.0 = entering→leaving;
    // 0.55 = only the middle 55% animates (sweep finishes in less scroll
    // distance, so it feels faster).
    // SMOOTHING — how aggressively the displayed offset eases toward the
    // scroll target each frame. Higher = snappier, lower = silkier.
    const ACTIVE_RANGE = 0.55;
    const SMOOTHING = 0.16;

    let maxTranslate = 0;
    let target = 0;
    let current = 0;
    let rafId = 0;

    const recompute = () => {
      const cs = getComputedStyle(section);
      const leftPad = parseFloat(cs.paddingLeft) || 0;
      const rightPad = parseFloat(cs.paddingRight) || 0;
      const usable = section.clientWidth - leftPad - rightPad;
      maxTranslate = Math.max(0, track.scrollWidth - usable);
      computeTarget();
      // Snap on resize so we don't ease across the size change.
      current = target;
      apply();
    };

    // Map the section's transit through the viewport to a 0→1 progress,
    // then tighten that to ACTIVE_RANGE around the midpoint so the sweep
    // happens over less scroll distance.
    const computeTarget = () => {
      const rect = section.getBoundingClientRect();
      const denom = window.innerHeight + section.offsetHeight;
      const raw = (window.innerHeight - rect.top) / denom;
      const margin = (1 - ACTIVE_RANGE) / 2;
      const stretched = (raw - margin) / ACTIVE_RANGE;
      target = Math.max(0, Math.min(1, stretched));
    };

    const apply = () => {
      track.style.transform = `translate3d(${-current * maxTranslate}px, -50%, 0)`;
    };

    const tick = () => {
      const diff = target - current;
      if (Math.abs(diff) < 0.0005) {
        current = target;
        apply();
        rafId = 0;
        return;
      }
      current += diff * SMOOTHING;
      apply();
      rafId = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      computeTarget();
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    recompute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", recompute);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", recompute);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Galleria atmosferica dello studio"
      className="relative h-screen min-h-[600px] overflow-hidden bg-[var(--color-foreground)] text-[var(--color-background)]"
      style={{
        paddingLeft: "var(--container-x)",
        paddingRight: "var(--container-x)",
      }}
    >
      {/* Soft accent glow on the right edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-1/3 h-[60vh] w-[60vh] rounded-full bg-[var(--color-accent)]/20 blur-3xl"
      />

      {/* Heading anchored top-left */}
      <div className="pointer-events-none absolute left-0 right-0 top-10 z-10 sm:top-14" style={{ paddingLeft: "var(--container-x)", paddingRight: "var(--container-x)" }}>
        <p
          className="eyebrow"
          style={{ color: "var(--color-accent-light)" }}
        >
          Sguardo
        </p>
        <h2 className="mt-3 max-w-2xl font-serif text-[var(--text-h2)] leading-[1.05] text-[var(--color-background)]">
          Atmosfere{" "}
          <span className="serif-italic text-[var(--color-accent-light)]">
            di studio.
          </span>
        </h2>
      </div>

      {/* Scroll hint anchored bottom-left */}
      <div className="pointer-events-none absolute bottom-8 left-0 right-0 z-10 flex items-center gap-3 text-xs uppercase tracking-widest text-[var(--color-muted-light)]" style={{ paddingLeft: "var(--container-x)", paddingRight: "var(--container-x)" }}>
        <span className="inline-block h-px w-10 bg-[var(--color-accent-light)]/60" />
        <span>Atmosfere in scorrimento</span>
      </div>

      {/* Horizontal track — translated based on the section's vertical
          position in the viewport. */}
      <div
        ref={trackRef}
        className="absolute top-1/2 flex gap-[4vmin]"
        style={{
          left: "var(--container-x)",
          transform: "translate3d(0, -50%, 0)",
          willChange: "transform",
        }}
      >
        {IMAGES.map((img, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={img.src}
            alt={img.alt}
            draggable={false}
            loading={i < 2 ? "eager" : "lazy"}
            className="h-[56vmin] w-[40vmin] flex-shrink-0 object-cover"
            style={{ objectPosition: "center" }}
          />
        ))}
      </div>
    </section>
  );
}
