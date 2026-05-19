"use server";

import { cookies } from "next/headers";
import { stripe } from "@/lib/stripe/client";
import { adminDb } from "@/lib/firebase/admin";
import { verifySessionCookie } from "@/lib/firebase/auth";
import {
  createCheckoutSessionSchema,
  type CreateCheckoutSessionInput,
} from "@/lib/schemas/order";
import type { ServizioDoc } from "@/types";

type Result =
  | { ok: true; url: string }
  | { ok: false; error: string; code?: "auth_required" };

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function createCheckoutSession(
  input: CreateCheckoutSessionInput,
): Promise<Result> {
  const parsed = createCheckoutSessionSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Carrello non valido." };
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) {
    return { ok: false, error: "Devi accedere per completare l'acquisto.", code: "auth_required" };
  }

  const user = await verifySessionCookie(sessionCookie);
  if (!user) {
    return { ok: false, error: "Sessione scaduta. Effettua di nuovo l'accesso.", code: "auth_required" };
  }

  // Authoritative price lookup — never trust client cart prices
  const productIds = Array.from(new Set(parsed.data.items.map((i) => i.productId)));
  const snaps = await Promise.all(
    productIds.map((id) =>
      adminDb.collection("servizi").where("slug", "==", id).limit(1).get(),
    ),
  );

  const servizi = new Map<string, ServizioDoc>();
  for (const snap of snaps) {
    if (!snap.empty) {
      const doc = snap.docs[0].data() as ServizioDoc;
      servizi.set(doc.slug, doc);
    }
  }

  const lineItems: Array<{
    price_data: {
      currency: "eur";
      product_data: { name: string; description?: string; images?: string[] };
      unit_amount: number;
    };
    quantity: number;
  }> = [];

  for (const item of parsed.data.items) {
    const servizio = servizi.get(item.productId);
    if (!servizio) {
      return { ok: false, error: `Servizio non trovato: ${item.productId}` };
    }
    if (servizio.status !== "published") {
      return { ok: false, error: `Servizio non disponibile: ${servizio.name}` };
    }
    lineItems.push({
      price_data: {
        currency: "eur",
        product_data: {
          name: servizio.name,
          description: servizio.shortDescription,
          images: servizio.images[0]?.url ? [servizio.images[0].url] : undefined,
        },
        unit_amount: servizio.priceCents,
      },
      quantity: item.quantity,
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      customer_email: user.email,
      client_reference_id: user.uid,
      success_url: `${APP_URL}/checkout/successo?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/carrello`,
      locale: "it",
      billing_address_collection: "auto",
      metadata: {
        userId: user.uid,
      },
      payment_intent_data: {
        metadata: {
          userId: user.uid,
        },
      },
    });

    if (!session.url) {
      return { ok: false, error: "Impossibile creare la sessione di pagamento." };
    }

    return { ok: true, url: session.url };
  } catch (e) {
    console.error("Stripe checkout error", e);
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Errore Stripe imprevisto.",
    };
  }
}
