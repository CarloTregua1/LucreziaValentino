/**
 * The site's base URL, with any trailing slash removed.
 *
 * Every caller builds paths by concatenation (`${appUrl()}/servizi`), so a
 * NEXT_PUBLIC_APP_URL that ends in "/" silently produces "//servizi". That
 * shipped: the production sitemap and robots.txt advertised doubled slashes,
 * which search engines read as URLs distinct from the canonical ones. Strip
 * it in one place rather than at each call site — checkout.ts was the only
 * one that remembered to.
 */
export function appUrl(fallback = "https://lucrezia-shop.vercel.app"): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();
  return (raw || fallback).replace(/\/+$/, "");
}
