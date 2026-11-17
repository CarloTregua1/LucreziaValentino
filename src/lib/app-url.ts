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

/**
 * Base URL for links and QR codes the admin hands to customers (/admin/link-vendita).
 *
 * Not appUrl(): that is localhost:3000 in development — useless from a
 * customer's phone — and still the vercel.app host in production (see the
 * custom-domain note). A printed QR code lives forever, so it must name the
 * canonical domain. Override with SHARE_URL — deliberately not NEXT_PUBLIC_,
 * so it's read at request time and `npm run demo` can point the QR codes at a
 * temporary tunnel without rebuilding. Server-only: call it from server code.
 */
export function shareUrl(fallback = "https://lucreziavalentino.com"): string {
  const raw = process.env.SHARE_URL?.trim();
  return (raw || fallback).replace(/\/+$/, "");
}
