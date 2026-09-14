"use client";

import { openCookiePreferences } from "@/lib/cookie-consent";

interface Props {
  /** "dark" for the navy footer, "light" for the cookie policy page body. */
  tone?: "light" | "dark";
}

const TONES = {
  light:
    "text-[var(--color-accent)] underline underline-offset-[3px] hover:text-[var(--color-accent-hover)]",
  dark: "link-underline text-[var(--color-background)]/90 hover:text-[var(--color-background)]",
} as const;

/**
 * Brings the consent banner back, so a choice made once is never final.
 * Rendered both in the footer and inside the cookie policy, which sit on
 * opposite backgrounds — hence the tone.
 */
export function CookiePreferencesButton({ tone = "light" }: Props) {
  return (
    <button
      type="button"
      onClick={openCookiePreferences}
      className={`text-left text-sm ${TONES[tone]}`}
    >
      Preferenze cookie
    </button>
  );
}
