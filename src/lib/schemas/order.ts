import { z } from "zod";

const orderItemSchema = z.object({
  productId: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  image: z.string().url().optional(),
  priceCents: z.number().int().positive(),
  quantity: z.number().int().positive(),
  subtotalCents: z.number().int().positive(),
});

export const createOrderSchema = z.object({
  userId: z.string().min(1),
  email: z.string().email(),
  items: z.array(orderItemSchema).min(1),
  subtotalCents: z.number().int().positive(),
  totalCents: z.number().int().positive(),
  currency: z.literal("EUR"),
  stripeSessionId: z.string().min(1),
  stripePaymentIntentId: z.string().min(1),
});

export const checkoutCartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive().max(99),
});

export const createCheckoutSessionSchema = z.object({
  items: z.array(checkoutCartItemSchema).min(1),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CheckoutCartItem = z.infer<typeof checkoutCartItemSchema>;
export type CreateCheckoutSessionInput = z.infer<typeof createCheckoutSessionSchema>;
