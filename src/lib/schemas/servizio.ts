import { z } from "zod";

export const servizioImageSchema = z.object({
  // Accept both absolute URLs (Firebase Storage uploads) and root-relative
  // paths (e.g. "/images/servizi/corsi-online.png" from the seed script).
  url: z
    .string()
    .refine(
      (v) => v.startsWith("/") || /^https?:\/\/.+/i.test(v),
      "URL immagine non valido",
    ),
  alt: z.string().default(""),
  order: z.number().int().min(0),
});

export const servizioSchema = z.object({
  slug: z
    .string()
    .min(2, "Slug troppo corto")
    .regex(/^[a-z0-9-]+$/, "Solo lettere minuscole, numeri e trattini"),
  name: z.string().min(1, "Nome obbligatorio"),
  shortDescription: z.string().min(1, "Descrizione breve obbligatoria"),
  description: z.string().default(""),
  type: z.enum(["consulenza", "digitale"]),
  category: z.string().min(1, "Categoria obbligatoria"),
  externalUrl: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || /^https?:\/\/.+/i.test(v),
      "Inserire un URL valido (https://…) o lasciare vuoto"
    )
    .default(""),
  priceCents: z.number().int().positive("Inserire un prezzo valido"),
  compareAtPriceCents: z.number().int().positive().optional(),
  images: z.array(servizioImageSchema).default([]),
  status: z.enum(["draft", "published"]).default("draft"),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
    })
    .default({}),
});

export type ServizioFormValues = z.input<typeof servizioSchema>;
export type ServizioInput = z.output<typeof servizioSchema>;
