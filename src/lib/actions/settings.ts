"use server";

import { adminDb } from "@/lib/firebase/admin";
import { settingsSchema, type SettingsInput } from "@/lib/schemas/settings";
import { revalidatePath } from "next/cache";
import type { SettingsDoc } from "@/types";

const COLLECTION = "settings";
const DOC_ID = "store";

const DEFAULT_SETTINGS: SettingsDoc = {
  shopName: "Lucrezia Valentino",
  shopEmail: "",
  shopPhone: "",
  vatNumber: "",
  address: "",
  openingHours: "",
  responseTime: "Risposta entro 24 ore lavorative",
  instagramUrl: "",
  linkedinUrl: "",
  heroTagline: "",
  footerTagline: "",
  updatedAt: new Date(0).toISOString(),
};

export async function getSettings(): Promise<SettingsDoc> {
  try {
    const doc = await adminDb.collection(COLLECTION).doc(DOC_ID).get();
    if (!doc.exists) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(doc.data() as Partial<SettingsDoc>) };
  } catch (e) {
    console.error("getSettings failed", e);
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(
  input: SettingsInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const data = settingsSchema.parse(input);
    const updatedAt = new Date().toISOString();

    await adminDb
      .collection(COLLECTION)
      .doc(DOC_ID)
      .set({ ...data, updatedAt }, { merge: true });

    revalidatePath("/");
    revalidatePath("/contatti");
    revalidatePath("/admin/impostazioni");

    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Errore imprevisto" };
  }
}
