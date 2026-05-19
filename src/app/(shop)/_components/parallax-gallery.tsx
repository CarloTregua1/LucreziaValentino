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
    src: "https://images.unsplash.com/photo-1524781289445-ddf8f5695861?w=1600&q=85",
    alt: "Dettaglio editoriale 1",
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
    src: "https://images.unsplash.com/photo-1610194352361-4c81a6a8967e?w=1600&q=85",
    alt: "Dettaglio editoriale 2",
  },
  {
    src: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1600&q=85",
    alt: "Carte e penna sul tavolo",
  },
  {
    src: "https://images.unsplash.com/photo-1618202133208-2907bebba9e1?w=1600&q=85",
    alt: "Dettaglio editoriale 3",
  },
  {
    src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=85",
    alt: "Tetti italiani all'alba",
  },
  {
    src: "https://images.unsplash.com/photo-1495805442109-bf1cf975750b?w=1600&q=85",
    alt: "Dettaglio editoriale 4",
  },
  {
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=85",
    alt: "Studio minimale",
  },
  {
    src: "https://images.unsplash.com/photo-1548021682-1720ed403a5b?w=1600&q=85",
    alt: "Dettaglio editoriale 5",
  },
];

export function ParallaxGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  // Drag state lives in a ref so we don't trigger React re-renders on each
  // mouse move — matches the imperative animate() pattern from the original.
  const stateRef = useRef({
    mouseDownAt: 0,
    prevPercentage: 0,
    percentage: 0,
    maxPercentage: 0,
  });

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // Dynamic clamp: max negative translate is the point at which the
    // track's right edge meets the section's right padding boundary.
    // Recomputed on mount and on every resize.
    const recomputeMax = () => {
      const trackWidth = track.scrollWidth;
      const cs = getComputedStyle(section);
      const leftPad = parseFloat(cs.paddingLeft) || 0;
      const rightPad = parseFloat(cs.paddingRight) || 0;
      const usable = section.clientWidth - leftPad - rightPad;
      stateRef.current.maxPercentage =
        trackWidth <= usable
          ? 0
          : -((trackWidth - usable) / trackWidth) * 100;
    };

    recomputeMax();

    const handleDown = (clientX: number) => {
      stateRef.current.mouseDownAt = clientX;
    };

    const handleUp = () => {
      if (stateRef.current.mouseDownAt === 0) return;
      stateRef.current.mouseDownAt = 0;
      stateRef.current.prevPercentage = stateRef.current.percentage;
    };

    const handleMove = (clientX: number) => {
      if (stateRef.current.mouseDownAt === 0) return;

      const mouseDelta = stateRef.current.mouseDownAt - clientX;
      const maxDelta = window.innerWidth / 2;
      const delta = (mouseDelta / maxDelta) * -100;
      const nextUnconstrained =
        stateRef.current.prevPercentage + delta;
      const nextPercentage = Math.max(
        Math.min(nextUnconstrained, 0),
        stateRef.current.maxPercentage,
      );
      stateRef.current.percentage = nextPercentage;

      track.animate(
        { transform: `translate(${nextPercentage}%, -50%)` },
        { duration: 1200, fill: "forwards" },
      );

      // Remap nextPercentage from [0, maxPercentage] to [0, 100] so each
      // image still pans its full width regardless of how short the drag
      // range turned out to be after the dynamic clamp.
      const range = stateRef.current.maxPercentage;
      const normalized = range === 0 ? 0 : nextPercentage / range;
      const objPos = 100 * (1 - normalized);

      const images = track.querySelectorAll<HTMLImageElement>(
        ".parallax-gallery__image",
      );
      images.forEach((img) => {
        img.animate(
          { objectPosition: `${objPos}% center` },
          { duration: 1200, fill: "forwards" },
        );
      });
    };

    const onMouseDown = (e: MouseEvent) => handleDown(e.clientX);
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onMouseUp = () => handleUp();

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) handleDown(t.clientX);
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) handleMove(t.clientX);
    };
    const onTouchEnd = () => handleUp();

    // Drag only initiates from inside the gallery section, but move/up are
    // tracked on window so the user can continue dragging even if the
    // cursor leaves the gallery bounds.
    section.addEventListener("mousedown", onMouseDown);
    section.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("resize", recomputeMax);

    return () => {
      section.removeEventListener("mousedown", onMouseDown);
      section.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", recomputeMax);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Galleria atmosferica dello studio"
      className="relative h-[95vh] min-h-[600px] overflow-hidden bg-[var(--color-foreground)] text-[var(--color-background)] select-none"
      style={{
        touchAction: "pan-y",
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

      {/* Drag hint anchored bottom-left */}
      <div className="pointer-events-none absolute bottom-8 left-0 right-0 z-10 flex items-center gap-3 text-xs uppercase tracking-widest text-[var(--color-muted-light)]" style={{ paddingLeft: "var(--container-x)", paddingRight: "var(--container-x)" }}>
        <span className="inline-block h-px w-10 bg-[var(--color-accent-light)]/60" />
        <span>Trascina per esplorare</span>
      </div>

      {/* The parallax track itself — anchored to the section's left padding
          boundary instead of the viewport center, so the first image lands
          where text in the rest of the page begins. */}
      <div
        ref={trackRef}
        className="parallax-gallery__track absolute top-1/2 flex cursor-grab gap-[4vmin] active:cursor-grabbing"
        style={{
          left: "var(--container-x)",
          transform: "translate(0%, -50%)",
        }}
      >
        {IMAGES.map((img, i) => (
          // We need a raw <img> element because the parallax effect animates
          // object-position via the Web Animations API directly on the image
          // node, which next/image's wrapper makes awkward to target.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={img.src}
            alt={img.alt}
            draggable={false}
            loading="lazy"
            className="parallax-gallery__image h-[56vmin] w-[40vmin] flex-shrink-0 object-cover"
            style={{ objectPosition: "100% center" }}
          />
        ))}
      </div>
    </section>
  );
}
