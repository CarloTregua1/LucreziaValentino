import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getServizioBySlug } from "@/lib/actions/servizi";
import { AddToCartButton } from "./add-to-cart-button";

interface Props {
  params: Promise<{ slug: string }>;
}

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=80";

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

export default async function ServizioDetailPage({ params }: Props) {
  const { slug } = await params;
  const servizio = await getServizioBySlug(slug);

  if (!servizio || servizio.status !== "published") notFound();

  const heroImage = servizio.images[0]?.url ?? PLACEHOLDER_IMAGE;
  const heroAlt = servizio.images[0]?.alt ?? servizio.name;

  return (
    <section className="section-spacing">
      <div className="container-xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Images */}
          <div className="space-y-3">
            <div className="relative aspect-square overflow-hidden bg-[var(--color-card-subtle)]">
              <Image
                src={heroImage}
                alt={heroAlt}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
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
                      className="object-cover"
                      sizes="25vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-accent)]">
              {servizio.category}
            </p>
            <h1 className="mt-3 font-serif text-[var(--text-h1)] text-[var(--color-foreground)]">
              {servizio.name}
            </h1>

            <div className="mt-4 flex items-baseline gap-3">
              <p className="text-3xl text-[var(--color-foreground)]">
                {new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(
                  servizio.priceCents / 100
                )}
              </p>
              {servizio.compareAtPriceCents && (
                <p className="text-lg text-[var(--color-muted)] line-through">
                  {new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(
                    servizio.compareAtPriceCents / 100
                  )}
                </p>
              )}
            </div>

            <p className="mt-6 leading-relaxed text-[var(--color-muted)]">
              {servizio.shortDescription}
            </p>

            <div className="mt-10">
              <AddToCartButton
                slug={servizio.slug}
                name={servizio.name}
                priceCents={servizio.priceCents}
                image={heroImage}
              />
            </div>

            {servizio.description && (
              <div className="mt-12 border-t border-[var(--color-border)] pt-8">
                <h2 className="mb-4 text-xs font-medium uppercase tracking-widest text-[var(--color-muted)]">
                  Descrizione
                </h2>
                <div
                  className="prose prose-sm max-w-none text-[var(--color-muted)] [&_strong]:text-[var(--color-foreground)] [&_ul]:list-disc [&_ul]:pl-4"
                  dangerouslySetInnerHTML={{ __html: servizio.description }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
