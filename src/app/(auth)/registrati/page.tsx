"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { type FirebaseError } from "firebase/app";
import { auth } from "@/lib/firebase/client";
import { registerSchema, type RegisterInput } from "@/lib/schemas/user";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const FIREBASE_ERRORS: Record<string, string> = {
  "auth/email-already-in-use": "Esiste già un account con questa email",
  "auth/invalid-email": "Email non valida",
  "auth/too-many-requests": "Troppi tentativi. Riprova più tardi.",
};

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: RegisterInput) {
    setServerError(null);
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      await updateProfile(credential.user, { displayName: data.displayName });

      const idToken = await credential.user.getIdToken();

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, displayName: data.displayName }),
      });
      if (!res.ok) throw new Error("Registrazione non riuscita");

      router.push("/account");
    } catch (err) {
      const code = (err as FirebaseError).code ?? "";
      setServerError(FIREBASE_ERRORS[code] ?? "Registrazione non riuscita. Riprova.");
    }
  }

  async function onGoogleSignIn() {
    setServerError(null);
    try {
      const credential = await signInWithPopup(auth, new GoogleAuthProvider());
      const idToken = await credential.user.getIdToken();

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken,
          displayName: credential.user.displayName ?? credential.user.email ?? "Utente",
        }),
      });
      if (!res.ok) throw new Error();

      router.push("/account");
    } catch (err) {
      const code = (err as FirebaseError).code ?? "";
      if (code !== "auth/popup-closed-by-user") {
        setServerError(FIREBASE_ERRORS[code] ?? "Accesso con Google non riuscito.");
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)] px-6">
      <div className="w-full max-w-md">
        <Link href="/" className="font-serif text-2xl text-[var(--color-foreground)]">
          Lucrezia
        </Link>

        <h1 className="mt-8 font-serif text-[var(--text-h2)] text-[var(--color-foreground)]">
          Crea il tuo account
        </h1>
        <p className="mt-3 text-sm text-[var(--color-muted)]">
          Hai già un account?{" "}
          <Link
            href="/login"
            className="text-[var(--color-accent)] underline underline-offset-4"
          >
            Accedi
          </Link>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6">
          <Input
            label="Nome completo"
            autoComplete="name"
            placeholder="Giulia Rossi"
            error={errors.displayName?.message}
            {...register("displayName")}
          />
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="ciao@esempio.it"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            hint="Minimo 8 caratteri, una maiuscola e un numero"
            error={errors.password?.message}
            {...register("password")}
          />

          {serverError ? (
            <p className="text-sm text-[var(--color-error)]">{serverError}</p>
          ) : null}

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Crea account
          </Button>
        </form>

        <div className="mt-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-[var(--color-border)]" />
          <span className="text-xs text-[var(--color-muted)]">oppure</span>
          <div className="h-px flex-1 bg-[var(--color-border)]" />
        </div>

        <Button
          type="button"
          variant="secondary"
          className="mt-6 w-full"
          onClick={onGoogleSignIn}
        >
          Continua con Google
        </Button>
      </div>
    </div>
  );
}
