/**
 * The site's base URL, with any trailing slash removed.
 *
 * Every caller builds paths by concatenation (`${appUrl()}/servizi`), so a
 * NEXT_PUBLIC_APP_URL that ends in "/" silently produces "//servizi". That
 * shipped: the production sitemap and robots.txt advertised doubled slashes,
 * which search engines read as URLs distinct from the canonical ones. Strip
 * it in one place rather than at each call site — checkout.ts was the only
 * one that remembered to.
 *
 * The fallback is the real production host. It was lucrezia-shop.vercel.app,
 * which 404s — a name from the original setup notes that the deployment never
 * used. It only fires when NEXT_PUBLIC_APP_URL is unset, so it never broke
 * production, but it would have sent a misconfigured build's sitemap, robots
 * and canonical URLs to a host that doesn't exist.
 */
export function appUrl(fallback = "https://lucrezia-valentino.vercel.app"): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();
  return (raw || fallback).replace(/\/+$/, "");
}
