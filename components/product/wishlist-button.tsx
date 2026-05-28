"use client";

import { Heart } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useWishlistStore } from "@/lib/store/wishlist-store";
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
  const items = useWishlistStore((s) => s.items);
  const toggle = useWishlistStore((s) => s.toggle);
  const activo = items.some((i) => i.id_catalogo === producto.id_catalogo);

  function handle() {
    toggle(producto);
    toast(activo ? "Quitado de favoritos" : "Agregado a favoritos", {
      description: producto.nombre,
    });
  }

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={handle}
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
      onClick={handle}
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
