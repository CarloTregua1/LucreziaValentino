import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServizioBySlug } from "@/lib/actions/servizi";
import { AddToCartButton } from "./add-to-cart-button";

interface Props {
  params: Promise<{ slug: string }>;
}

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=90";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const servizio = await getServizioBySlug(slug);

  if (!servizio) return { title: "Servizio non trovato" };

  return {
    title: servizio.seo.title ?? servizio.name,
    description: servizio.seo.description ?? servizio.shortDescription,
    openGraph: {
      title: servizio.seo.title ?? servizio.name,
      description: servizio.seo.description ?? servizio.shortDescription,
      images: servizio.images[0]?.url ? [{ url: servizio.images[0].url }] : [],
    },
  };
}

const HIGHLIGHTS = [
  { label: "Prima call", value: "Gratuita" },
  { label: "Risposta", value: "Entro 24h" },
  { label: "Pagamento", value: "Sicuro · Stripe" },
];

const EXTERNAL_HIGHLIGHTS = [
  { label: "Formato", value: "100% online" },
  { label: "Accesso", value: "Immediato" },
  { label: "Contenuti", value: "Aggiornati" },
];

export default async function ServizioDetailPage({ params }: Props) {
  const { slug } = await params;
  const servizio = await getServizioBySlug(slug);

  if (!servizio || servizio.status !== "published") notFound();

  const heroImage = servizio.images[0]?.url ?? PLACEHOLDER_IMAGE;
  const heroAlt = servizio.images[0]?.alt ?? servizio.name;
  const isExternal = Boolean(servizio.externalUrl);
  const formatPrice = (cents: number) =>
    new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(cents / 100);

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="border-b border-[var(--color-border)]">
        <div className="container-xl flex items-center gap-2 py-4 text-xs uppercase tracking-widest text-[var(--color-muted)]">
          <Link
            href="/"
            className="link-underline hover:text-[var(--color-foreground)]"
          >
            Home
          </Link>
          <span aria-hidden>/</span>
          <Link
            href="/servizi"
            className="link-underline hover:text-[var(--color-foreground)]"
          >
            Servizi
          </Link>
          <span aria-hidden>/</span>
          <span className="text-[var(--color-foreground)] normal-case tracking-normal">
            {servizio.name}
          </span>
        </div>
      </div>

      <section className="section-spacing">
        <div className="container-xl">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Images */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-card-subtle)]">
                <Image
                  src={heroImage}
                  alt={heroAlt}
                  fill
                  priority
                  className="object-contain p-6"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
              </div>
              {servizio.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {servizio.images.slice(1).map((img, i) => (
                    <div
                      key={i}
                      className="relative aspect-square overflow-hidden bg-[var(--color-card-subtle)]"
                    >
                      <Image
                        src={img.url}
                        alt={img.alt}
                        fill
                        className="object-contain p-2"
                        sizes="15vw"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-24">
                <p className="eyebrow">{servizio.category}</p>
                <h1 className="mt-3 font-serif text-[var(--text-h1)] leading-[1.05] text-[var(--color-foreground)]">
                  {servizio.name}
                </h1>

                <p className="mt-6 leading-relaxed text-[var(--color-foreground-soft)]">
                  {servizio.shortDescription}
                </p>

                {isExternal ? (
                  <div className="mt-8">
                    <a
                      href={servizio.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-[var(--color-foreground)] py-4 text-center text-sm tracking-wide text-[var(--color-background)] transition-colors hover:bg-[var(--color-accent)]"
                    >
                      {servizio.type === "digitale" &&
                      servizio.category.toLowerCase().includes("ebook")
                        ? "Acquista l'ebook →"
                        : "Vai al corso →"}
                    </a>
                    <p className="mt-3 text-xs text-[var(--color-muted)]">
                      Acquisto e accesso gestiti sulla piattaforma esterna.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mt-8 flex items-baseline gap-4">
                      <p className="font-serif text-4xl leading-none text-[var(--color-foreground)] sm:text-5xl">
                        {formatPrice(servizio.priceCents)}
                      </p>
                      {servizio.compareAtPriceCents && (
                        <p className="text-lg text-[var(--color-muted)] line-through">
                          {formatPrice(servizio.compareAtPriceCents)}
                        </p>
                      )}
                    </div>

                    <div className="mt-8">
                      <AddToCartButton
                        slug={servizio.slug}
                        name={servizio.name}
                        priceCents={servizio.priceCents}
                        image={heroImage}
                      />
                    </div>
                  </>
                )}

                {/* Highlights */}
                <ul className="mt-8 grid grid-cols-3 gap-px border border-[var(--color-border)] bg-[var(--color-border)]">
                  {(isExternal ? EXTERNAL_HIGHLIGHTS : HIGHLIGHTS).map((h) => (
                    <li
                      key={h.label}
                      className="bg-[var(--color-background)] px-3 py-4 text-center"
                    >
                      <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">
                        {h.label}
                      </p>
                      <p className="mt-1 text-sm font-medium text-[var(--color-foreground)]">
                        {h.value}
                      </p>
                    </li>
                  ))}
                </ul>

                {servizio.description && (
                  <div className="mt-12 border-t border-[var(--color-border)] pt-8">
                    <p className="eyebrow-muted">Dettagli del servizio</p>
                    <div
                      className="mt-4 max-w-none leading-relaxed text-[var(--color-foreground-soft)] [&_strong]:text-[var(--color-foreground)] [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_p]:mt-3 [&_h3]:mt-8 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:text-[var(--color-foreground)] [&_h4]:mt-7 [&_h4]:font-medium [&_h4]:text-[var(--color-foreground)]"
                      dangerouslySetInnerHTML={{ __html: servizio.description }}
                    />
                  </div>
                )}

                <div className="mt-10 border-t border-[var(--color-border)] pt-6 text-sm text-[var(--color-foreground-soft)]">
                  <p>
                    Dubbi prima di procedere?{" "}
                    <Link
                      href="/account/messaggi"
                      className="link-underline text-[var(--color-foreground)]"
                    >
                      Scrivimi
                    </Link>
                    , ti rispondo personalmente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
