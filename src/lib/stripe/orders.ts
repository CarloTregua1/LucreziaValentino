import type Stripe from "stripe";
import { adminDb } from "@/lib/firebase/admin";
import type { OrderDoc, OrderItem, OrderStatus } from "@/types";

// Deliberately not in a "use server" file: every export of one is a Server
// Action, callable by direct POST, and this trusts its arguments completely —
// the webhook has already verified them against Stripe's signature.

/**
 * Idempotently writes an order from a Stripe Checkout Session.
 * Called from the Stripe webhook. Uses the Stripe session id as the doc id
 * so retries don't create duplicates.
 */
export async function upsertOrderFromStripeSession(
  session: Stripe.Checkout.Session,
  lineItems: Stripe.LineItem[],
): Promise<{ ok: true; orderId: string; created: boolean } | { ok: false; error: string; permanent: boolean }> {
  const userId =
    (session.metadata?.userId as string | undefined) ??
    (session.client_reference_id as string | undefined);

  if (!userId) {
    return { ok: false, error: "Stripe session missing userId", permanent: true };
  }

  const email = session.customer_details?.email ?? session.customer_email ?? "";
  if (!email) {
    return { ok: false, error: "Stripe session missing customer email", permanent: true };
  }

  const items: OrderItem[] = lineItems
    .filter((li) => li.price?.unit_amount != null)
    .map((li) => {
      const unit = li.price!.unit_amount!;
      const qty = li.quantity ?? 1;
      return {
        productId: (li.price?.product as string | undefined) ?? li.id,
        slug: (li.price?.product as string | undefined) ?? li.id,
        name: li.description ?? "Servizio",
        priceCents: unit,
        quantity: qty,
        subtotalCents: unit * qty,
      };
    });

  const subtotalCents = items.reduce((sum, i) => sum + i.subtotalCents, 0);
  const totalCents = session.amount_total ?? subtotalCents;

  const status: OrderStatus =
    session.payment_status === "paid" ? "paid" : "pending";

  const now = new Date().toISOString();
  const orderRef = adminDb.collection("ordini").doc(session.id);

  const existing = await orderRef.get();
  if (existing.exists) {
    await orderRef.update({ status, updatedAt: now });
    return { ok: true, orderId: orderRef.id, created: false };
  }

  const order: OrderDoc = {
    id: orderRef.id,
    userId,
    email,
    status,
    items,
    subtotalCents,
    totalCents,
    currency: "EUR",
    stripeSessionId: session.id,
    stripePaymentIntentId:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? "",
    createdAt: now,
    updatedAt: now,
  };

  await orderRef.set(order);
  return { ok: true, orderId: orderRef.id, created: true };
}
