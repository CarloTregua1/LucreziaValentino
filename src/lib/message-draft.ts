/**
 * sessionStorage key for a message drafted elsewhere on the site (today, the
 * calcolatore's "Invia la simulazione a Lucrezia"). The customer thread picks
 * it up once and clears it. Session storage rather than a query string so the
 * draft survives the login/registration detour unauthenticated visitors take.
 */
export const MESSAGE_DRAFT_KEY = "lv:bozza-messaggio";
