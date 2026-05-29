"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { formatPrice } from "@/lib/utils";
import type { WishlistItem } from "@/lib/store/wishlist-store";
import { useWishlist } from "@/lib/hooks/use-wishlist";
import { useCartStore } from "@/lib/store/cart-store";
import { ProductThumb } from "@/components/common/product-thumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";

function toProductoLista(item: WishlistItem) {
  return {
    id_catalogo: item.id_catalogo,
    slug: item.slug,
    nombre: item.nombre,
    descripcion_corta: "",
    precio: item.precio,
    precio_sin_iva: item.precio,
    en_stock: item.en_stock,
    imagen: item.imagen,
    categoria: { id_categoria: 0, nombre: "" },
  };
}

export function WishlistGrid() {
  const { items, hydrated, toggle } = useWishlist();
  const addItem = useCartStore((s) => s.addItem);

  if (!hydrated) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-72 w-full" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="Tu lista de favoritos está vacía"
        description="Guarda los productos que más te gustan tocando el corazón."
      >
        <Button asChild>
          <Link href="/productos">Explorar productos</Link>
        </Button>
      </EmptyState>
    );
  }

  function moverAlCarrito(item: WishlistItem) {
    addItem(toProductoLista(item), 1);
    toggle(toProductoLista(item)); // quita de favoritos (estaba presente)
    toast.success("Movido al carrito", { description: item.nombre });
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.id_catalogo}
          className="flex flex-col overflow-hidden rounded-xl border bg-card"
        >
          <div className="relative aspect-square overflow-hidden bg-muted">
            <Link href={`/producto/${item.slug}`} className="block size-full">
              <ProductThumb
                nombre={item.nombre}
                seed={item.id_catalogo}
                src={item.imagen || undefined}
              />
            </Link>
            <button
              type="button"
              onClick={() => toggle(toProductoLista(item))}
              aria-label="Quitar de favoritos"
              className="absolute right-2 top-2 flex size-9 items-center justify-center rounded-full bg-background/90 text-muted-foreground shadow-sm backdrop-blur transition-colors hover:text-destructive"
            >
              <Trash2 className="size-4" />
            </button>
            {!item.en_stock && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/60">
                <Badge variant="muted">Agotado</Badge>
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-2 p-4">
            <Link
              href={`/producto/${item.slug}`}
              className="line-clamp-2 text-sm font-medium hover:underline"
            >
              {item.nombre}
            </Link>
            <span className="font-semibold">{formatPrice(item.precio)}</span>
            <Button
              size="sm"
              className="mt-auto w-full"
              disabled={!item.en_stock}
              onClick={() => moverAlCarrito(item)}
            >
              <ShoppingBag /> {item.en_stock ? "Mover al carrito" : "Agotado"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
