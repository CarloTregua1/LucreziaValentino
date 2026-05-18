# Firestore Data Model — Lucrezia Shop

All monetary values are stored in **euro cents (integers)** — never floats.
All text fields that will be shown to users are **i18n-ready** (`{ it: string, en?: string }`).

---

## `users/{uid}`

```
uid:              string   — Firebase Auth UID (= document ID)
email:            string
displayName:      string
role:             'customer' | 'admin'   — mirrors Firebase Auth custom claim
phone?:           string
defaultAddressId?: string
createdAt:        Timestamp
```

### `users/{uid}/addresses/{addressId}`

```
fullName:   string
street:     string
city:       string
postalCode: string   — 5-digit Italian CAP
province:   string   — 2-letter Italian province code (e.g. "MI", "RM")
country:    string   — ISO 3166-1 alpha-2 (default "IT")
phone:      string
isDefault:  boolean
```

---

## `products/{productId}`

```
slug:                 string   — unique, URL-safe, Italian (e.g. "camicia-lino-bianca")
name:                 { it, en? }
description:          { it, en? }   — rich text (HTML string from TipTap)
shortDescription:     { it, en? }   — plain text, used in cards/meta
type:                 'physical' | 'digital'
priceCents:           number   — base price in EUR cents
compareAtPriceCents?: number   — original price for "was X, now Y" display
currency:             'EUR'
images:               Array<{ url: string, alt: string, order: number }>
categoryIds:          string[]
tags:                 string[]
hasVariants:          boolean
variantOptions?:      Array<{ name: 'size'|'color'|'material', values: string[] }>
inventory?:           { tracked: boolean, quantity: number }   — for products without variants
weight?:              number   — grams, used for shipping calculation
status:               'draft' | 'active' | 'archived'
seo:                  { title?, description?, ogImage? }
createdAt:            Timestamp
updatedAt:            Timestamp
```

### `products/{productId}/variants/{variantId}`

```
sku:       string   — unique stock-keeping unit
options:   { size?: string, color?: string, material?: string }
priceCents: number   — overrides base product price if present
inventory: { quantity: number }
images?:   string[]   — variant-specific image URLs
```

---

## `categories/{categoryId}`

```
slug:        string   — unique, URL-safe
name:        { it, en? }
description: { it, en? }
parentId?:   string   — for nested categories
order:       number   — display sort order
image?:      string   — category cover image URL
seo:         { title?, description?, ogImage? }
```

---

## `orders/{orderId}`

```
userId:               string
email:                string   — guest checkout ready
status:               'pending' | 'paid' | 'fulfilled' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
items:                Array<{
  productId:    string
  variantId?:   string
  slug:         string
  name:         string        — denormalized at time of purchase
  image:        string        — denormalized
  priceCents:   number        — price at time of purchase
  quantity:     number
  subtotalCents: number
}>
subtotalCents:        number
shippingCents:        number
taxCents:             number
totalCents:           number
currency:             'EUR'
stripeSessionId:      string
stripePaymentIntentId: string
shippingAddress:      { fullName, street, city, postalCode, province, country, phone }
billingAddress:       { fullName, street, city, postalCode, province, country, phone }
shippingMethod?:      string
trackingNumber?:      string
notes?:               string
createdAt:            Timestamp
updatedAt:            Timestamp
```

---

## `conversations/{conversationId}`

One conversation per user. Use `userId` as the document ID for easy lookups.

```
userId:              string
userEmail:           string
userName:            string
lastMessageAt:       Timestamp
lastMessagePreview:  string   — first 100 chars of last message
unreadByAdmin:       boolean
unreadByCustomer:    boolean
lastNotificationSentAt?: Timestamp   — debounce email notifications
createdAt:           Timestamp
```

### `conversations/{conversationId}/messages/{messageId}`

```
senderId:   string   — Firebase Auth UID or 'admin'
senderRole: 'customer' | 'admin'
content:    string
createdAt:  Timestamp
readAt?:    Timestamp
```

---

## `settings/general` (singleton)

```
shopName:                  string
shopEmail:                 string
shopPhone:                 string
shippingZones:             Array<{
  name:      string
  countries: string[]   — ISO 3166-1 alpha-2 codes
  methods:   Array<{ name: string, priceCents: number, etaDays: number }>
}>
freeShippingThresholdCents?: number
vatNumber:                 string   — Italian P.IVA
returnsPolicy:             { it, en? }
shippingPolicy:            { it, en? }
```

---

## Firestore indexes

See `firestore.indexes.json` for the composite index definitions required by:

- `products` filtered by `status == 'active'` ordered by `createdAt desc`
- `products` filtered by `categoryIds array-contains` + `status == 'active'` ordered by `createdAt desc`
- `products` filtered by `tags array-contains` + `status == 'active'` ordered by `createdAt desc`
- `orders` filtered by `userId` ordered by `createdAt desc`
- `conversations` ordered by `lastMessageAt desc`
