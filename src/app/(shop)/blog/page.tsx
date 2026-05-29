import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllPosts, formatPostDate } from "@/lib/content/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articoli e approfondimenti su educazione finanziaria, credito, formazione, orientamento e microcredito — contenuti chiari, professionali e accessibili.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <div>
      {/* Header */}
      <section className="border-b border-[var(--color-border)]">
        <div className="container-xl section-spacing-sm">
          <p className="section-index">— Blog</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-12 lg:items-end">
            <h1 className="lg:col-span-7 font-serif text-[var(--text-h1)] leading-[1.02] text-[var(--color-foreground)]">
              Idee chiare su{" "}
              <span className="serif-italic text-[var(--color-accent)]">
                finanza e crescita.
              </span>
            </h1>
            <p className="lg:col-span-5 max-w-lg text-[var(--color-foreground-soft)]">
              Approfondimenti su educazione finanziaria, credito, formazione,
              orientamento e microcredito. Temi complessi, raccontati in modo
              semplice e utile.
            </p>
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured && (
        <section className="section-spacing border-b border-[var(--color-border)]">
          <div className="container-xl">
            <Link
              href={`/blog/${featured.slug}`}
              className="group grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-card-subtle)]">
                <Image
                  src={featured.image}
                  alt={featured.imageAlt}
                  fill
                  priority
                  className="object-contain p-4"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div>
                <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-[var(--color-muted)]">
                  <span className="text-[var(--color-accent)]">
                    {featured.category}
                  </span>
                  <span aria-hidden>·</span>
                  <span>{formatPostDate(featured.date)}</span>
                </div>
                <h2 className="mt-4 font-serif text-[var(--text-h2)] leading-tight text-[var(--color-foreground)]">
                  {featured.title}
                </h2>
                <p className="mt-5 max-w-xl leading-relaxed text-[var(--color-foreground-soft)]">
                  {featured.excerpt}
                </p>
                <span className="link-underline mt-8 inline-block text-sm text-[var(--color-foreground)]">
                  Leggi l&apos;articolo →
                </span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Grid */}
      {rest.length > 0 && (
        <section className="section-spacing">
          <div className="container-xl">
            <div className="grid gap-px bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col bg-[var(--color-background)] transition-colors duration-300 hover:bg-[var(--color-accent-light)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-card-subtle)]">
                    <Image
                      src={post.image}
                      alt={post.imageAlt}
                      fill
                      className="object-contain p-4"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6 sm:p-8">
                    <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-[var(--color-muted)]">
                      <span className="text-[var(--color-accent)]">
                        {post.category}
                      </span>
                      <span aria-hidden>·</span>
                      <span>{formatPostDate(post.date)}</span>
                    </div>
                    <h2 className="mt-3 font-serif text-2xl leading-tight text-[var(--color-foreground)]">
                      {post.title}
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-foreground-soft)]">
                      {post.excerpt}
                    </p>
                    <span className="mt-6 text-sm text-[var(--color-accent)] transition-transform duration-300 group-hover:translate-x-1">
                      Leggi →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
