import { NextResponse, type NextRequest } from "next/server";
import { getServizioBySlug } from "@/lib/actions/servizi";
import { createLinkCheckoutSession, isLinkPurchasable } from "@/lib/stripe/link-checkout";
import { absoluteImageUrl } from "@/lib/stripe/line-items";
import type { ServizioDoc } from "@/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Chat apps and crawlers fetch a link as soon as it's pasted, to draw a preview.
// Sending them to Stripe would create a throwaway Checkout Session per preview
// and render Stripe's generic page in the chat, so they get the product's
// OpenGraph card instead. Only a human tap creates a session.
const PREVIEW_BOT =
  /whatsapp|facebookexternalhit|facebot|meta-externalagent|telegrambot|twitterbot|slackbot|linkedinbot|discordbot|skypeuripreview|pinterest|redditbot|applebot|googlebot|bingbot|embedly|iframely|vkshare|bot\b|crawler|spider|preview/i;

const NO_STORE = { "Cache-Control": "no-store" };

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

function formatEur(cents: number): string {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(
    cents / 100,
  );
}

/**
 * The host the visitor actually used. Behind Vercel or a tunnel the request
 * URL can name an internal host, so prefer the forwarded headers. Only the
 * visitor's own Checkout return URLs depend on it, so a forged Host header
 * can only misdirect the forger.
 */
function publicOrigin(request: NextRequest): string {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!host) return request.nextUrl.origin;
  const proto =
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
    (/^(localhost|127\.|\[::1\])/.test(host) ? "http" : "https");
  return `${proto}://${host}`;
}

function previewHtml(servizio: ServizioDoc, url: string, origin: string): string {
  const title = escapeHtml(`${servizio.name} — ${formatEur(servizio.priceCents)}`);
  const description = escapeHtml(
    servizio.shortDescription || "Acquista in pochi secondi, senza registrazione.",
  );
  const image = absoluteImageUrl(servizio.images[0]?.url, origin);
  return `<!doctype html>
<html lang="it"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${title}</title>
<meta name="description" content="${description}">
<meta property="og:type" content="product">
<meta property="og:site_name" content="Lucrezia Valentino">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${escapeHtml(url)}">
${image ? `<meta property="og:image" content="${escapeHtml(image)}">` : ""}
<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}">
</head><body>
<h1>${title}</h1><p>${description}</p>
<p><a href="${escapeHtml(url)}">Acquista ora</a></p>
</body></html>`;
}

export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug } = await ctx.params;
  const servizio = await getServizioBySlug(slug);
  const origin = publicOrigin(request);

  if (!isLinkPurchasable(servizio)) {
    // Drafts and unknown slugs go to the listing; external-platform servizi
    // to their own page, which links out.
    const published = (servizio as ServizioDoc | null)?.status === "published";
    const target = published ? `/servizi/${slug}` : "/servizi";
    return NextResponse.redirect(new URL(target, origin), { status: 307, headers: NO_STORE });
  }

  const ua = request.headers.get("user-agent") ?? "";
  if (PREVIEW_BOT.test(ua)) {
    return new NextResponse(previewHtml(servizio, `${origin}/acquista/${slug}`, origin), {
      headers: { "Content-Type": "text/html; charset=utf-8", ...NO_STORE },
    });
  }

  try {
    const checkoutUrl = await createLinkCheckoutSession(servizio, origin);
    return NextResponse.redirect(checkoutUrl, { status: 303, headers: NO_STORE });
  } catch (e) {
    console.error("Direct-link checkout failed", e);
    // Fall back to the normal page, where the cart still works.
    return NextResponse.redirect(new URL(`/servizi/${servizio.slug}`, origin), {
      status: 307,
      headers: NO_STORE,
    });
  }
}
