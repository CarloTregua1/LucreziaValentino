import { appUrl } from "@/lib/app-url";
import type { ServizioDoc } from "@/types";

const APP_URL = appUrl("http://localhost:3000");

// Servizi store site-relative image paths (see the note in @/lib/schemas/servizio),
// but Stripe rejects anything that isn't an absolute URL. A localhost APP_URL is
// accepted, though the image won't render in Checkout — Stripe can't reach it.
export function absoluteImageUrl(
  url: string | undefined,
  base: string = APP_URL,
): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  return `${base}/${url.replace(/^\/+/, "")}`;
}

/** A Checkout line item priced from the Firestore doc — never from the client. */
export function servizioLineItem(servizio: ServizioDoc, quantity: number, base?: string) {
  const image = absoluteImageUrl(servizio.images[0]?.url, base);
  return {
    price_data: {
      currency: "eur" as const,
      product_data: {
        name: servizio.name,
        description: servizio.shortDescription,
        images: image ? [image] : undefined,
      },
      unit_amount: servizio.priceCents,
    },
    quantity,
  };
}
