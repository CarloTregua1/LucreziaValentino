"use server";

import { revalidatePath } from "next/cache";
import { adminDb } from "@/lib/firebase/admin";
import { getAdminUser, NOT_ALLOWED } from "@/lib/firebase/session";
import { getStaticPosts } from "@/lib/content/blog";
import { POSTS_COLLECTION } from "@/lib/content/posts";
import { deleteUploadedImages } from "@/lib/images";
import { postSchema, postStatusSchema, type PostInput } from "@/lib/schemas/post";
import { slugify } from "@/lib/utils";
import type { PostDoc, PostStatus } from "@/types";

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

function fail(e: unknown): { ok: false; error: string } {
  console.error("post action failed", e);
  return { ok: false, error: "Salvataggio non riuscito. Riprova." };
}

// The slug is derived once, at creation, and never changes afterwards: editing
// a title must not break a link that has already been shared.
async function uniqueSlug(title: string): Promise<string> {
  const base = slugify(title).slice(0, 80).replace(/-+$/, "") || "articolo";
  const taken = new Set(getStaticPosts().map((p) => p.slug));
  const snap = await adminDb.collection(POSTS_COLLECTION).select("slug").get();
  snap.docs.forEach((d) => taken.add(d.get("slug") as string));

  let slug = base;
  for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
  return slug;
}

function revalidate(slug: string) {
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/blog");
}

export async function createPost(
  input: PostInput,
  status: PostStatus,
): Promise<Result<{ id: string }>> {
  if (!(await getAdminUser())) return { ok: false, error: NOT_ALLOWED };

  const parsed = postSchema.safeParse(input);
  const parsedStatus = postStatusSchema.safeParse(status);
  if (!parsed.success || !parsedStatus.success) {
    return { ok: false, error: "Controlla i campi del modulo." };
  }

  try {
    const ref = adminDb.collection(POSTS_COLLECTION).doc();
    const now = new Date().toISOString();
    const doc: PostDoc = {
      ...parsed.data,
      id: ref.id,
      slug: await uniqueSlug(parsed.data.title),
      status: parsedStatus.data,
      publishedAt: parsedStatus.data === "published" ? now : null,
      createdAt: now,
      updatedAt: now,
    };
    await ref.set(doc);

    revalidate(doc.slug);
    return { ok: true, id: ref.id };
  } catch (e) {
    return fail(e);
  }
}

export async function updatePost(
  id: string,
  input: PostInput,
  status: PostStatus,
): Promise<Result> {
  if (!(await getAdminUser())) return { ok: false, error: NOT_ALLOWED };

  const parsed = postSchema.safeParse(input);
  const parsedStatus = postStatusSchema.safeParse(status);
  if (!parsed.success || !parsedStatus.success) {
    return { ok: false, error: "Controlla i campi del modulo." };
  }

  try {
    const ref = adminDb.collection(POSTS_COLLECTION).doc(id);
    const snap = await ref.get();
    if (!snap.exists) return { ok: false, error: "Articolo non trovato." };
    const current = snap.data() as PostDoc;

    const now = new Date().toISOString();
    await ref.update({
      ...parsed.data,
      status: parsedStatus.data,
      publishedAt:
        current.publishedAt ?? (parsedStatus.data === "published" ? now : null),
      updatedAt: now,
    });

    if (current.image !== parsed.data.image) {
      await deleteUploadedImages([current.image]);
    }

    revalidate(current.slug);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function setPostStatus(id: string, status: PostStatus): Promise<Result> {
  if (!(await getAdminUser())) return { ok: false, error: NOT_ALLOWED };

  const parsedStatus = postStatusSchema.safeParse(status);
  if (!parsedStatus.success) return { ok: false, error: "Stato non valido." };

  try {
    const ref = adminDb.collection(POSTS_COLLECTION).doc(id);
    const snap = await ref.get();
    if (!snap.exists) return { ok: false, error: "Articolo non trovato." };
    const current = snap.data() as PostDoc;

    const now = new Date().toISOString();
    await ref.update({
      status: parsedStatus.data,
      publishedAt:
        current.publishedAt ?? (parsedStatus.data === "published" ? now : null),
      updatedAt: now,
    });

    revalidate(current.slug);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deletePost(id: string): Promise<Result> {
  if (!(await getAdminUser())) return { ok: false, error: NOT_ALLOWED };

  try {
    const ref = adminDb.collection(POSTS_COLLECTION).doc(id);
    const snap = await ref.get();
    if (!snap.exists) return { ok: true };
    const current = snap.data() as PostDoc;

    await ref.delete();
    await deleteUploadedImages([current.image]);

    revalidate(current.slug);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}
