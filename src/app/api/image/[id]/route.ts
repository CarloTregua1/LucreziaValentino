export const runtime = "nodejs";

import { adminDb } from "@/lib/firebase/admin";
import { IMAGES_COLLECTION } from "@/lib/images";

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: Context) {
  const { id } = await params;
  if (!/^[A-Za-z0-9]+$/.test(id)) return new Response(null, { status: 404 });

  try {
    const doc = await adminDb.collection(IMAGES_COLLECTION).doc(id).get();
    const data = doc.get("data") as Buffer | undefined;
    if (!doc.exists || !data) return new Response(null, { status: 404 });

    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": doc.get("contentType") as string,
        // An upload is never rewritten: replacing a picture creates a new id.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (e) {
    console.error("image read failed", e);
    return new Response(null, { status: 500 });
  }
}
