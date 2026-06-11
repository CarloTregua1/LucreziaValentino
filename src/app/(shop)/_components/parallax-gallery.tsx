"use client";

import { useEffect, useRef } from "react";

const IMAGES: Array<{ src: string; alt: string }> = [
  { src: "/images/gallery/gallery-01.png", alt: "Atmosfere dello studio di Lucrezia Valentino" },
  { src: "/images/gallery/gallery-02.png", alt: "Atmosfere dello studio di Lucrezia Valentino" },
  { src: "/images/gallery/gallery-03.png", alt: "Atmosfere dello studio di Lucrezia Valentino" },
  { src: "/images/gallery/gallery-04.png", alt: "Atmosfere dello studio di Lucrezia Valentino" },
  { src: "/images/gallery/gallery-05.png", alt: "Atmosfere dello studio di Lucrezia Valentino" },
  { src: "/images/gallery/gallery-06.png", alt: "Atmosfere dello studio di Lucrezia Valentino" },
  { src: "/images/gallery/gallery-07.png", alt: "Atmosfere dello studio di Lucrezia Valentino" },
  { src: "/images/gallery/gallery-08.png", alt: "Atmosfere dello studio di Lucrezia Valentino" },
  { src: "/images/gallery/gallery-09.png", alt: "Atmosfere dello studio di Lucrezia Valentino" },
  { src: "/images/gallery/gallery-10.png", alt: "Atmosfere dello studio di Lucrezia Valentino" },
];

export function ParallaxGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // The horizontal sweep is desktop-only (the track is `display:none` under
    // md). On touch devices the strip uses native scroll-snap instead, so bail
    // out here — otherwise we'd run getBoundingClientRect() on every scroll
    // event for an invisible element, thrashing layout and making phones choppy.
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
      className="relative overflow-hidden bg-[var(--color-foreground)] py-16 text-[var(--color-background)] md:h-screen md:min-h-[600px] md:py-0"
      style={{
        paddingLeft: "var(--container-x)",
        paddingRight: "var(--container-x)",
      }}
    >
      {/* Soft accent glow on the right edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-1/3 hidden h-[60vh] w-[60vh] rounded-full bg-[var(--color-accent)]/20 blur-3xl md:block"
      />

      {/* ── Mobile: heading in normal flow + a native, swipeable scroll-snap
          strip. No scroll-jacking — that feels buggy on touch. ── */}
      <div className="relative z-10 md:hidden">
        <p className="eyebrow" style={{ color: "var(--color-accent-light)" }}>
          Sguardo
        </p>
        <h2 className="mt-3 max-w-2xl font-serif text-[var(--text-h2)] leading-[1.05] text-[var(--color-background)]">
          Atmosfere{" "}
          <span className="serif-italic text-[var(--color-accent-light)]">
            di studio.
          </span>
        </h2>
      </div>
      <div
        className="relative z-10 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          // Bleed the strip to the screen edges so images can scroll fully
          // off-screen, while keeping the first one aligned to the text.
          marginLeft: "calc(-1 * var(--container-x))",
          marginRight: "calc(-1 * var(--container-x))",
          paddingLeft: "var(--container-x)",
          paddingRight: "var(--container-x)",
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
            className="h-[62vw] w-[76vw] max-w-[340px] flex-shrink-0 snap-start object-cover"
            style={{ objectPosition: "center" }}
          />
        ))}
      </div>

      {/* ── Desktop: heading anchored top-left ── */}
      <div className="pointer-events-none absolute left-0 right-0 top-10 z-10 hidden sm:top-14 md:block" style={{ paddingLeft: "var(--container-x)", paddingRight: "var(--container-x)" }}>
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

      {/* Scroll hint anchored bottom-left (desktop) */}
      <div className="pointer-events-none absolute bottom-8 left-0 right-0 z-10 hidden items-center gap-3 text-xs uppercase tracking-widest text-[var(--color-muted-light)] md:flex" style={{ paddingLeft: "var(--container-x)", paddingRight: "var(--container-x)" }}>
        <span className="inline-block h-px w-10 bg-[var(--color-accent-light)]/60" />
        <span>Atmosfere in scorrimento</span>
      </div>

      {/* Horizontal track (desktop) — translated based on the section's
          vertical position in the viewport. */}
      <div
        ref={trackRef}
        className="absolute top-1/2 hidden gap-[4vmin] md:flex"
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
