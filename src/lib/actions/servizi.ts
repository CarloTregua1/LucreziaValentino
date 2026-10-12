"use server";

import { adminDb } from "@/lib/firebase/admin";
import { getAdminUser, NOT_ALLOWED } from "@/lib/firebase/session";
import { servizioSchema, type ServizioInput } from "@/lib/schemas/servizio";
import { revalidatePath } from "next/cache";
import { deleteUploadedImages } from "@/lib/images";
import type { ServizioDoc } from "@/types";

export async function getServizi(status?: "draft" | "published"): Promise<ServizioDoc[]> {
  // Drafts are for the admin panel only.
  if (status !== "published" && !(await getAdminUser())) return [];

  try {
    const snap = await adminDb.collection("servizi").get();
    const all = snap.docs.map((d) => d.data() as ServizioDoc);
    const filtered = status ? all.filter((s) => s.status === status) : all;
    return filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch (e) {
    console.error("getServizi failed", e);
    return [];
  }
}

export async function getServizioBySlug(slug: string): Promise<ServizioDoc | null> {
  try {
    const snap = await adminDb
      .collection("servizi")
      .where("slug", "==", slug)
      .limit(1)
      .get();

    if (snap.empty) return null;
    return snap.docs[0].data() as ServizioDoc;
  } catch (e) {
    console.error("getServizioBySlug failed", e);
    return null;
  }
}

export async function getServizioById(id: string): Promise<ServizioDoc | null> {
  if (!(await getAdminUser())) return null;

  try {
    const doc = await adminDb.collection("servizi").doc(id).get();
    if (!doc.exists) return null;
    return doc.data() as ServizioDoc;
  } catch (e) {
    console.error("getServizioById failed", e);
    return null;
  }
}

export async function createServizio(
  input: ServizioInput
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  if (!(await getAdminUser())) return { ok: false, error: NOT_ALLOWED };

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
  if (!(await getAdminUser())) return { ok: false, error: NOT_ALLOWED };

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

    const ref = adminDb.collection("servizi").doc(id);
    const previous = (await ref.get()).data() as ServizioDoc | undefined;

    const now = new Date().toISOString();
    await ref.update({ ...data, updatedAt: now });

    // Drop the stored bytes of any upload that was removed from the servizio.
    const kept = new Set(data.images.map((img) => img.url));
    await deleteUploadedImages(
      (previous?.images ?? []).map((img) => img.url).filter((url) => !kept.has(url)),
    );

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
  if (!(await getAdminUser())) return { ok: false, error: NOT_ALLOWED };

  try {
    const ref = adminDb.collection("servizi").doc(id);
    const previous = (await ref.get()).data() as ServizioDoc | undefined;

    await ref.delete();
    await deleteUploadedImages((previous?.images ?? []).map((img) => img.url));

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
  if (!(await getAdminUser())) return { ok: false, error: NOT_ALLOWED };

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
