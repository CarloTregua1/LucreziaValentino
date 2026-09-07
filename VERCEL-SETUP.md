# Vercel Setup Guide — Lucrezia Shop

## 1. Connect to Vercel

After pushing to GitHub:
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the GitHub repository
3. Framework preset: **Next.js** (auto-detected)
4. Build command: `npm run build` (default)
5. Output directory: `.next` (default)

## 2. Node.js Version

Pin to **Node.js 20** in Vercel project settings → General → Node.js Version.

## 3. Environment Variables

Add all of these in Vercel dashboard → Settings → Environment Variables.
Mark each as **Production**, **Preview**, and **Development** as appropriate.

| Variable | Environment | Where to get it |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | All | Firebase Console → Project Settings → Web App |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | All | Firebase Console → Project Settings → Web App |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | All | Firebase Console → Project Settings → Web App |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | All | Firebase Console → Project Settings → Web App |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | All | Firebase Console → Project Settings → Web App |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | All | Firebase Console → Project Settings → Web App |
| `FIREBASE_ADMIN_PROJECT_ID` | All | Same as `NEXT_PUBLIC_FIREBASE_PROJECT_ID` |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | All | Firebase Console → Project Settings → Service Accounts → Generate new private key |
| `FIREBASE_ADMIN_PRIVATE_KEY` | All | From the downloaded JSON — paste the `private_key` value with `\n` escapes intact |
| `STRIPE_SECRET_KEY` | All | Stripe Dashboard → Developers → API Keys |
| `STRIPE_WEBHOOK_SECRET` | Production | Stripe Dashboard → Developers → Webhooks → signing secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | All | Stripe Dashboard → Developers → API Keys |
| `NEXT_PUBLIC_APP_URL` | Production | `https://lucrezia.it` (or Vercel URL initially) |

### Firebase Admin private key — important note

The private key contains literal `\n` characters. In Vercel's dashboard, paste the value **exactly as it appears in the JSON file** (the multi-line string). Vercel preserves it correctly. Do not manually escape.

## 4. Stripe Webhook (production only)

After the first production deployment:
1. Stripe Dashboard → Developers → Webhooks → Add endpoint
2. URL: `https://yourdomain.com/api/webhooks/stripe`
3. Events to listen for (these are exactly the ones the handler acts on):
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
   - `checkout.session.async_payment_failed`
   - `checkout.session.expired`
4. Copy the signing secret → add as `STRIPE_WEBHOOK_SECRET` in Vercel.
   This is a **different value** from the one `stripe listen` prints locally.

For local development, use Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
This prints its own signing secret — a different value from the Dashboard one above.
Use it in `.env`; use the Dashboard's in Vercel.

### Customer receipts

The app sends no email of its own — receipts come from Stripe.

`createCheckoutSession` sets `payment_intent_data.receipt_email`, and in **live
mode** that alone makes Stripe send a receipt, regardless of Dashboard settings.
Nothing else is required.

The Dashboard toggle (Settings → Business → Customer emails →
**"Successful payments"**, at dashboard.stripe.com/settings/emails) is a
belt-and-braces extra. It is **per-mode** — enabling it in test mode does
nothing for live payments, which is a common source of "no receipt arrived".

Receipts are never sent automatically for test-mode payments; use the Dashboard's
payment detail page → Receipt history → Send receipt to send one manually.

## 5. Firebase Setup

### Enable Authentication
Firebase Console → Authentication → Sign-in method → Enable:
- Email/Password
- Google

### Grant Lucrezia admin access
After she creates her account, run this once:
```bash
# Install Firebase CLI
npm install -g firebase-tools
firebase login

# Run the Admin SDK script (create this once in /scripts/set-admin.ts)
# or use Firebase Functions / Cloud Shell
firebase use <your-project-id>
```

Or use the Firebase Admin SDK in a one-time script:
```typescript
import { adminAuth } from "@/lib/firebase/admin";
await adminAuth.setCustomUserClaims("<lucrezia-uid>", { role: "admin" });
```

### Deploy Firestore rules and indexes
```bash
firebase deploy --only firestore:rules,firestore:indexes
```

## 6. Health check

After every deployment, verify:
```
GET https://yourdomain.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "...",
  "firebase": "connected",
  "stripe": "configured"
}
```

## 7. Custom domain (later)

Vercel dashboard → Domains → Add → follow DNS instructions.
