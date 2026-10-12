import { z } from "zod";

export const postSchema = z.object({
  title: z.string().trim().min(1, "Titolo obbligatorio").max(160, "Massimo 160 caratteri"),
  subtitle: z
    .string()
    .trim()
    .min(1, "Sottotitolo obbligatorio")
    .max(300, "Massimo 300 caratteri"),
  // Site-relative: either an upload served by /api/image or a file in public/.
  image: z
    .string()
    .min(1, "Aggiungi un'immagine")
    .refine((v) => v.startsWith("/") && !v.startsWith("//"), "Immagine non valida"),
  content: z.string().trim().min(1, "Scrivi il contenuto dell'articolo"),
});

export const postStatusSchema = z.enum(["draft", "published"]);

export type PostInput = z.infer<typeof postSchema>;
