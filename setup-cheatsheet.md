# Manual Setup Cheat Sheet — Lucrezia E-commerce

> Everything Claude Code **cannot** do for you. Work through this roughly in order. Items marked 🔴 are blockers for the next phase; 🟡 can be deferred.

---

## Before anything else — accounts you'll need

| Service | Plan to start | Cost | Why |
|---|---|---|---|
| GitHub | Free | €0 | Code hosting |
| Vercel | Hobby (free) → Pro when needed | €0 → ~€20/mo | Next.js hosting |
| Firebase | Spark (free) → Blaze (pay-as-you-go) | €0 → ~€5-25/mo | Auth, Firestore, Storage |
| Stripe | Standard | 1.5% + €0.25 per EU card transaction | Payments |
| Resend | Free (3k emails/mo) → Pro | €0 → €20/mo | Transactional email |
| Domain registrar | One-off | ~€15/yr | The `.it` or `.com` domain |

**Important:** Firebase Spark plan does NOT allow outbound network calls from Cloud Functions or the Admin SDK to non-Google services. You'll need to upgrade to **Blaze (pay-as-you-go)** before Phase 5 (chat email notifications). Blaze has a generous free tier — for a small shop you'll likely pay €0-5/mo. Set a budget alert at €20 to be safe.

---

## 1. GitHub setup 🔴

