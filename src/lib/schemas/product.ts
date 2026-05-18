import { z } from "zod";

const localizedStringSchema = z.object({
  it: z.string().min(1, "Il campo in italiano è obbligatorio"),
  en: z.string().optional(),
});

export const productImageSchema = z.object({
  url: z.string().url(),
  alt: z.string().min(1),
  order: z.number().int().min(0),
});

export const variantOptionSchema = z.object({
  name: z.enum(["size", "color", "material"]),
  values: z.array(z.string().min(1)).min(1),
});

export const productSchema = z.object({
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug deve contenere solo lettere minuscole, numeri e trattini"),
  name: localizedStringSchema,
  description: localizedStringSchema,
  shortDescription: localizedStringSchema,
  type: z.enum(["physical", "digital"]),
  priceCents: z.number().int().positive("Il prezzo deve essere positivo"),
  compareAtPriceCents: z.number().int().positive().optional(),
  currency: z.literal("EUR"),
  images: z.array(productImageSchema).min(1, "Almeno un'immagine richiesta"),
  categoryIds: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  hasVariants: z.boolean().default(false),
  variantOptions: z.array(variantOptionSchema).optional(),
  inventory: z
    .object({
      tracked: z.boolean(),
      quantity: z.number().int().min(0),
    })
    .optional(),
  weight: z.number().positive().optional(),
  status: z.enum(["draft", "active", "archived"]),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      ogImage: z.string().url().optional(),
    })
    .default({}),
});

export const variantSchema = z.object({
  sku: z.string().min(1, "SKU richiesto"),
  options: z.record(z.string(), z.string()),
  priceCents: z.number().int().positive(),
  inventory: z.object({
    quantity: z.number().int().min(0),
  }),
  images: z.array(z.string().url()).optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
export type VariantInput = z.infer<typeof variantSchema>;
