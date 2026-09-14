"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  COOKIE_PREFERENCES_EVENT,
  readConsent,
  writeConsent,
  type ConsentChoice,
} from "@/lib/cookie-consent";

export function CookieConsent() {
  // Starts hidden and is only ever raised from an effect: the answer lives in
  // localStorage, so rendering the banner on the server pass would make it
  // flash for everyone who has already chosen.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!readConsent()) setVisible(true);

    const reopen = () => setVisible(true);
    window.addEventListener(COOKIE_PREFERENCES_EVENT, reopen);
    return () => window.removeEventListener(COOKIE_PREFERENCES_EVENT, reopen);
  }, []);

  if (!visible) return null;

  const choose = (choice: ConsentChoice) => {
    writeConsent(choice);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[var(--color-foreground)] text-[var(--color-background)] shadow-[0_-8px_40px_rgba(10,36,99,0.25)]"
    >
      <div className="container-xl flex flex-col gap-6 py-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div className="max-w-2xl">
          <p
            id="cookie-consent-title"
            className="eyebrow"
            style={{ color: "var(--color-accent-light)" }}
          >
            Cookie
          </p>
          {/* Kept short on purpose: on a phone the banner covers the page
              until it's answered. The full detail lives in the policy. */}
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted-light)]">
            Questo sito usa solo{" "}
            <strong className="font-normal text-[var(--color-background)]">
              cookie tecnici
            </strong>
            , necessari a mantenere l’accesso all’area riservata e a gestire i
            pagamenti: non richiedono consenso. Nessuna profilazione, nessun
            tracciamento di terze parti.{" "}
            <Link
              href="/cookie-policy"
              className="text-[var(--color-accent-light)] underline underline-offset-[3px] hover:text-white"
            >
              Leggi la cookie policy
            </Link>
            .
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => choose("necessary")}
            className="border border-[var(--color-background)]/50 px-6 py-3 text-sm tracking-widest uppercase text-[var(--color-background)] transition-colors hover:border-[var(--color-background)] hover:bg-[var(--color-background)]/10"
          >
            Solo necessari
          </button>
          <button
            type="button"
            onClick={() => choose("all")}
            className="bg-[var(--color-accent)] px-6 py-3 text-sm tracking-widest uppercase text-white transition-colors hover:bg-[var(--color-accent-hover)]"
          >
            Accetta tutti
          </button>
        </div>
      </div>
    </div>
  );
}
