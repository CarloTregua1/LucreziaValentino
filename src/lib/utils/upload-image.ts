import { compressImage } from "./compress-image";

/** Shrinks a picture in the browser, stores it, and returns its site-relative URL. */
export async function uploadImage(file: File): Promise<string> {
  const blob = await compressImage(file);
  const res = await fetch("/api/admin/image", {
    method: "POST",
    headers: { "Content-Type": blob.type },
    body: blob,
  });
  if (!res.ok) throw new Error(`image upload failed: ${res.status}`);
  const { url } = (await res.json()) as { url: string };
  return url;
}
