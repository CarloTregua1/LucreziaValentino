import { stripe } from "@/lib/stripe/client";
import { servizioLineItem } from "@/lib/stripe/line-items";
import type { ServizioDoc } from "@/types";

// Deliberately not in a "use server" file: every export of one is a Server
// Action, callable by direct POST with arbitrary arguments. This trusts the
// servizio it's given, which the /acquista route has just read from Firestore.

/** True when a servizio can be paid on-site through a direct link. */
export function isLinkPurchasable(servizio: ServizioDoc | null): servizio is ServizioDoc {
  return !!servizio && servizio.status === "published" && !servizio.externalUrl;
}

/**
 * A guest Checkout Session for one servizio, used by the direct buy links
 * (/acquista/[slug]) that the admin sends to new customers. No account is
 * needed: Stripe collects the email, and the webhook links the order to an
 * existing account with that email, if there is one.
 *
 * `origin` is the host the customer opened the link on. Return URLs use it
 * rather than NEXT_PUBLIC_APP_URL so a customer who scanned a QR for the
 * custom domain (or a demo tunnel) comes back to that same host — the env
 * value is still the vercel.app host in production, and localhost in dev,
 * which a phone can't reach.
 */
export async function createLinkCheckoutSession(
  servizio: ServizioDoc,
  origin: string,
): Promise<string> {
  const base = origin.replace(/\/+$/, "");
  const metadata = { source: "link", slug: servizio.slug };

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [servizioLineItem(servizio, 1, base)],
    success_url: `${base}/checkout/successo?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/servizi/${servizio.slug}`,
    locale: "it",
    billing_address_collection: "auto",
    metadata,
    // receipt_email can't be set yet — the email is only known once the
    // customer types it into Checkout. The webhook sets it afterwards, which
    // is what makes Stripe send the receipt (see sendGuestReceipt).
    payment_intent_data: { metadata },
  });

  if (!session.url) throw new Error("Stripe returned a session without a URL");
  return session.url;
}
