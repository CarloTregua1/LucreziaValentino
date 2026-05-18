# Lucrezia Shop

E-commerce website for Lucrezia — Italian fashion, built on Next.js 15, Firebase, and Stripe.

## Tech stack

- **Framework:** Next.js 15+ (App Router)
- **Styling:** Tailwind CSS v4 + custom design tokens
- **Auth:** Firebase Auth (email/password + Google OAuth)
- **Database:** Firestore
- **Storage:** Firebase Storage
- **Payments:** Stripe Checkout
- **Email:** Resend
- **Hosting:** Vercel

## Getting started

### 1. Clone and install

```bash
git clone <repo-url>
cd LucreziaValentino
npm install
```

### 2. Environment variables

Copy the example and fill in your values:

```bash
cp .env.example .env.local
```

See `VERCEL-SETUP.md` for where to get each value.

### 3. Firebase project

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** → Email/Password + Google
3. Enable **Firestore** (production mode)
4. Enable **Storage**
5. Create a **Web App** → copy the config into `.env.local`
6. Generate a **Service Account** key → paste into `.env.local`

### 4. Deploy Firestore rules and indexes

```bash
npm install -g firebase-tools
firebase login
firebase use <your-project-id>
firebase deploy --only firestore:rules,firestore:indexes
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Check the design system at [http://localhost:3000/styleguide](http://localhost:3000/styleguide).

## Project structure

```
src/
├── app/
│   ├── (shop)/          # public storefront
│   ├── (auth)/          # login, registrati
│   ├── admin/           # admin panel (role-protected)
│   ├── api/             # route handlers
│   └── styleguide/      # design system reference
├── components/
│   ├── ui/              # Button, Input, Card, etc.
│   ├── shop/            # storefront components
│   ├── admin/           # admin components
│   └── shared/          # Nav, Footer
├── lib/
│   ├── firebase/        # client + admin SDK
│   ├── stripe/          # Stripe client
│   ├── email/           # Resend
│   ├── schemas/         # Zod validation schemas
│   ├── constants/       # enums, config
│   └── utils/           # cn(), formatCents(), slugify()
└── types/               # TypeScript interfaces
```

## Grant admin access

After Lucrezia creates her account, run once:

```typescript
// In a temporary script or Firebase Cloud Shell
import { adminAuth } from "@/lib/firebase/admin";
await adminAuth.setCustomUserClaims("<lucrezia-uid>", { role: "admin" });
```

## Deployment

See `VERCEL-SETUP.md` for the full Vercel setup guide.

Health check: `GET /api/health`
