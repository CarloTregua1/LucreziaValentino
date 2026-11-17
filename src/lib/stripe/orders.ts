import type Stripe from "stripe";
import { stripe } from "@/lib/stripe/client";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import type { OrderDoc, OrderItem, OrderSource, OrderStatus } from "@/types";

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
  const email = session.customer_details?.email ?? session.customer_email ?? "";
  if (!email) {
    return { ok: false, error: "Stripe session missing customer email", permanent: true };
  }

  // Direct buy links (/acquista) are guest checkouts with no userId. Attach the
  // order to an existing account with the same email so it still shows up in
  // that customer's /account/ordini; otherwise it's visible to the admin only.
  const source: OrderSource = session.metadata?.source === "link" ? "link" : "cart";
  const userId =
    (session.metadata?.userId as string | undefined) ??
    (session.client_reference_id as string | undefined) ??
    (await findUserIdByEmail(email));

  if (!userId && source !== "link") {
    return { ok: false, error: "Stripe session missing userId", permanent: true };
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
    userId: userId ?? "",
    email,
    source,
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
  if (source === "link") await sendGuestReceipt(order.stripePaymentIntentId, email);
  return { ok: true, orderId: orderRef.id, created: true };
}

async function findUserIdByEmail(email: string): Promise<string | undefined> {
  try {
    return (await adminAuth.getUserByEmail(email)).uid;
  } catch {
    return undefined; // auth/user-not-found — a genuine guest
  }
}

/**
 * Cart checkouts set receipt_email up front, which is what makes Stripe send
 * the receipt in live mode. A guest's email is only known after they pay, so
 * set it now: updating receipt_email on a succeeded PaymentIntent makes Stripe
 * send the receipt. Best-effort — the order is already saved, and a webhook
 * retry must not fail over a missing receipt.
 */
async function sendGuestReceipt(paymentIntentId: string, email: string): Promise<void> {
  if (!paymentIntentId) return;
  try {
    await stripe.paymentIntents.update(paymentIntentId, { receipt_email: email });
  } catch (e) {
    console.error("Could not set receipt_email on guest payment", e);
  }
}
