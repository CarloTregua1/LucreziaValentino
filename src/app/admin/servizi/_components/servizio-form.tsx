"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { storage } from "@/lib/firebase/client";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { servizioSchema, type ServizioFormValues, type ServizioInput } from "@/lib/schemas/servizio";
import { createServizio, updateServizio } from "@/lib/actions/servizi";
import type { CategoryDoc, ServizioDoc } from "@/types";

interface Props {
  servizio?: ServizioDoc;
  categories: CategoryDoc[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function formatPrice(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function ServizioForm({ servizio, categories }: Props) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ServizioFormValues, unknown, ServizioInput>({
    resolver: zodResolver(servizioSchema),
    defaultValues: servizio
      ? {
          slug: servizio.slug,
          name: servizio.name,
          shortDescription: servizio.shortDescription,
          description: servizio.description,
          type: servizio.type,
          category: servizio.category,
          priceCents: servizio.priceCents,
          compareAtPriceCents: servizio.compareAtPriceCents,
          images: servizio.images,
          status: servizio.status,
          seo: servizio.seo,
        }
      : {
          type: "consulenza",
          status: "draft",
          images: [],
          seo: {},
        },
  });

  const images = watch("images");
  const nameValue = watch("name");

  function handleNameBlur() {
    if (!servizio && nameValue) {
      setValue("slug", slugify(nameValue), { shouldValidate: true });
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setUploading(true);
    try {
      const uploaded = await Promise.all(
        files.map(async (file, i) => {
          const path = `servizi/temp/${Date.now()}-${i}-${file.name}`;
          const r = storageRef(storage, path);
          await uploadBytes(r, file);
          const url = await getDownloadURL(r);
          return { url, alt: file.name.replace(/\.[^.]+$/, ""), order: (images?.length ?? 0) + i };
        })
      );

      setValue("images", [...(images ?? []), ...uploaded], { shouldValidate: true });
    } catch {
      setServerError("Errore nel caricamento delle immagini.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function removeImage(idx: number) {
    setValue(
      "images",
      (images ?? []).filter((_, i) => i !== idx).map((img, i) => ({ ...img, order: i })),
      { shouldValidate: true }
    );
  }

  async function onSubmit(data: ServizioInput) {
    setServerError(null);

    const result = servizio
      ? await updateServizio(servizio.id, data)
      : await createServizio(data);

    if (!result.ok) {
      setServerError(result.error);
      return;
    }

    router.push("/admin/servizi");
    router.refresh();
  }

  const labelClass = "block text-xs font-medium uppercase tracking-widest text-[var(--color-muted)] mb-1.5";
  const inputClass =
    "w-full border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2.5 text-sm text-[var(--color-foreground)] focus:border-[var(--color-accent)] focus:outline-none";
  const errorClass = "mt-1 text-xs text-[var(--color-error)]";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      {serverError && (
        <div className="border border-[var(--color-error)] bg-red-50 px-4 py-3 text-sm text-[var(--color-error)]">
          {serverError}
        </div>
      )}

      {/* ── Basic info ── */}
      <section>
        <h2 className="mb-6 font-serif text-xl text-[var(--color-foreground)]">Informazioni base</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass}>Nome *</label>
            <input
              {...register("name")}
              onBlur={handleNameBlur}
              className={inputClass}
              placeholder="Consulenza Bonus Aziendale"
            />
            {errors.name && <p className={errorClass}>{errors.name.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Slug *</label>
            <input {...register("slug")} className={inputClass} placeholder="consulenza-bonus" />
            {errors.slug && <p className={errorClass}>{errors.slug.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Tipo *</label>
            <select {...register("type")} className={inputClass}>
              <option value="consulenza">Consulenza</option>
              <option value="digitale">Prodotto digitale</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Categoria *</label>
            {categories.length === 0 ? (
              <div className="border border-dashed border-[var(--color-border)] px-4 py-2.5 text-xs text-[var(--color-muted)]">
                Nessuna categoria.{" "}
                <a
                  href="/admin/categorie/nuova"
                  className="text-[var(--color-accent)] underline underline-offset-2"
                >
                  Creane una
                </a>{" "}
                prima di pubblicare un servizio.
              </div>
            ) : (
              <select {...register("category")} className={inputClass}>
                <option value="">— seleziona —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
            {errors.category && <p className={errorClass}>{errors.category.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Stato</label>
            <select {...register("status")} className={inputClass}>
              <option value="draft">Bozza</option>
              <option value="published">Pubblicato</option>
            </select>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section>
        <h2 className="mb-6 font-serif text-xl text-[var(--color-foreground)]">Prezzo</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Prezzo (€) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className={inputClass}
              placeholder="300.00"
              onChange={(e) =>
                setValue("priceCents", Math.round(parseFloat(e.target.value || "0") * 100), {
                  shouldValidate: true,
                })
              }
              defaultValue={servizio ? formatPrice(servizio.priceCents) : ""}
            />
            {errors.priceCents && <p className={errorClass}>{errors.priceCents.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Prezzo barrato (€)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className={inputClass}
              placeholder="Opzionale"
              onChange={(e) => {
                const v = parseFloat(e.target.value || "0");
                setValue("compareAtPriceCents", v > 0 ? Math.round(v * 100) : undefined);
              }}
              defaultValue={
                servizio?.compareAtPriceCents ? formatPrice(servizio.compareAtPriceCents) : ""
              }
            />
          </div>
        </div>
      </section>

      {/* ── Descriptions ── */}
      <section>
        <h2 className="mb-6 font-serif text-xl text-[var(--color-foreground)]">Testi</h2>
        <div className="space-y-6">
          <div>
            <label className={labelClass}>Descrizione breve *</label>
            <textarea
              {...register("shortDescription")}
              rows={2}
              className={inputClass}
              placeholder="Una riga che riassume il servizio per le anteprime."
            />
            {errors.shortDescription && (
              <p className={errorClass}>{errors.shortDescription.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Descrizione completa</label>
            <textarea
              {...register("description")}
              rows={8}
              className={inputClass}
              placeholder="Descrizione dettagliata. Puoi usare HTML semplice (<p>, <ul>, <strong>, ecc.)."
            />
          </div>
        </div>
      </section>

      {/* ── Images ── */}
      <section>
        <h2 className="mb-6 font-serif text-xl text-[var(--color-foreground)]">Immagini</h2>

        {(images ?? []).length > 0 && (
          <div className="mb-4 flex flex-wrap gap-3">
            {(images ?? []).map((img, idx) => (
              <div key={idx} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.alt}
                  className="h-24 w-24 border border-[var(--color-border)] object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-error)] text-xs text-white"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="flex cursor-pointer items-center gap-3 border border-dashed border-[var(--color-border)] px-6 py-8 text-sm text-[var(--color-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
            disabled={uploading}
          />
          {uploading ? "Caricamento…" : "+ Carica immagini"}
        </label>
      </section>

      {/* ── SEO ── */}
      <section>
        <h2 className="mb-6 font-serif text-xl text-[var(--color-foreground)]">SEO</h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Titolo SEO</label>
            <input
              {...register("seo.title")}
              className={inputClass}
              placeholder="Lascia vuoto per usare il nome del servizio"
            />
          </div>
          <div>
            <label className={labelClass}>Meta description</label>
            <textarea
              {...register("seo.description")}
              rows={2}
              className={inputClass}
              placeholder="Lascia vuoto per usare la descrizione breve"
            />
          </div>
        </div>
      </section>

      {/* ── Actions ── */}
      <div className="flex items-center gap-4 border-t border-[var(--color-border)] pt-8">
        <button
          type="submit"
          disabled={isSubmitting || uploading}
          className="bg-[var(--color-foreground)] px-8 py-3 text-sm text-[var(--color-background)] transition-colors hover:bg-[var(--color-accent)] disabled:opacity-50"
        >
          {isSubmitting ? "Salvataggio…" : servizio ? "Aggiorna servizio" : "Crea servizio"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/servizi")}
          className="px-6 py-3 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
        >
          Annulla
        </button>
      </div>
    </form>
  );
}
