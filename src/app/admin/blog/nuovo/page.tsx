import type { Metadata } from "next";
import { PostForm } from "../_components/post-form";

export const metadata: Metadata = { title: "Nuovo articolo | Admin" };

export default function AdminNuovoArticoloPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-8 font-serif text-3xl text-[var(--color-foreground)] sm:mb-10">
        Nuovo articolo
      </h1>
      <PostForm />
    </div>
  );
}
