import { z } from "zod";

const orderAddressSchema = z.object({
  fullName: z.string().min(2),
  street: z.string().min(4),
  city: z.string().min(2),
  postalCode: z.string().regex(/^\d{5}$/),
  province: z.string().length(2),
  country: z.string().min(2),
  phone: z.string().min(8),
});

const orderItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().optional(),
  slug: z.string().min(1),
  name: z.string().min(1),
  image: z.string().url(),
  priceCents: z.number().int().positive(),
  quantity: z.number().int().positive(),
  subtotalCents: z.number().int().positive(),
});

export const createOrderSchema = z.object({
  userId: z.string().min(1),
  email: z.string().email(),
  items: z.array(orderItemSchema).min(1),
  subtotalCents: z.number().int().positive(),
  shippingCents: z.number().int().min(0),
  taxCents: z.number().int().min(0),
  totalCents: z.number().int().positive(),
  currency: z.literal("EUR"),
  stripeSessionId: z.string().min(1),
  stripePaymentIntentId: z.string().min(1),
  shippingAddress: orderAddressSchema,
  billingAddress: orderAddressSchema,
  shippingMethod: z.string().optional(),
});

export const checkoutCartItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().optional(),
  quantity: z.number().int().positive().max(99),
});

export const createCheckoutSessionSchema = z.object({
  items: z.array(checkoutCartItemSchema).min(1),
  userId: z.string().min(1),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CheckoutCartItem = z.infer<typeof checkoutCartItemSchema>;
export type CreateCheckoutSessionInput = z.infer<typeof createCheckoutSessionSchema>;
