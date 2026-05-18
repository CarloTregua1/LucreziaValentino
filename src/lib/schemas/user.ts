import { z } from "zod";

export const addressSchema = z.object({
  fullName: z.string().min(2, "Nome richiesto"),
  street: z.string().min(4, "Indirizzo richiesto"),
  city: z.string().min(2, "Città richiesta"),
  postalCode: z.string().regex(/^\d{5}$/, "CAP non valido (5 cifre)"),
  province: z.string().length(2, "Provincia non valida (2 lettere)"),
  country: z.string().default("IT"),
  phone: z.string().min(8, "Numero di telefono non valido"),
  isDefault: z.boolean().default(false),
});

export const registerSchema = z.object({
  email: z.string().email("Email non valida"),
  password: z
    .string()
    .min(8, "La password deve avere almeno 8 caratteri")
    .regex(/[A-Z]/, "Deve contenere almeno una lettera maiuscola")
    .regex(/[0-9]/, "Deve contenere almeno un numero"),
  displayName: z.string().min(2, "Nome richiesto"),
});

export const loginSchema = z.object({
  email: z.string().email("Email non valida"),
  password: z.string().min(1, "Password richiesta"),
});

export type AddressInput = z.infer<typeof addressSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
