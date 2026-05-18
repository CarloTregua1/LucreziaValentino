# Claude Code Build Prompt — Lucrezia E-commerce

> **How to use this:** Feed Claude Code one phase at a time. After each phase, review, test, and only then move to the next. Don't paste the whole thing at once — it'll cut corners.

---

## PROJECT CONTEXT (paste at the start of every new Claude Code session)

You are building a production e-commerce website for an Italian client named Lucrezia. The project must be:

- **Modular** — new features (loyalty program, blog, reviews, multi-vendor, etc.) will be added later. Architect for extension, not just for current scope.
- **Aesthetically refined** — Lucrezia is positioning herself in the Italian market and the visual quality is a core requirement, not a nice-to-have. Think editorial, magazine-quality, generous whitespace, considered typography. Not generic Tailwind-template look.
- **SEO-first** — Italian search visibility matters. Server-rendered pages, structured data, semantic HTML, fast LCP.
- **i18n-ready** — primary language Italian, but architecture must support adding English later without refactoring.

### Tech Stack (fixed — do not propose alternatives unless flagged)

- **Framework:** Next.js 15+ (App Router, Server Components by default)
- **Styling:** Tailwind CSS v4 + a small set of custom design tokens (CSS variables). Use shadcn/ui sparingly — customize heavily, don't ship default look.
- **Auth:** Firebase Auth (email/password + Google OAuth)
- **Database:** Firestore (Firebase)
- **File storage:** Firebase Storage (for product images)
- **Payments:** Stripe Checkout (hosted) — supports cards, Klarna, Apple/Google Pay, Satispay. Use Stripe Tax for Italian IVA.
- **Email:** Resend (transactional emails to Lucrezia + order confirmations to customers)
- **Hosting:** Vercel (for Next.js) + Firebase (for backend services). **The project must be deployable to Vercel from the very first commit.** No environment-specific code, no hardcoded `localhost`, all secrets via env vars.
- **Real-time chat:** Firestore listeners
- **Type safety:** TypeScript strict mode, Zod for runtime validation

### Hard rules

1. **Server Components by default.** Only mark `"use client"` when there is genuine interactivity (forms, listeners, hooks). Product pages, category pages, and the homepage MUST be server-rendered.
2. **No client-side data fetching for SEO-critical content.** Use `generateStaticParams`, `revalidate`, or Server Components.
3. **All user input validated with Zod** on both client and server.
4. **All Firestore writes go through API routes or Server Actions** — never let the client write directly to Firestore for orders, products, or admin actions. Firestore security rules are a backup, not the primary defense.
5. **Money is stored in cents (integers).** Never floats.
6. **No magic strings.** Statuses, roles, categories — all enums/const objects in `/lib/constants`.

---

## GIT WORKFLOW (follow on every change)

You have permission to run `git` commands. Use it.

### Commit conventions

- Use **Conventional Commits**: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `style:`, `test:`, `perf:`
- Commit message format:
  ```
  <type>(<scope>): <short summary in lowercase>

  <optional body explaining what and why, not how>
  ```
- Examples:
  - `feat(auth): add google oauth login flow`
  - `feat(admin): build product creation form with image upload`
  - `fix(checkout): recompute totals server-side before stripe session`
  - `chore(deps): add resend for transactional email`

### Commit cadence

- **One logical change per commit.** Don't bundle "added auth and built the product page" — that's two commits.
- Commit after every meaningful unit of work (a working component, a passing route, a configured integration), not after every file save.
- Never commit broken code to `main`. If something is mid-refactor and not working, either finish it or stash it.
- Never commit `.env*` files, `node_modules`, `.next/`, Firebase service account JSON, or anything in `.gitignore`. Verify `.gitignore` is correct before the first commit.

### Branching

- Work directly on `main` for Phase 1 (scaffolding).
- From Phase 2 onward, use feature branches: `feat/auth`, `feat/admin-products`, `feat/stripe-checkout`, etc. Open them with descriptive names so Vercel preview URLs are readable.
- Merge to `main` only when the feature is reviewed and tested.

