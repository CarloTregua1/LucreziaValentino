import { z } from "zod";

export const categorySchema = z.object({
  slug: z
    .string()
    .min(2, "Slug troppo corto")
    .regex(/^[a-z0-9-]+$/, "Solo lettere minuscole, numeri e trattini"),
  name: z.string().min(1, "Nome obbligatorio"),
  description: z.string().default(""),
  order: z.number().int().min(0).default(0),
});

export type CategoryFormValues = z.input<typeof categorySchema>;
export type CategoryInput = z.output<typeof categorySchema>;
