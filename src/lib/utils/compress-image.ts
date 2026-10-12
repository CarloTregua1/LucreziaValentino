// Phone photos are routinely 4–12 MB; the upload endpoint takes well under 1 MB
// (see /api/admin/image). Shrinking in the browser also means the upload
// is quick on a mobile connection.
const TARGET_BYTES = 700 * 1024;

function toJpeg(source: CanvasImageSource, w: number, h: number, quality: number) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas unavailable");
  // JPEG has no alpha: without this a transparent PNG comes out black.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(source, 0, 0, w, h);
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("encoding failed"))),
      "image/jpeg",
      quality,
    ),
  );
}

export async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  try {
    let maxSide = 1600;
    let quality = 0.82;
    for (;;) {
      const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
      const blob = await toJpeg(
        bitmap,
        Math.max(1, Math.round(bitmap.width * scale)),
        Math.max(1, Math.round(bitmap.height * scale)),
        quality,
      );
      if (blob.size <= TARGET_BYTES || maxSide <= 640) return blob;
      if (quality > 0.65) quality -= 0.1;
      else maxSide = Math.round(maxSide * 0.8);
    }
  } finally {
    bitmap.close();
  }
}
