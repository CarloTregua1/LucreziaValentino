import type { Metadata } from "next";
import Link from "next/link";
import QRCode from "qrcode";
import { getServizi } from "@/lib/actions/servizi";
import { isLinkPurchasable } from "@/lib/stripe/link-checkout";
import { shareUrl } from "@/lib/app-url";
import { formatCents } from "@/lib/utils";
import { LinkCard } from "./_components/link-card";

export const metadata: Metadata = { title: "Link di vendita | Admin" };
export const dynamic = "force-dynamic";

export default async function AdminLinkVenditaPage() {
  const servizi = (await getServizi("published")).filter(isLinkPurchasable);
  const base = shareUrl();

  const cards = await Promise.all(
    servizi.map(async (s) => {
      const url = `${base}/acquista/${s.slug}`;
      const qrSvg = await QRCode.toString(url, {
        type: "svg",
        margin: 1,
        errorCorrectionLevel: "M",
        color: { dark: "#1a1a1a", light: "#ffffff" },
      });
      return {
        slug: s.slug,
        name: s.name,
        price: formatCents(s.priceCents),
        image: s.images[0]?.url,
        url,
        qrSvg,
      };
    }),
  );

  return (
    <div>
      <h1 className="font-serif text-3xl text-[var(--color-foreground)]">Link di vendita</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--color-muted)]">
        Invia a un cliente il link o il QR code di un servizio: lo porta direttamente al
        pagamento, senza registrazione né accesso. L&apos;ordine compare in{" "}
        <Link href="/admin/ordini" className="underline underline-offset-2">
          Ordini
        </Link>{" "}
        e Stripe invia la ricevuta all&apos;email inserita dal cliente.
      </p>
      <p className="mt-2 max-w-2xl text-xs leading-relaxed text-[var(--color-muted)]">
        Il prezzo è sempre quello attuale del servizio: puoi cambiarlo senza rifare i QR già
        stampati. Cambiare lo <em>slug</em> di un servizio invece disattiva i suoi link.
        Compaiono solo i servizi pubblicati che si pagano sul sito.
      </p>

      {cards.length === 0 ? (
        <div className="mt-12 border border-[var(--color-border)] bg-[var(--color-card)] p-12 text-center">
          <p className="text-[var(--color-muted)]">Nessun servizio pubblicato acquistabile sul sito.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
          {cards.map((c) => (
            <LinkCard key={c.slug} {...c} />
          ))}
        </div>
      )}
    </div>
  );
}
