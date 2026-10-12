import { adminDb } from "@/lib/firebase/admin";

// Pictures uploaded from the admin panel are kept as bytes in Firestore — the
// project has no Firebase Storage bucket — and served by /api/image/[id].
export const IMAGES_COLLECTION = "images";

export function uploadedImageUrl(id: string): string {
  return `/api/image/${id}`;
}

/** The images doc id behind an upload URL, or null for any other image. */
export function uploadedImageId(url: string): string | null {
  return /^\/api\/image\/([A-Za-z0-9]+)$/.exec(url)?.[1] ?? null;
}

/** Removes the stored bytes for each URL that is an upload; others are ignored. */
export async function deleteUploadedImages(urls: Array<string | undefined>) {
  const ids = urls.map((u) => (u ? uploadedImageId(u) : null)).filter(Boolean);
  await Promise.all(
    ids.map((id) => adminDb.collection(IMAGES_COLLECTION).doc(id!).delete()),
  );
}
