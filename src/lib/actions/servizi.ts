"use server";

import { adminDb } from "@/lib/firebase/admin";
import { servizioSchema, type ServizioInput } from "@/lib/schemas/servizio";
import { revalidatePath } from "next/cache";
import type { ServizioDoc } from "@/types";

export async function getServizi(status?: "draft" | "published"): Promise<ServizioDoc[]> {
  let query = adminDb.collection("servizi").orderBy("createdAt", "desc");

  if (status) {
    query = query.where("status", "==", status) as typeof query;
  }

  const snap = await query.get();
  return snap.docs.map((d) => d.data() as ServizioDoc);
}

export async function getServizioBySlug(slug: string): Promise<ServizioDoc | null> {
  const snap = await adminDb
    .collection("servizi")
    .where("slug", "==", slug)
    .limit(1)
    .get();

  if (snap.empty) return null;
  return snap.docs[0].data() as ServizioDoc;
}

export async function getServizioById(id: string): Promise<ServizioDoc | null> {
  const doc = await adminDb.collection("servizi").doc(id).get();
  if (!doc.exists) return null;
  return doc.data() as ServizioDoc;
}

export async function createServizio(
  input: ServizioInput
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  try {
    const data = servizioSchema.parse(input);

    const existing = await adminDb
      .collection("servizi")
      .where("slug", "==", data.slug)
      .limit(1)
      .get();

    if (!existing.empty) {
      return { ok: false, error: "Slug già in uso. Scegli uno slug diverso." };
    }

    const ref = adminDb.collection("servizi").doc();
    const now = new Date().toISOString();

    await ref.set({ ...data, id: ref.id, createdAt: now, updatedAt: now });

    revalidatePath("/servizi");
    revalidatePath("/admin/servizi");

    return { ok: true, id: ref.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Errore imprevisto" };
  }
}

export async function updateServizio(
  id: string,
  input: ServizioInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const data = servizioSchema.parse(input);

    const existing = await adminDb
      .collection("servizi")
      .where("slug", "==", data.slug)
      .limit(1)
      .get();

    if (!existing.empty && existing.docs[0].id !== id) {
      return { ok: false, error: "Slug già in uso. Scegli uno slug diverso." };
    }

    const now = new Date().toISOString();
    await adminDb
      .collection("servizi")
      .doc(id)
      .update({ ...data, updatedAt: now });

    revalidatePath("/servizi");
    revalidatePath(`/servizi/${data.slug}`);
    revalidatePath("/admin/servizi");

    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Errore imprevisto" };
  }
}

export async function deleteServizio(
  id: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await adminDb.collection("servizi").doc(id).delete();

    revalidatePath("/servizi");
    revalidatePath("/admin/servizi");

    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Errore imprevisto" };
  }
}

export async function toggleServizioStatus(
  id: string,
  status: "draft" | "published"
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await adminDb.collection("servizi").doc(id).update({
      status,
      updatedAt: new Date().toISOString(),
    });

    revalidatePath("/servizi");
    revalidatePath("/admin/servizi");

    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Errore imprevisto" };
  }
}
