"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Brochure } from "@/lib/content/blog";

interface Props {
  brochure: Brochure;
}

/**
 * Brochure plates rendered as clickable previews that open full screen in a
 * lightbox. The plates are A4 landscape, so they stay readable inline on
 * desktop; inside the modal the image is contained in the viewport and the
 * arrows (or ← →) move between pages.
 */
export function BrochureViewer({ brochure }: Props) {
  const { title, intro, pages, caption, disclaimer } = brochure;

  // Index of the plate shown in the lightbox, or null when closed.
  const [open, setOpen] = useState<number | null>(null);
  const isOpen = open !== null;
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const closeRef = useRef<HTMLButtonElement>(null);
  // Which trigger to focus on close — read in the cleanup, so it must not be
  // part of the effect's dependencies.
  const lastOpened = useRef(0);

  const go = useCallback(
    (step: number) =>
      setOpen((i) => (i === null ? i : (i + step + pages.length) % pages.length)),
    [pages.length],
  );

  // While open: lock body scroll, move focus into the dialog, restore it after.
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      triggerRefs.current[lastOpened.current]?.focus();
    };
  }, [isOpen]);

  // Escape closes, arrows page through the plates.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, go]);

  const openAt = (i: number) => {
    lastOpened.current = i;
    setOpen(i);
  };

  const current = open === null ? null : pages[open];

  return (
    <figure className="mx-auto mt-14 max-w-4xl">
      {title && <p className="section-index">{title}</p>}

      {intro && intro.length > 0 && (
        <div className="mt-4 space-y-6 text-lg leading-relaxed text-[var(--color-foreground-soft)]">
          {intro.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      )}

      <div className="mt-8 space-y-6">
        {pages.map((page, i) => (
          <button
            key={page.src}
            ref={(el) => {
              triggerRefs.current[i] = el;
            }}
            type="button"
            onClick={() => openAt(i)}
            aria-haspopup="dialog"
            className="group block w-full cursor-zoom-in border border-[var(--color-border)] bg-[var(--color-card-subtle)] p-3 transition-colors hover:border-[var(--color-accent)] sm:p-4"
          >
            <span className="relative block aspect-[1.414/1] w-full overflow-hidden">
              <Image
                src={page.src}
                alt={page.alt}
                fill
                quality={90}
                className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 56rem"
              />
            </span>
            <span className="mt-3 flex items-center justify-between gap-4 text-sm">
              <span className="text-left text-[var(--color-foreground-soft)]">
                {page.alt}
              </span>
              <span className="shrink-0 text-[var(--color-accent)] transition-transform duration-300 group-hover:translate-x-1">
                Ingrandisci →
              </span>
            </span>
          </button>
        ))}
      </div>

      {caption && (
        <figcaption className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
          {caption}
        </figcaption>
      )}

      {disclaimer && (
        <p className="mt-6 border-l-2 border-[var(--color-border-strong)] pl-4 text-sm leading-relaxed text-[var(--color-muted)]">
          {disclaimer}
        </p>
      )}

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          className="fixed inset-0 z-[100] flex flex-col bg-black/90 p-4 sm:p-8"
        >
          {/* Backdrop — click anywhere outside the artwork to close. */}
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => setOpen(null)}
            className="absolute inset-0 h-full w-full cursor-zoom-out"
          />

          <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col">
            <div className="flex items-center justify-between gap-4 pb-3">
              <p className="truncate text-sm text-white/80">
                {pages.length > 1 && (
                  <span className="mr-2 shrink-0 text-white/60">
                    Pagina {(open ?? 0) + 1} di {pages.length}
                  </span>
                )}
                {current.alt}
              </p>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(null)}
                aria-label="Chiudi"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M5 5l10 10" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M15 5L5 15" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
            </div>

            <div className="flex min-h-0 flex-1 items-center gap-2 sm:gap-4">
              {pages.length > 1 && (
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Pagina precedente"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M12.5 4L6.5 10l6 6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </button>
              )}

              <div className="relative min-h-0 flex-1 self-stretch">
                <Image
                  src={current.src}
                  alt={current.alt}
                  fill
                  quality={90}
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 72rem"
                />
              </div>

              {pages.length > 1 && (
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Pagina successiva"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M7.5 4l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </figure>
  );
}
