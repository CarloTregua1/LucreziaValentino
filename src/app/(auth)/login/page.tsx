import type { Metadata } from "next";

export const metadata: Metadata = { title: "Accedi" };

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)] px-6">
      <div className="w-full max-w-md">
        <h1 className="font-serif text-[var(--text-h2)] text-[var(--color-foreground)]">
          Accedi
        </h1>
        <p className="mt-3 text-sm text-[var(--color-muted)]">
          Non hai un account?{" "}
          <a href="/registrati" className="text-[var(--color-accent)] underline underline-offset-4">
            Registrati
          </a>
        </p>
        <div className="mt-10">
          <p className="text-[var(--color-muted)]">Form di login — in costruzione.</p>
        </div>
      </div>
    </div>
  );
}
