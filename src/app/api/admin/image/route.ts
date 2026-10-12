export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { getAdminUser } from "@/lib/firebase/session";
import { IMAGES_COLLECTION, uploadedImageUrl } from "@/lib/images";

// Uploads are stored as bytes in a Firestore document, which tops out at 1 MiB
// including field names. The form shrinks every picture below this before
// sending it, so the limit is only ever hit by a request made by hand.
const MAX_BYTES = 900 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(req: Request) {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const contentType = req.headers.get("content-type")?.split(";")[0] ?? "";
  if (!TYPES.includes(contentType)) {
    return NextResponse.json({ error: "Formato immagine non supportato" }, { status: 415 });
  }

  const data = Buffer.from(await req.arrayBuffer());
  if (data.length === 0 || data.length > MAX_BYTES) {
    return NextResponse.json({ error: "Immagine troppo grande" }, { status: 413 });
  }

  try {
    const ref = adminDb.collection(IMAGES_COLLECTION).doc();
    await ref.set({ data, contentType, createdAt: new Date().toISOString() });
    return NextResponse.json({ url: uploadedImageUrl(ref.id) });
  } catch (e) {
    console.error("image upload failed", e);
    return NextResponse.json({ error: "Caricamento non riuscito" }, { status: 500 });
  }
}
