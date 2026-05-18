export const runtime = "nodejs";

export async function GET() {
  const firebaseConfigured =
    !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    !!process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  const stripeConfigured = !!process.env.STRIPE_SECRET_KEY;

  return Response.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    firebase: firebaseConfigured ? "connected" : "error",
    stripe: stripeConfigured ? "configured" : "missing",
  });
}
