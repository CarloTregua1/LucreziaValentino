import Stripe from "stripe";

let _stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }
  _stripe = new Stripe(key, {
    apiVersion: "2026-04-22.dahlia",
    typescript: true,
  });
  return _stripe;
}

// Proxy that lazily resolves the Stripe instance on first property access,
// matching the same pattern used by firebase-admin to keep the module
// safe to import at build time when env vars aren't set yet.
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    const instance = getStripe();
    const value = instance[prop as keyof Stripe];
    return typeof value === "function" ? (value as (...args: unknown[]) => unknown).bind(instance) : value;
  },
});
