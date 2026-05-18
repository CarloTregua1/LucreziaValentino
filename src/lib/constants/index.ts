export const USER_ROLES = {
  CUSTOMER: "customer",
  ADMIN: "admin",
} as const;

export const PRODUCT_STATUS = {
  DRAFT: "draft",
  ACTIVE: "active",
  ARCHIVED: "archived",
} as const;

export const PRODUCT_TYPE = {
  PHYSICAL: "physical",
  DIGITAL: "digital",
} as const;

export const ORDER_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  FULFILLED: "fulfilled",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
} as const;

export const SENDER_ROLE = {
  CUSTOMER: "customer",
  ADMIN: "admin",
} as const;

export const CURRENCY = {
  EUR: "EUR",
} as const;

export const COLLECTIONS = {
  USERS: "users",
  ADDRESSES: "addresses",
  PRODUCTS: "products",
  VARIANTS: "variants",
  CATEGORIES: "categories",
  ORDERS: "orders",
  CONVERSATIONS: "conversations",
  MESSAGES: "messages",
  SETTINGS: "settings",
} as const;

export const SETTINGS_DOC_ID = "general";

export const LOCALE = {
  IT: "it",
  EN: "en",
} as const;

export const DEFAULT_LOCALE = LOCALE.IT;

export const VARIANT_OPTION_NAME = {
  SIZE: "size",
  COLOR: "color",
  MATERIAL: "material",
} as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "In attesa",
  paid: "Pagato",
  fulfilled: "Preparato",
  shipped: "Spedito",
  delivered: "Consegnato",
  cancelled: "Annullato",
  refunded: "Rimborsato",
};

export const CHAT_NOTIFICATION_COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes
