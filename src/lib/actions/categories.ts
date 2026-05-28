"use server";

import { adminDb } from "@/lib/firebase/admin";
import { categorySchema, type CategoryInput } from "@/lib/schemas/category";
import { revalidatePath } from "next/cache";
import type { CategoryDoc } from "@/types";

const COLLECTION = "categories";

export async function getCategories(): Promise<CategoryDoc[]> {
  try {
    const snap = await adminDb.collection(COLLECTION).get();
    const all = snap.docs.map((d) => d.data() as CategoryDoc);
    return all.sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return a.name.localeCompare(b.name, "it");
    });
  } catch (e) {
    console.error("getCategories failed", e);
    return [];
  }
}

export async function getCategoryById(id: string): Promise<CategoryDoc | null> {
  try {
    const doc = await adminDb.collection(COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    return doc.data() as CategoryDoc;
  } catch (e) {
    console.error("getCategoryById failed", e);
    return null;
  }
}

export async function createCategory(
  input: CategoryInput
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  try {
    const data = categorySchema.parse(input);

    const existing = await adminDb
      .collection(COLLECTION)
      .where("slug", "==", data.slug)
      .limit(1)
      .get();

    if (!existing.empty) {
      return { ok: false, error: "Slug già in uso. Scegli uno slug diverso." };
    }

    const ref = adminDb.collection(COLLECTION).doc();
    const now = new Date().toISOString();
    await ref.set({ ...data, id: ref.id, createdAt: now, updatedAt: now });

    revalidatePath("/servizi");
    revalidatePath("/admin/categorie");
    revalidatePath("/admin/servizi");

    return { ok: true, id: ref.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Errore imprevisto" };
  }
}

export async function updateCategory(
  id: string,
  input: CategoryInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const data = categorySchema.parse(input);

    const existing = await adminDb
      .collection(COLLECTION)
      .where("slug", "==", data.slug)
      .limit(1)
      .get();

    if (!existing.empty && existing.docs[0].id !== id) {
      return { ok: false, error: "Slug già in uso. Scegli uno slug diverso." };
    }

    const now = new Date().toISOString();
    await adminDb
      .collection(COLLECTION)
      .doc(id)
      .update({ ...data, updatedAt: now });

    revalidatePath("/servizi");
    revalidatePath("/admin/categorie");
    revalidatePath("/admin/servizi");

    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Errore imprevisto" };
  }
}

export async function deleteCategory(
  id: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const cat = await getCategoryById(id);
    if (!cat) return { ok: false, error: "Categoria non trovata." };

    const used = await adminDb
      .collection("servizi")
      .where("category", "==", cat.slug)
      .limit(1)
      .get();

    if (!used.empty) {
      return {
        ok: false,
        error: "Categoria in uso da uno o più servizi. Riassegnali prima di eliminarla.",
      };
    }

    await adminDb.collection(COLLECTION).doc(id).delete();

    revalidatePath("/servizi");
    revalidatePath("/admin/categorie");
    revalidatePath("/admin/servizi");

    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Errore imprevisto" };
  }
}
