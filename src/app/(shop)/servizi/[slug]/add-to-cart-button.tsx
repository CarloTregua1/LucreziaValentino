"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store/cart";

interface Props {
  slug: string;
  name: string;
  priceCents: number;
  image: string;
}

export function AddToCartButton({ slug, name, priceCents, image }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({ productId: slug, slug, name, image, priceCents, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <button
      onClick={handleAdd}
      className="w-full bg-[var(--color-foreground)] py-4 text-sm tracking-wide text-[var(--color-background)] transition-colors hover:bg-[var(--color-accent)]"
    >
      {added ? "✓ Aggiunto al carrello" : "Aggiungi al carrello"}
    </button>
  );
}
