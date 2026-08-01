"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface Props {
  src: string;
  alt: string;
  /** Small label above the preview. */
  title?: string;
  /** Short copy under the preview. */
  caption?: string;
}

/**
 * Clickable brochure preview that opens the full artwork in a lightbox.
 * The preview keeps an A4 ratio; inside the modal the image is contained in
 * the viewport, so it stays readable on desktop and on phones alike.
 */
export function BrochureViewer({ src, alt, title, caption }: Props) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // While open: lock body scroll, move focus into the dialog and close on Escape.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      triggerRef.current?.focus();
    };
  }, [open]);

  return (
    <figure className="mx-auto mt-14 max-w-2xl">
      {title && <p className="section-index">{title}</p>}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="group mt-4 block w-full cursor-zoom-in border border-[var(--color-border)] bg-[var(--color-card-subtle)] p-3 transition-colors hover:border-[var(--color-accent)] sm:p-4"
      >
        <span className="relative block aspect-[1/1.414] w-full overflow-hidden">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 42rem"
          />
        </span>
        <span className="mt-3 flex items-center justify-between gap-4 text-sm">
          <span className="text-[var(--color-foreground-soft)]">{alt}</span>
          <span className="shrink-0 text-[var(--color-accent)] transition-transform duration-300 group-hover:translate-x-1">
            Ingrandisci →
          </span>
        </span>
      </button>

      {caption && (
        <figcaption className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
          {caption}
        </figcaption>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          className="fixed inset-0 z-[100] flex flex-col bg-black/90 p-4 sm:p-8"
        >
          {/* Backdrop — click anywhere outside the artwork to close. */}
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => setOpen(false)}
            className="absolute inset-0 h-full w-full cursor-zoom-out"
          />

          <div className="relative z-10 mx-auto flex h-full w-full max-w-4xl flex-col">
            <div className="flex items-center justify-between gap-4 pb-3">
              <p className="truncate text-sm text-white/80">{alt}</p>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
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

            <div className="relative min-h-0 flex-1">
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 56rem"
              />
            </div>
          </div>
        </div>
      )}
    </figure>
  );
}
