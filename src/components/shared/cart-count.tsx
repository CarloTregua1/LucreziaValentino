"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart";

export function CartLink() {
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Link
      href="/carrello"
      className="text-sm tracking-wide text-[var(--color-foreground)] transition-colors hover:text-[var(--color-accent)]"
    >
      Carrello{mounted && totalItems > 0 ? ` (${totalItems})` : ""}
    </Link>
  );
}
