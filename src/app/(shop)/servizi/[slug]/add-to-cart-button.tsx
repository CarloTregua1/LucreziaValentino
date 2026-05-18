"use client";

import { useCartStore } from "@/lib/store/cart";
import { Button } from "@/components/ui/button";

interface Props {
  slug: string;
  name: string;
}

export function AddToCartButton({ slug, name }: Props) {
  const addItem = useCartStore((s) => s.addItem);

  function handleAdd() {
    addItem({
      productId: slug,
      slug,
      name,
      image: "",
      priceCents: 0,
      quantity: 1,
    });
  }

  return (
    <Button className="w-full" onClick={handleAdd}>
      Aggiungi al carrello
    </Button>
  );
}
