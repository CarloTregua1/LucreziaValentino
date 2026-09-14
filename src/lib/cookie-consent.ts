/**
 * Cookie consent, kept deliberately small.
 *
 * The site sets no profiling or third-party analytics cookies today — only the
 * httpOnly `session` cookie Firebase needs to keep you logged in, and whatever
 * Stripe sets on its own hosted Checkout page. So the choice we record is
 * really "did the visitor acknowledge, and would they accept non-essential
 * cookies if we ever added any". Storing it in localStorage rather than a
 * cookie keeps the banner from being the thing that creates a cookie.
 */

export const COOKIE_CONSENT_KEY = "lv-cookie-consent";

/** Bump to re-ask everyone (e.g. when a new cookie category is introduced). */
export const COOKIE_CONSENT_VERSION = 1;

/** Dispatched on `window` to reopen the banner from anywhere (footer link). */
export const COOKIE_PREFERENCES_EVENT = "lv:cookie-preferences";

export type ConsentChoice = "all" | "necessary";

export interface StoredConsent {
  version: number;
  choice: ConsentChoice;
  at: string;
}

export function readConsent(): StoredConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredConsent>;
    if (parsed.version !== COOKIE_CONSENT_VERSION) return null;
    if (parsed.choice !== "all" && parsed.choice !== "necessary") return null;
    return { version: parsed.version, choice: parsed.choice, at: parsed.at ?? "" };
  } catch {
    // Private mode, blocked storage, corrupt JSON — treat as "not yet asked".
    return null;
  }
}

export function writeConsent(choice: ConsentChoice): StoredConsent {
  const consent: StoredConsent = {
    version: COOKIE_CONSENT_VERSION,
    choice,
    at: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
  } catch {
    // Nothing we can do; the banner will simply ask again next visit.
  }
  return consent;
}

/** True once the visitor has opted in to non-essential cookies. */
export function hasOptionalConsent(): boolean {
  return readConsent()?.choice === "all";
}

export function openCookiePreferences(): void {
  window.dispatchEvent(new CustomEvent(COOKIE_PREFERENCES_EVENT));
}
