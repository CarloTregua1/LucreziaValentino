"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface Props {
  slug: string;
  name: string;
  price: string;
  image?: string;
  url: string;
  qrSvg: string;
}

const BUTTON =
  "inline-flex items-center justify-center border border-[var(--color-border)] px-3 py-2 text-xs tracking-wide text-[var(--color-foreground)] transition-colors hover:border-[var(--color-foreground)] disabled:opacity-40";

export function LinkCard({ slug, name, price, image, url, qrSvg }: Props) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  const message = `${name} — ${price}\nPuoi acquistarlo qui in pochi secondi, senza registrazione:\n${url}`;
  const path = new URL(url).pathname;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard API needs a secure context; fall back to a hidden textarea.
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function share() {
    try {
      await navigator.share({ title: name, text: message.replace(`\n${url}`, ""), url });
    } catch {
      // User dismissed the share sheet — nothing to do.
    }
  }

  async function downloadQr() {
    const dataUrl = await QRCode.toDataURL(url, {
      width: 1024,
      margin: 2,
      errorCorrectionLevel: "M",
    });
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `qr-${slug}.png`;
    a.click();
  }

  return (
    <div className="flex flex-col border border-[var(--color-border)] bg-[var(--color-card)] p-4">
      <div className="flex gap-4">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt=""
            className="h-16 w-16 shrink-0 object-cover"
          />
        ) : null}
        <div className="min-w-0">
          <p className="font-medium leading-snug text-[var(--color-foreground)]">{name}</p>
          <p className="mt-1 text-sm text-[var(--color-foreground)]">{price}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div
          className="h-40 w-40 shrink-0 sm:h-32 sm:w-32 border border-[var(--color-border)] bg-white p-1 [&>svg]:h-full [&>svg]:w-full"
          role="img"
          aria-label={`QR code per ${name}`}
          dangerouslySetInnerHTML={{ __html: qrSvg }}
        />
        <div className="w-full min-w-0 sm:flex-1">
          <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">Link</p>
          <p className="mt-1 break-all font-mono text-xs text-[var(--color-foreground)]">{url}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button type="button" onClick={copy} className={BUTTON}>
          {copied ? "Copiato ✓" : "Copia link"}
        </button>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={BUTTON}
        >
          WhatsApp
        </a>
        <button type="button" onClick={downloadQr} className={BUTTON}>
          Scarica QR
        </button>
        {canShare ? (
          <button type="button" onClick={share} className={BUTTON}>
            Condividi…
          </button>
        ) : (
          <a href={path} target="_blank" rel="noopener noreferrer" className={BUTTON}>
            Prova il link
          </a>
        )}
      </div>
    </div>
  );
}