1. Create a new repo at github.com — call it `lucrezia-shop` (or similar)
2. **Set it to Private** (you'll make it public only if you want to, never required)
3. Don't initialize with README/gitignore/license — Claude Code will create those
4. Copy the SSH or HTTPS clone URL — you'll give this to Claude Code in Phase 1
5. If you don't already have git configured locally:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your@email.com"
   ```

---

## 2. Firebase setup 🔴

### 2.1 Create the project

1. Go to **console.firebase.google.com**
2. Click "Add project" → name it `lucrezia-shop` (or similar)
3. **Disable Google Analytics** for now (you can add it later; speeds up setup)
4. Wait for the project to provision

### 2.2 Enable Authentication

1. Left sidebar → **Build → Authentication** → "Get started"
2. **Sign-in method** tab → enable:
   - **Email/Password** — toggle on, leave passwordless off
   - **Google** — toggle on. You'll need to set a "public-facing name" (use "Lucrezia Shop") and a "support email" (use Lucrezia's email)
3. **Settings** tab → **Authorized domains** → add your future Vercel domain (e.g. `lucrezia-shop.vercel.app`) and eventually her real domain. Localhost is added by default.

### 2.3 Enable Firestore

1. Left sidebar → **Build → Firestore Database** → "Create database"
2. Start in **Production mode** (NOT test mode — Claude Code will provide proper security rules)
3. Choose location: **eur3 (europe-west)** — keeps data in the EU for GDPR
4. ⚠️ This location choice is **permanent**. Get it right the first time.

### 2.4 Enable Storage

1. Left sidebar → **Build → Storage** → "Get started"
2. Start in **Production mode**
3. Same EU location as Firestore

### 2.5 Get the client-side config (for `NEXT_PUBLIC_FIREBASE_*` vars)

1. **Project settings** (gear icon, top left) → **General** tab
2. Scroll to "Your apps" → click the `</>` web icon to register a web app
3. App nickname: `lucrezia-shop-web`. Skip Firebase Hosting setup.
4. You'll see a `firebaseConfig` object. Copy these values into Vercel as:
   - `apiKey` → `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `authDomain` → `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `projectId` → `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `storageBucket` → `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `messagingSenderId` → `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `appId` → `NEXT_PUBLIC_FIREBASE_APP_ID`

### 2.6 Get the server-side credentials (for Firebase Admin SDK)

1. **Project settings** → **Service accounts** tab
2. Click "Generate new private key" → confirm → a JSON file downloads
3. **Treat this file like a password.** Never commit it to git. Don't email it.
4. Open the JSON and copy three values into Vercel:
   - `project_id` → `FIREBASE_ADMIN_PROJECT_ID`
   - `client_email` → `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_ADMIN_PRIVATE_KEY` ⚠️ paste the **entire string** including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`, with the `\n` newline characters intact. Vercel handles this correctly if you paste it as one line with `\n` literally inside.

### 2.7 Upgrade to Blaze plan 🟡 (do this before Phase 5)

1. Bottom-left → **Upgrade** → choose **Blaze**
2. Add a billing account (Google Cloud billing)
3. **Set a budget alert**: Google Cloud Console → Billing → Budgets & alerts → set €20/month alert. Lucrezia is unlikely to ever exceed this for a small shop, but caps your downside if something goes wrong.

### 2.8 Grant yourself admin role (after first signup)

After Phase 2 is deployed and you've created your first account on the live site, you need to make yourself an admin. Two options:

**Option A (recommended) — via Firebase CLI:**
```bash
npm install -g firebase-tools
firebase login
firebase use lucrezia-shop  # your project ID
```
Then Claude Code can write a small Node script (`scripts/set-admin.ts`) that takes an email and sets the `role: 'admin'` custom claim. Run it once per admin.

**Option B — via Google Cloud Console:** clunkier, skip unless A breaks.

---

## 3. Stripe setup 🔴 (for Phase 4)

### 3.1 Account

1. Sign up at **stripe.com** — choose Italy as the country
2. You'll start in **test mode** automatically — that's correct for development
3. Complete the business profile when ready to accept real payments (requires Italian P.IVA / Codice Fiscale, bank account, ID verification). **Lucrezia needs to do this part herself** — it's tied to her tax identity.

### 3.2 Enable payment methods

1. Dashboard → **Settings → Payment methods**
2. Enable:
   - **Cards** (Visa, Mastercard, Amex) — on by default
   - **Klarna** — toggle on, may require activation (usually instant for IT)
   - **Apple Pay / Google Pay** — on by default with Checkout
   - **Link** — on by default
   - **Satispay** — toggle on. Available in Italy; widely used.
   - **SEPA Direct Debit** — optional, useful for high-ticket items
3. Toggles available change based on country. If something's missing, contact Stripe support.

### 3.3 Enable Stripe Tax 🟡

1. Dashboard → **Tax** → "Get started"
2. Add Lucrezia's P.IVA (Italian VAT number)
3. Configure tax registrations: at minimum **Italy**. If she'll sell elsewhere in the EU, register for **OSS (One-Stop Shop)** through the Agenzia delle Entrate and add those registrations here.
4. Stripe Tax costs 0.5% per transaction with automatic tax — worth it for compliance.

### 3.4 API keys (test mode, for development)

1. Dashboard → **Developers → API keys**
2. Copy:
   - **Publishable key** (`pk_test_...`) → Vercel as `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** (`sk_test_...`) → Vercel as `STRIPE_SECRET_KEY`
3. ⚠️ When going live, you'll repeat with `pk_live_...` and `sk_live_...` keys.

### 3.5 Webhook 🔴 (do this in Phase 4, after first deploy)

1. Dashboard → **Developers → Webhooks** → "Add endpoint"
2. Endpoint URL: `https://your-vercel-domain.vercel.app/api/stripe/webhook`
3. Events to send: select these specifically (don't send all events):
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
   - `checkout.session.async_payment_failed`
   - `payment_intent.payment_failed`
   - `charge.refunded`
4. After creating, click into the endpoint → reveal **Signing secret** (starts with `whsec_...`)
5. Copy to Vercel as `STRIPE_WEBHOOK_SECRET`
6. For local testing during development, use the Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   This gives you a separate webhook secret for local — keep them straight.

---

## 4. Resend setup 🔴 (for Phase 5)

### 4.1 Account & API key

1. Sign up at **resend.com**
2. Dashboard → **API Keys** → "Create API Key" → name it `lucrezia-shop-prod`
3. Permission: **Sending access** is enough (don't grant full access)
4. Copy the key (shown only once) → Vercel as `RESEND_API_KEY`

### 4.2 Domain verification 🔴

You can't send from a domain you don't own. Two options:

**Option A — use Resend's onboarding domain (quick, for testing):**
- Set `RESEND_FROM_EMAIL=onboarding@resend.dev`
- Works immediately but looks unprofessional. Use only during development.

**Option B — use Lucrezia's real domain (required for production):**
1. Dashboard → **Domains** → "Add Domain" → e.g. `lucrezia.it`
2. Resend gives you DNS records to add (SPF, DKIM, DMARC). Add them at the domain registrar.
3. Wait for verification (usually <1 hour, sometimes up to 24h)
4. Once verified, set `RESEND_FROM_EMAIL="Lucrezia <noreply@lucrezia.it>"`

Set the notification recipient too:
- `LUCREZIA_NOTIFICATION_EMAIL=lucrezia@lucrezia.it` (her real inbox)

---

## 5. Vercel setup 🔴

### 5.1 Connect repo

1. Sign up at **vercel.com** with GitHub
2. "Add New" → "Project" → import the `lucrezia-shop` repo
3. Framework preset: **Next.js** (auto-detected)
4. Root directory: leave as `./`
5. **Don't deploy yet** — first add env vars (next step)

### 5.2 Add environment variables

In project settings → **Environment Variables**, add every variable from the `.env.example` file Claude Code created. For each variable:
- Set value
- Select environments: **Production, Preview, Development** (all three for most vars)
- For `NEXT_PUBLIC_APP_URL`, set per-environment values:
  - Production: `https://lucrezia.it` (or whatever the final domain is)
  - Preview: leave blank or use `${VERCEL_URL}` pattern
  - Development: `http://localhost:3000`

After adding all vars, click **Deploy** on the project page.

### 5.3 Custom domain 🟡 (when Lucrezia has one)

1. Project settings → **Domains** → add `lucrezia.it` (and `www.lucrezia.it`)
2. Vercel gives you DNS records to set at the registrar (one A record + one CNAME, usually)
3. SSL cert is automatic
4. Update `NEXT_PUBLIC_APP_URL` env var in Vercel production to match
5. Update Stripe webhook endpoint to point to the new domain
6. Update Firebase Authorized domains to include the new domain
7. Update Resend domain if using a different one
8. Redeploy

### 5.4 Watch the build minutes 🟡

Hobby plan: 6000 build minutes/month. Each Next.js build takes ~2-5 min. If you (or Claude Code) push 50+ times per day, you can hit limits. Upgrade to Pro (~€20/mo) when this becomes annoying.

---

## 6. Domain registration 🟡

If Lucrezia doesn't have one yet:

- **For `.it` domains:** register at any accredited registrar — Namecheap, Cloudflare Registrar, OVH, Aruba. Cloudflare is cheapest (~€10/yr) and has good DNS tools. `.it` domains require an Italian address (Lucrezia has one).
- **For `.com`:** any registrar. Cloudflare or Namecheap recommended.
- After purchase, point nameservers to Cloudflare (free) or use the registrar's DNS — Cloudflare gives you faster DNS and free DDoS protection.

---

## 7. Legal/compliance prep 🟡 (Lucrezia's homework)

Before going live she will need:

- **P.IVA** (VAT number) — already required if she's selling commercially in Italy
- **Privacy Policy** in Italian (GDPR compliant). Iubenda is the easiest tool for this — generates compliant policies for ~€30/year.
- **Cookie Policy + cookie banner** — Iubenda also handles this. Italian Garante has been aggressive about cookie compliance; don't skip.
- **Terms & Conditions** for e-commerce (Condizioni di Vendita) — Iubenda template, or have a lawyer review.
- **Right of withdrawal info** — EU law requires 14-day return window with specific wording.
- **SDI code / PEC** if she'll do electronic invoicing (required in Italy for B2B; B2C is optional but Stripe Tax helps).

You don't need to build these — Claude Code will leave placeholder pages where Lucrezia pastes her Iubenda-generated text.

---

## 8. Order of operations (the actual sequence)

When you start, work through this exact order:

1. ✅ GitHub repo created (you)
2. ✅ Firebase project + Auth + Firestore + Storage enabled (you)
3. ✅ Vercel account ready (you)
4. ▶️ **Start Phase 1 with Claude Code** — give it the GitHub URL
5. ✅ First push happens → connect Vercel → add env vars from steps 2.5 and 2.6
6. ✅ Vercel deploys successfully → `/api/health` returns ok → `/styleguide` looks right
7. ▶️ Phase 2 (auth) → grant yourself admin role (step 2.8)
8. ▶️ Phase 3 (admin panel for products)
9. ✅ Stripe account ready, test keys in Vercel (step 3.4)
10. ▶️ Phase 4 (checkout) → add Stripe webhook (step 3.5)
11. ✅ Firebase upgraded to Blaze, Resend account ready (steps 2.7, 4.1)
12. ▶️ Phase 5 (chat + email)
13. ▶️ Phase 6 (polish)
14. ✅ Custom domain configured, switched to Stripe live keys, Resend on real domain
15. 🚀 Launch

---

## Quick reference — env vars and where they come from

| Variable | Where to get it | Step |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_*` (6 vars) | Firebase Console → Project Settings → General → Your apps | 2.5 |
| `FIREBASE_ADMIN_PROJECT_ID` | Service account JSON, `project_id` | 2.6 |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Service account JSON, `client_email` | 2.6 |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Service account JSON, `private_key` | 2.6 |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API keys | 3.4 |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → Developers → API keys | 3.4 |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Developers → Webhooks → your endpoint | 3.5 |
| `RESEND_API_KEY` | Resend Dashboard → API Keys | 4.1 |
| `RESEND_FROM_EMAIL` | Your verified Resend domain | 4.2 |
| `LUCREZIA_NOTIFICATION_EMAIL` | Lucrezia's actual inbox | 4.2 |
| `NEXT_PUBLIC_APP_URL` | Your Vercel/custom domain | 5.2 |

---

## Things that will trip you up

- **Firebase private key formatting in Vercel.** Paste with `\n` characters inline, not actual newlines. Test by deploying and checking `/api/health` — if it says firebase: error, this is usually why.
- **Stripe in test mode shows fake successful payments.** Use card `4242 4242 4242 4242` with any future expiry and any CVC. Don't celebrate until you've tested with `live` keys and a real card.
- **Firebase security rules can lock you out.** If something stops working after a rules deploy, check the rules tab in the Firestore console — there's a "Rules Playground" to simulate requests.
- **Resend free tier sends from `onboarding@resend.dev`** which routes to spam often. Set up a real domain before showing the chat feature to Lucrezia or her test users.
- **Vercel preview deployments don't use production env vars by default.** If you want previews to talk to a separate Firebase/Stripe environment, you need to set Preview-specific values. Easier path: use the same dev/test credentials for both Preview and Development.
- **Italian Garante and cookies.** A non-compliant cookie banner can result in fines. Use Iubenda or a similar compliant solution — don't roll your own.

---

## When something breaks

1. Check the Vercel deployment logs (Deployments → click the failing build → Logs)
2. Check `/api/health` on the deployed URL — tells you which integration is misconfigured
3. Check Firebase Console → Firestore → Rules tab → Playground (simulate the request)
4. Check Stripe Dashboard → Developers → Logs (every API call is logged)
5. Check Resend Dashboard → Emails (every send attempt with delivery status)
6. Browser DevTools console for client-side errors

If something's truly stuck, paste the error + relevant code into Claude Code and it can debug.
