import type { Timestamp } from "firebase/firestore";

/* ── Shared ── */

export type Locale = "it" | "en";
export type LocalizedString = { it: string; en?: string };
export type Currency = "EUR";

/* ── User ── */

export type UserRole = "customer" | "admin";

export interface UserDoc {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  defaultAddressId?: string;
  createdAt: Timestamp;
}

export interface AddressDoc {
  id: string;
  fullName: string;
  street: string;
  city: string;
  postalCode: string;
  province: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

/* ── Product ── */

export type ProductStatus = "draft" | "active" | "archived";
export type ProductType = "physical" | "digital";
export type VariantOptionName = "size" | "color" | "material";

export interface ProductImage {
  url: string;
  alt: string;
  order: number;
}

export interface VariantOption {
  name: VariantOptionName;
  values: string[];
}

export interface ProductInventory {
  tracked: boolean;
  quantity: number;
}

export interface ProductSeo {
  title?: string;
  description?: string;
  ogImage?: string;
}

export interface ProductDoc {
  id: string;
  slug: string;
  name: LocalizedString;
  description: LocalizedString;
  shortDescription: LocalizedString;
  type: ProductType;
  priceCents: number;
  compareAtPriceCents?: number;
  currency: Currency;
  images: ProductImage[];
  categoryIds: string[];
  tags: string[];
  hasVariants: boolean;
  variantOptions?: VariantOption[];
  inventory?: ProductInventory;
  weight?: number;
  status: ProductStatus;
  seo: ProductSeo;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface VariantDoc {
  id: string;
  sku: string;
  options: Partial<Record<VariantOptionName, string>>;
  priceCents: number;
  inventory: { quantity: number };
  images?: string[];
}

/* ── Category ── */

export interface CategoryDoc {
  id: string;
  slug: string;
  name: string;
  description: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

/* ── Order ── */

export type OrderStatus =
  | "pending"
  | "paid"
  | "fulfilled"
  | "cancelled"
  | "refunded";

export interface OrderItem {
  productId: string;
  slug: string;
  name: string;
  image?: string;
  priceCents: number;
  quantity: number;
  subtotalCents: number;
}

export interface OrderDoc {
  id: string;
  userId: string;
  email: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotalCents: number;
  totalCents: number;
  currency: Currency;
  stripeSessionId: string;
  stripePaymentIntentId: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/* ── Chat ── */

export type SenderRole = "customer" | "admin";

export interface ConversationDoc {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  lastMessageAt: string;
  lastMessagePreview: string;
  unreadByAdmin: boolean;
  unreadByCustomer: boolean;
  createdAt: string;
}

export interface MessageDoc {
  id: string;
  senderId: string;
  senderRole: SenderRole;
  content: string;
  createdAt: string;
  readAt?: string;
}

/* ── Settings ── */

export interface SettingsDoc {
  shopName: string;
  shopEmail: string;
  shopPhone: string;
  vatNumber: string;
  address: string;
  openingHours: string;
  responseTime: string;
  instagramUrl: string;
  linkedinUrl: string;
  heroTagline: string;
  footerTagline: string;
  updatedAt: string;
}

/* ── Servizio ── */

export type ServizioType = "consulenza" | "digitale";
export type ServizioStatus = "draft" | "published";

export interface ServizioImage {
  url: string;
  alt: string;
  order: number;
}

export interface ServizioDoc {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  type: ServizioType;
  category: string;
  externalUrl?: string;
  priceCents: number;
  compareAtPriceCents?: number;
  images: ServizioImage[];
  status: ServizioStatus;
  seo: { title?: string; description?: string };
  createdAt: string;
  updatedAt: string;
}

/* ── Cart (client-side) ── */

export interface CartItem {
  productId: string;
  variantId?: string;
  slug: string;
  name: string;
  image: string;
  priceCents: number;
  quantity: number;
}
