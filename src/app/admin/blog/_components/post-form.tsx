"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema, type PostInput } from "@/lib/schemas/post";
import { createPost, updatePost } from "@/lib/actions/posts";
import type { PostDoc, PostStatus } from "@/types";
import { uploadImage } from "@/lib/utils/upload-image";

interface Props {
  post?: PostDoc;
}

export function PostForm({ post }: Props) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState<PostStatus | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: post
      ? {
          title: post.title,
          subtitle: post.subtitle,
          image: post.image,
          content: post.content,
        }
      : { title: "", subtitle: "", image: "", content: "" },
  });

  const image = watch("image");
  const isPublished = post?.status === "published";
  const busy = uploading || saving !== null;

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setServerError(null);
    setUploading(true);
    try {
      setValue("image", await uploadImage(file), { shouldValidate: true });
    } catch (err) {
      console.error(err);
      setServerError(
        "Caricamento dell'immagine non riuscito. Riprova, oppure scegli un file JPG o PNG.",
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function save(status: PostStatus) {
    return handleSubmit(async (data) => {
      setServerError(null);
      setSaving(status);
      const result = post
        ? await updatePost(post.id, data, status)
        : await createPost(data, status);

      if (!result.ok) {
        setServerError(result.error);
        setSaving(null);
        return;
      }

      router.push("/admin/blog");
      router.refresh();
    });
  }

  const labelClass =
    "block text-xs font-medium uppercase tracking-widest text-[var(--color-muted)] mb-1.5";
  // 16px on phones: iOS zooms the whole page into any field with smaller text.
  const inputClass =
    "w-full border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 text-base text-[var(--color-foreground)] focus:border-[var(--color-accent)] focus:outline-none sm:py-2.5 sm:text-sm";
  const errorClass = "mt-1 text-xs text-[var(--color-error)]";
  const hintClass = "mt-1.5 text-xs text-[var(--color-muted)]";

  return (
    <form onSubmit={save("published")} className="space-y-8">
      {serverError && (
        <div className="border border-[var(--color-error)] bg-red-50 px-4 py-3 text-sm text-[var(--color-error)]">
          {serverError}
        </div>
      )}

      <div>
        <label htmlFor="post-title" className={labelClass}>
          Titolo *
        </label>
        <input
          id="post-title"
          {...register("title")}
          className={inputClass}
          placeholder="Il titolo dell'articolo"
        />
        {errors.title && <p className={errorClass}>{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="post-subtitle" className={labelClass}>
          Sottotitolo *
        </label>
        <textarea
          id="post-subtitle"
          {...register("subtitle")}
          rows={3}
          className={inputClass}
          placeholder="Una o due frasi che riassumono l'articolo"
        />
        {errors.subtitle && <p className={errorClass}>{errors.subtitle.message}</p>}
        <p className={hintClass}>
          Compare sotto il titolo e nell&apos;anteprima dell&apos;articolo nella pagina Blog.
        </p>
      </div>

      <div>
        <span className={labelClass}>Immagine *</span>

        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt=""
            className="mb-3 aspect-[16/9] w-full border border-[var(--color-border)] bg-[var(--color-card-subtle)] object-contain"
          />
        )}

        <label
          className={`flex cursor-pointer items-center justify-center border border-dashed border-[var(--color-border)] px-6 text-center text-sm text-[var(--color-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] ${
            image ? "py-4" : "py-10"
          } ${uploading ? "pointer-events-none opacity-60" : ""}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleImageChange}
            disabled={uploading}
          />
          {uploading
            ? "Caricamento…"
            : image
              ? "Sostituisci immagine"
              : "+ Scegli un'immagine"}
        </label>
        {errors.image && <p className={errorClass}>{errors.image.message}</p>}
      </div>

      <div>
        <label htmlFor="post-content" className={labelClass}>
          Contenuto *
        </label>
        <textarea
          id="post-content"
          {...register("content")}
          rows={16}
          className={`${inputClass} leading-relaxed`}
          placeholder="Scrivi qui il testo dell'articolo."
        />
        {errors.content && <p className={errorClass}>{errors.content.message}</p>}
        <p className={hintClass}>
          Lascia una riga vuota per iniziare un nuovo paragrafo.
        </p>
      </div>

      <div className="flex flex-col gap-3 border-t border-[var(--color-border)] pt-8 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={busy}
          className="bg-[var(--color-foreground)] px-8 py-3.5 text-sm text-[var(--color-background)] transition-colors hover:bg-[var(--color-accent)] disabled:opacity-50 sm:py-3"
        >
          {saving === "published"
            ? "Salvataggio…"
            : isPublished
              ? "Salva modifiche"
              : "Pubblica"}
        </button>
        <button
          type="button"
          onClick={save("draft")}
          disabled={busy}
          className="border border-[var(--color-border)] px-8 py-3.5 text-sm text-[var(--color-foreground)] transition-colors hover:border-[var(--color-accent)] disabled:opacity-50 sm:py-3"
        >
          {saving === "draft"
            ? "Salvataggio…"
            : isPublished
              ? "Riporta in bozza"
              : "Salva come bozza"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/blog")}
          disabled={busy}
          className="px-6 py-3 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)] disabled:opacity-50"
        >
          Annulla
        </button>
      </div>
    </form>
  );
}
