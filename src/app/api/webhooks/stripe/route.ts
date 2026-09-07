import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe/client";
import { upsertOrderFromStripeSession } from "@/lib/actions/orders";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  if (!WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, WEBHOOK_SECRET);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown verification error";
    console.error("Stripe webhook signature verification failed:", msg);
    return NextResponse.json({ error: `Webhook Error: ${msg}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        // Delayed-notification methods (SEPA, Klarna, ...) emit `completed` while
        // the session is still unpaid; the payment settles later and arrives as
        // `async_payment_succeeded`. Fulfilling now would confirm orders that
        // can still fail.
        if (session.payment_status === "unpaid") break;
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
          limit: 100,
          expand: ["data.price.product"],
        });
        const result = await upsertOrderFromStripeSession(session, lineItems.data);
        if (!result.ok) {
          console.error("Order upsert failed:", result.error);
          // A permanent failure can never succeed on redelivery, so acknowledge
          // it — a 5xx would make Stripe retry the same doomed event for 3 days.
          // Transient failures (Firestore unavailable) throw rather than return,
          // and are caught below, where a 500 correctly asks Stripe to retry.
          if (result.permanent) {
            return NextResponse.json({ received: true, ignored: result.error });
          }
          return NextResponse.json({ error: result.error }, { status: 500 });
        }
        // Receipts are sent by Stripe itself (Dashboard → Settings → Emails),
        // so nothing further is needed here.
        break;
      }

      case "checkout.session.async_payment_failed":
      case "checkout.session.expired": {
        // No order is created until payment succeeds.
        break;
      }

      default:
        // Acknowledge but don't act on unhandled event types.
        break;
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("Stripe webhook handler error:", e);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
