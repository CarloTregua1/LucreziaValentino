import { z } from "zod";

const urlOrEmpty = z
  .string()
  .trim()
  .refine(
    (v) => v === "" || /^https?:\/\/.+/i.test(v),
    "Inserire un URL valido (https://…) o lasciare vuoto"
  );

export const settingsSchema = z.object({
  shopName: z.string().min(1, "Nome obbligatorio"),
  shopEmail: z.string().email("Email non valida"),
  shopPhone: z.string().default(""),
  vatNumber: z.string().default(""),
  address: z.string().default(""),
  openingHours: z.string().default(""),
  responseTime: z.string().default(""),
  instagramUrl: urlOrEmpty.default(""),
  linkedinUrl: urlOrEmpty.default(""),
  heroTagline: z.string().default(""),
  footerTagline: z.string().default(""),
});

export type SettingsFormValues = z.input<typeof settingsSchema>;
export type SettingsInput = z.output<typeof settingsSchema>;
