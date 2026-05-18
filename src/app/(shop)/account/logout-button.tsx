"use client";

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";

export function LogoutButtonClient() {
  const router = useRouter();

  async function handleLogout() {
    await signOut(auth);
    await fetch("/api/auth/session", { method: "DELETE" });
    router.push("/");
    router.refresh();
  }

  return (
    <Button variant="ghost" onClick={handleLogout} className="text-[var(--color-muted)]">
      Esci dall&apos;account
    </Button>
  );
}
