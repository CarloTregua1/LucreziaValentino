"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { type FirebaseError } from "firebase/app";
import { auth } from "@/lib/firebase/client";
import { loginSchema, type LoginInput } from "@/lib/schemas/user";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const FIREBASE_ERRORS: Record<string, string> = {
  "auth/invalid-credential": "Email o password non corretti",
  "auth/user-not-found": "Nessun account con questa email",
  "auth/wrong-password": "Password non corretta",
  "auth/too-many-requests": "Troppi tentativi. Riprova più tardi.",
  "auth/user-disabled": "Account disabilitato",
};

async function createSession(idToken: string) {
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) throw new Error("Sessione non valida");
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 18 18" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72a5.41 5.41 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  );
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginInput) {
    setServerError(null);
    try {
      const credential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const idToken = await credential.user.getIdToken();
      await createSession(idToken);
      router.refresh();
      router.push(searchParams.get("from") ?? "/account");
    } catch (err) {
      const code = (err as FirebaseError).code ?? "";
      setServerError(FIREBASE_ERRORS[code] ?? "Accesso non riuscito. Riprova.");
    }
  }

  async function onGoogleSignIn() {
    setServerError(null);
    try {
      const credential = await signInWithPopup(auth, new GoogleAuthProvider());
      const idToken = await credential.user.getIdToken();
      await createSession(idToken);
      router.refresh();
      router.push(searchParams.get("from") ?? "/account");
    } catch (err) {
      const code = (err as FirebaseError).code ?? "";
      if (code !== "auth/popup-closed-by-user") {
        setServerError(FIREBASE_ERRORS[code] ?? "Accesso con Google non riuscito.");
      }
    }
  }

  return (
    <>
      <Link href="/" className="font-serif text-2xl text-[var(--color-foreground)]">
        Lucrezia
      </Link>

      <h1 className="mt-8 font-serif text-[var(--text-h2)] text-[var(--color-foreground)]">
        Accedi
      </h1>
      <p className="mt-3 text-sm text-[var(--color-muted)]">
        Non hai un account?{" "}
        <Link
          href="/registrati"
          className="text-[var(--color-accent)] underline underline-offset-4"
        >
          Registrati
        </Link>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6">
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
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        {serverError ? (
          <p className="text-sm text-[var(--color-error)]">{serverError}</p>
        ) : null}

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Accedi
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
        <GoogleIcon />
        Accedi con Google
      </Button>
    </>
  );
}
