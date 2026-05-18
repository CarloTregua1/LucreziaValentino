"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/store/cart";

export function CartLink() {
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <Link
      href="/carrello"
      className="text-sm tracking-wide text-[var(--color-foreground)] transition-colors hover:text-[var(--color-accent)]"
    >
      Carrello{totalItems > 0 ? ` (${totalItems})` : ""}
    </Link>
  );
}
