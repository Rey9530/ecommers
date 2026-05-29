"use client";

import { Heart } from "lucide-react";

import { cn } from "@/lib/utils";
import { useWishlist } from "@/lib/hooks/use-wishlist";
import type { ProductoDetalle, ProductoLista } from "@/types";

interface WishlistButtonProps {
  producto: ProductoLista | ProductoDetalle;
  variant?: "icon" | "full";
  className?: string;
}

export function WishlistButton({
  producto,
  variant = "icon",
  className,
}: WishlistButtonProps) {
  const { has, toggle } = useWishlist();
  const activo = has(producto.id_catalogo);

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={() => toggle(producto)}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent",
          activo && "border-primary/40 text-primary",
          className
        )}
      >
        <Heart className={cn("size-4", activo && "fill-primary")} />
        {activo ? "En favoritos" : "Agregar a favoritos"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => toggle(producto)}
      aria-label={activo ? "Quitar de favoritos" : "Agregar a favoritos"}
      aria-pressed={activo}
      className={cn(
        "flex size-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background",
        className
      )}
    >
      <Heart
        className={cn(
          "size-4 transition-colors",
          activo ? "fill-primary text-primary" : "text-muted-foreground"
        )}
      />
    </button>
  );
}
