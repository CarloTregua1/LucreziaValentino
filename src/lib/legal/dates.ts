/**
 * Single source of truth for when the legal pages last changed materially.
 * Bump the ISO date whenever the wording of any of them changes; the Italian
 * stamp shown on the page and the sitemap's lastModified both derive from it,
 * so they can't drift apart.
 */
export const LEGAL_UPDATED_AT_ISO = "2026-09-14";

export const LEGAL_UPDATED_AT = new Intl.DateTimeFormat("it-IT", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
}).format(new Date(`${LEGAL_UPDATED_AT_ISO}T00:00:00Z`));