### When I ask you to push

- When I say "push" or "push to git" or "commit and push", run:
  1. `git status` to show me what's about to be committed
  2. `git add` the relevant files (not blanket `git add .` if there are unrelated changes)
  3. `git commit` with a proper conventional commit message
  4. `git push` to the current branch
- If there are uncommitted changes I haven't approved (e.g. debug logging, experimental code), flag them and ask before including them.
- After pushing, share the Vercel preview URL (it'll be in the GitHub PR comment or Vercel dashboard).

### Initial repo setup (do this in Phase 1, step 1)

```bash
git init
git branch -M main
# Wait for me to create the GitHub repo, then:
git remote add origin <url-i-will-provide>
```

Generate a `.gitignore` that covers Next.js, Firebase, OS files, editor files, and env files. Specifically:

```
node_modules/
.next/
out/
build/
.env
.env*.local
.env.production
*.log
.DS_Store
.vscode/
.idea/
firebase-debug.log
firestore-debug.log
*-service-account*.json
.vercel
```

---

## VERCEL DEPLOYMENT (live from day one)

The goal: every push to GitHub triggers a Vercel deployment, so I can test functionality on a real URL throughout development.

### Setup checklist (Phase 1, before any feature code)

1. After the first commit is pushed to GitHub, I will connect the repo to Vercel via the Vercel dashboard.
2. You will produce a `VERCEL-SETUP.md` file at the project root that lists:
   - Every environment variable Vercel needs (with example values and where to get them)
   - Build command (default: `next build`)
   - Output directory (default: `.next`)
   - Node version to pin (specify in `package.json` `engines` field)
   - Any Vercel-specific config (regions, function memory if needed)
3. Create a `vercel.json` only if non-default config is needed. Otherwise omit it — Vercel auto-detects Next.js.

### Environment variables (document all of these in `.env.example` and `VERCEL-SETUP.md`)

```
# Firebase client (public, prefixed NEXT_PUBLIC_)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (server only, never prefix with NEXT_PUBLIC_)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=        # paste with \n escapes intact

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=                 # e.g. "Lucrezia <noreply@lucrezia.it>"
LUCREZIA_NOTIFICATION_EMAIL=       # where chat notifications go

# App
NEXT_PUBLIC_APP_URL=               # https://lucrezia-shop.vercel.app initially, real domain later
```

### Preview deployments

- Every push to a non-main branch creates a preview URL. Use this to test before merging.
- The Stripe webhook will NOT work on preview URLs unless you set up a separate webhook endpoint for the preview domain. For Phase 4 (Stripe), test webhooks locally with `stripe listen --forward-to localhost:3000/api/stripe/webhook` and on production via the real Vercel domain.

### Deployment health check

Build a simple `/api/health` route that returns:
```json
{ "status": "ok", "timestamp": "...", "firebase": "connected" | "error", "stripe": "configured" | "missing" }
```

This lets you verify a deployment is actually working, not just that the build succeeded.

### Vercel-specific gotchas to avoid

- **Don't use Node-only APIs in Edge runtime routes.** Firebase Admin SDK requires Node runtime — explicitly set `export const runtime = 'nodejs'` in any API route that uses it.
- **Don't read `process.env` in client components.** Only `NEXT_PUBLIC_*` vars are available client-side; everything else is undefined and will silently break.
- **Image domains:** add Firebase Storage domain to `next.config.js` under `images.remotePatterns` so `next/image` can serve product images from Firebase.
- **Function timeouts:** Vercel free tier limits serverless functions to 10s. Stripe webhooks and email sends must complete fast or be queued.

---

## PHASE 1 — Project scaffold, design system, and database schema

Goal: get the skeleton right before writing any features.

### 1.0 Repo initialization (do this first)

- `git init`, create `.gitignore` (as specified in the Git Workflow section above)
- Make the first commit: `chore: initial commit`
- I will create the GitHub repo and give you the remote URL
- Push to GitHub, then I'll connect Vercel
- Produce `VERCEL-SETUP.md` with the env var list and setup steps
- Produce `.env.example` matching the variables in `VERCEL-SETUP.md`

### 1.2 Initialize project

```bash
npx create-next-app@latest lucrezia-shop --typescript --tailwind --app --src-dir --import-alias "@/*"
```

Install: `firebase firebase-admin zod react-hook-form @hookform/resolvers stripe @stripe/stripe-js resend lucide-react clsx tailwind-merge class-variance-authority`

Dev deps: `@types/node prettier prettier-plugin-tailwindcss`

### 1.3 Folder structure (create empty files/folders as scaffolding)

```
src/
├── app/
│   ├── (shop)/                    # public storefront, shared layout
│   │   ├── layout.tsx
│   │   ├── page.tsx               # homepage
│   │   ├── prodotti/
│   │   │   ├── page.tsx           # product list
│   │   │   └── [slug]/page.tsx    # product detail
│   │   ├── categoria/[slug]/page.tsx
│   │   ├── carrello/page.tsx
│   │   ├── checkout/
│   │   │   ├── page.tsx
│   │   │   └── successo/page.tsx
│   │   ├── account/
│   │   │   ├── page.tsx
│   │   │   ├── ordini/page.tsx
│   │   │   └── messaggi/page.tsx  # customer chat with Lucrezia
│   │   └── chi-siamo/page.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── registrati/page.tsx
│   ├── admin/                     # admin panel, separate layout, role-protected
│   │   ├── layout.tsx
│   │   ├── page.tsx               # dashboard
│   │   ├── prodotti/
│   │   │   ├── page.tsx           # list + bulk actions
│   │   │   ├── nuovo/page.tsx
│   │   │   └── [id]/page.tsx      # edit
│   │   ├── ordini/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── messaggi/page.tsx      # Lucrezia's inbox for customer chats
│   │   ├── categorie/page.tsx
│   │   └── impostazioni/page.tsx
│   ├── api/
│   │   ├── stripe/
│   │   │   ├── checkout/route.ts
│   │   │   └── webhook/route.ts
│   │   ├── chat/
│   │   │   └── notify/route.ts    # triggers email to Lucrezia
│   │   └── admin/
│   │       └── ...                # protected admin endpoints
│   ├── sitemap.ts
│   ├── robots.ts
│   └── layout.tsx                 # root layout, fonts, metadata
├── components/
│   ├── ui/                        # shadcn-style primitives, customized
│   ├── shop/                      # storefront components
│   ├── admin/                     # admin components
│   └── shared/                    # nav, footer, etc.
├── lib/
│   ├── firebase/
│   │   ├── client.ts              # browser SDK
│   │   ├── admin.ts               # Firebase Admin SDK (server only)
│   │   └── auth.ts                # auth helpers
│   ├── stripe/
│   │   └── client.ts
│   ├── email/
│   │   └── resend.ts
│   ├── schemas/                   # Zod schemas for all entities
│   ├── constants/                 # enums, config
│   └── utils/
├── types/
│   └── index.ts
└── middleware.ts                  # route protection
```

### 1.4 Design system (CRITICAL — get this right before any UI work)

Create `src/app/globals.css` with custom design tokens. Do NOT use shadcn defaults wholesale.

**Typography:** Use **two contrasting fonts** loaded via `next/font`:
- A refined serif for headings (e.g. `Cormorant Garamond`, `Playfair Display`, or `Fraunces`) — gives editorial weight
- A clean grotesque sans for body (e.g. `Inter`, `Geist`, or `DM Sans`)

**Color palette:** propose a sophisticated, restrained palette. Avoid pure black/white. Suggest something like warm off-white background (`#FAF7F2`), deep ink for text (`#1A1A1A`), a single accent color chosen for Lucrezia's brand (default to a muted terracotta `#B5654B` or deep forest `#2C3E2D` until brand is confirmed). Document all tokens as CSS variables.

**Spacing scale:** generous. Default section padding `py-24 md:py-32`. Container max-width `max-w-7xl` with `px-6 md:px-8`.

**Component primitives to build first** (in `components/ui/`):
- `Button` with variants: `primary`, `secondary`, `ghost`, `link` — all custom-styled, no default Tailwind blue
- `Input`, `Textarea`, `Select` — minimal, underline-style or thin border, lots of breathing room
- `Card` — for products
- `Dialog`, `Sheet`, `Toast`

**Don't ship the AI-generated-website look.** No gradients, no glassmorphism, no purple-to-pink, no centered hero with three feature columns and emojis. Think: Aesop, Toteme, Jacquemus, La Double J — Italian/European editorial e-commerce.

### 1.5 Firestore data model

Document this in `src/lib/schemas/` as Zod schemas AND in a `DATA-MODEL.md` file at the project root.

**Collections:**

```
users/{uid}
  - email: string
  - displayName: string
  - role: 'customer' | 'admin'
  - createdAt: timestamp
  - phone?: string
  - addresses: subcollection
  - defaultAddressId?: string

users/{uid}/addresses/{addressId}
  - fullName, street, city, postalCode, province, country, phone
  - isDefault: boolean

products/{productId}
  - slug: string (unique, URL-safe, Italian)
  - name: { it: string, en?: string }     # i18n-ready from day one
  - description: { it: string, en?: string }
  - shortDescription: { it: string, en?: string }
  - type: 'physical' | 'digital'
  - priceCents: number                      # base price in EUR cents
  - compareAtPriceCents?: number            # for "was X, now Y" display
  - currency: 'EUR'
  - images: Array<{ url, alt, order }>
  - categoryIds: string[]
  - tags: string[]
  - hasVariants: boolean
  - variantOptions?: Array<{ name: 'size'|'color'|..., values: string[] }>
  - inventory?: { tracked: boolean, quantity: number }   # for products without variants
  - weight?: number                         # grams, for shipping
  - status: 'draft' | 'active' | 'archived'
  - seo: { title?, description?, ogImage? }
  - createdAt, updatedAt: timestamp

products/{productId}/variants/{variantId}
  - sku: string
  - options: { size?: 'M', color?: 'red', ... }
  - priceCents: number                      # overrides base if present
  - inventory: { quantity: number }
  - images?: string[]                       # variant-specific images

categories/{categoryId}
  - slug: string
  - name: { it, en? }
  - description: { it, en? }
  - parentId?: string                       # for nested categories
  - order: number
  - image?: string
  - seo: { ... }

orders/{orderId}
  - userId: string
  - email: string                           # for guest checkout future-proofing
  - status: 'pending'|'paid'|'fulfilled'|'shipped'|'delivered'|'cancelled'|'refunded'
  - items: Array<{
      productId, variantId?, slug, name, image,
      priceCents, quantity, subtotalCents
    }>
  - subtotalCents, shippingCents, taxCents, totalCents: number
  - currency: 'EUR'
  - stripeSessionId, stripePaymentIntentId: string
  - shippingAddress, billingAddress: object
  - shippingMethod?: string
  - trackingNumber?: string
  - notes?: string
  - createdAt, updatedAt: timestamp

conversations/{conversationId}
  - userId: string
  - userEmail, userName: string
  - lastMessageAt: timestamp
  - lastMessagePreview: string
  - unreadByAdmin: boolean
  - unreadByCustomer: boolean
  - createdAt: timestamp

conversations/{conversationId}/messages/{messageId}
  - senderId: string                        # uid or 'admin'
  - senderRole: 'customer' | 'admin'
  - content: string
  - createdAt: timestamp
  - readAt?: timestamp

settings/general                            # singleton doc
  - shopName, shopEmail, shopPhone
  - shippingZones: Array<{ name, countries, methods: [{name, priceCents, etaDays}] }>
  - freeShippingThresholdCents?: number
  - vatNumber: string                       # P.IVA
  - returnsPolicy: { it, en? }
  - shippingPolicy: { it, en? }
```

**Indexes you'll need:** create a `firestore.indexes.json`:
- `products` where `status == 'active'` order by `createdAt desc`
- `products` where `categoryIds array-contains` order by `createdAt desc`
- `orders` where `userId ==` order by `createdAt desc`
- `conversations` order by `lastMessageAt desc`

### 1.6 Firestore security rules

Write `firestore.rules` that:
- Allow public read of `products` where `status == 'active'` and `categories`
- Allow authenticated users to read their own `users/{uid}` doc and subcollections
- Allow authenticated users to read/write only their own conversation messages
- **Deny all client writes** to `products`, `orders`, `categories`, `settings` — these go through server-side admin SDK only
- Allow admin role (checked via custom claim) to do anything

Set up admin role via Firebase Auth custom claims, NOT via a field in the user doc. Document the CLI command Lucrezia would run to grant herself admin.

### 1.7 Deliverable for Phase 1

- Repo on GitHub, connected to Vercel, deploying successfully on every push
- `VERCEL-SETUP.md` and `.env.example` complete
- `/api/health` endpoint returning ok
- Project boots with `npm run dev`
- Design tokens visible in a `/styleguide` route (typography samples, color swatches, button variants, form elements) — this is the gut-check before building features
- `DATA-MODEL.md` and Zod schemas committed
- `firestore.rules` and `firestore.indexes.json` committed
- Firebase Admin SDK initialized server-side, client SDK initialized in a Client Component provider
- Empty page shells exist for every route in the tree
- `README.md` with setup instructions (env vars, Firebase project creation, Stripe keys)

**Do NOT start Phase 2 until I've reviewed the styleguide page (live on Vercel) and approved the design direction.**

---

## PHASE 2 — Auth + storefront skeleton

### 2.1 Firebase Auth

- Email/password + Google OAuth
- Italian-language UI (`/login` → `/registrati`)
- After signup: create the corresponding `users/{uid}` doc via a Server Action (not client-side write)
- Session management: use Firebase Auth ID tokens, set as httpOnly cookie via a Next.js Route Handler. Middleware reads the cookie and verifies via Admin SDK for protected routes.
- `middleware.ts` protects `/account/*` and `/admin/*`. `/admin/*` additionally requires `role === 'admin'` custom claim.

### 2.2 Public storefront pages (skeleton, no real data yet)

- Homepage: hero, featured products grid, brand story section, newsletter signup placeholder
- Product list page with category filter sidebar
- Product detail page: gallery, variant selector, add-to-cart, description tabs (description / shipping / returns)
- Cart page (client-side cart in Zustand or React Context + localStorage persistence; do not require login to add to cart)

### 2.3 SEO foundations

- Root `layout.tsx`: full metadata, Open Graph, Twitter card, lang="it"
- Per-page `generateMetadata` for product and category pages
- `sitemap.ts` dynamically generated from Firestore
- `robots.ts`
- JSON-LD structured data on product pages (`Product`, `Offer`, `AggregateRating` when reviews exist)
- JSON-LD on homepage (`Organization`, `WebSite` with SearchAction)
- Semantic HTML: one `<h1>` per page, proper heading hierarchy
- All images use `next/image` with explicit `alt` (pulled from `images[].alt`)
- Italian URLs: `/prodotti/`, `/categoria/`, `/carrello/`, `/chi-siamo/`

---

## PHASE 3 — Admin panel: products & categories

- `/admin` dashboard: stats placeholder (orders today, revenue this month, low stock)
- `/admin/prodotti`: data table with search, filter by status/category, bulk actions
- `/admin/prodotti/nuovo`: full product form
  - Multi-image upload to Firebase Storage with drag-to-reorder, alt text per image
  - Rich text editor for description (TipTap, configured minimal: bold/italic/lists/links — nothing else)
  - Variant builder: define option types (size, color), then auto-generate variant matrix
  - Per-variant SKU, price override, inventory
  - SEO section: meta title, meta description, OG image override
  - Status: draft / active / archived
  - All writes via Server Actions, validated with Zod
- `/admin/categorie`: tree view with drag-to-reorder, parent/child nesting

---

## PHASE 4 — Stripe checkout

- `/api/stripe/checkout` Route Handler creates a Stripe Checkout Session with:
  - line items from cart
  - shipping options pulled from `settings/general.shippingZones`
  - automatic tax via Stripe Tax (configure for Italy)
  - allowed payment methods: card, klarna, link, apple_pay, google_pay, satispay (if available in account)
  - `success_url` → `/checkout/successo?session_id={CHECKOUT_SESSION_ID}`
  - metadata: userId, cart snapshot
- `/api/stripe/webhook` handles:
  - `checkout.session.completed` → create order doc, decrement inventory atomically (Firestore transaction), send confirmation email via Resend
  - `payment_intent.payment_failed` → log, optionally notify
- Order confirmation email template (HTML, Italian-language, brand-aligned)
- `/account/ordini` lists user's orders with status and tracking

**Important:** never trust the client-sent total. Recompute line items server-side from Firestore product data before creating the Stripe session.

---

## PHASE 5 — Chat system

### Customer side: `/account/messaggi`

- Single conversation per user with Lucrezia (no multi-thread complexity yet)
- Real-time Firestore listener on `conversations/{userId}/messages` (use userId as conversationId for simplicity — one conversation per user)
- Compose box, message list with timestamps, read receipts
- On first message, create the conversation doc

### Admin side: `/admin/messaggi`

- Left pane: list of all conversations, sorted by `lastMessageAt`, unread bolded
- Right pane: selected conversation, real-time updates, compose box
- Search by customer name/email
- Mark as read when admin opens conversation

### Email notification to Lucrezia

- On every new message where `senderRole === 'customer'`, call `/api/chat/notify`
- Route Handler verifies the message was just written (via Admin SDK), then sends Resend email to Lucrezia's address (from `settings/general.shopEmail`)
- Email contains: customer name, message preview, deep link to `/admin/messaggi?conversation={id}`
- Debounce: if Lucrezia already got an email about this conversation in the last 10 minutes and hasn't opened it, don't send another (track `lastNotificationSentAt` on the conversation doc)

---

## PHASE 6 — Polish

- Loading states (Suspense boundaries + skeleton screens, not spinners)
- Empty states with personality
- Error boundaries with branded error pages
- Lighthouse audit: target 95+ on Performance, 100 on SEO and Accessibility
- Image optimization: ensure all hero/product images served in AVIF/WebP via `next/image`
- Add `next-sitemap` or verify the custom sitemap covers everything
- Cookie banner (GDPR — required in Italy), minimal and elegant, not a dark-pattern modal
- Privacy policy and Terms of Service page templates (Italian, placeholder text Lucrezia will replace)

---

## DESIGN DIRECTION (reference for every UI decision)

When in doubt, the look should evoke:
- **Aesop** (aesop.com) — quiet, ingredient-focused, generous whitespace, serif headings
- **Toteme** (toteme-studio.com) — minimal, editorial, big imagery
- **La Double J** (ladoublej.com) — Italian, playful but refined, strong typography
- **Jacquemus** (jacquemus.com) — confident, image-led

Avoid:
- Bootstrap-era card-with-shadow look
- AI-template look (gradient hero, three feature columns, testimonial carousel)
- Excessive animation. One or two considered motion moments per page, not Framer-everywhere.

---

## REPORTING BACK

After each phase, output:
1. What was built
2. What was skipped or deferred and why
3. Any architectural decisions you made that weren't in this brief
4. What I need to do before the next phase (env vars, Firebase console actions, etc.)
5. A list of files created/modified

Do not proceed to the next phase without my explicit approval.
