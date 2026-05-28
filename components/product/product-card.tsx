import Link from "next/link";

import { cn } from "@/lib/utils";
import type { ProductoLista } from "@/types";
import { ProductThumb } from "@/components/common/product-thumb";
import { PriceDisplay } from "@/components/common/price-display";
import { StockBadge } from "@/components/product/stock-badge";
import { WishlistButton } from "@/components/product/wishlist-button";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  producto: ProductoLista;
  className?: string;
  priority?: boolean;
}

export function ProductCard({ producto, className, priority }: ProductCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link
          href={`/producto/${producto.slug}`}
          className="block size-full transition-transform duration-300 group-hover:scale-105"
          aria-label={producto.nombre}
        >
          <ProductThumb
            nombre={producto.nombre}
            seed={producto.id_catalogo}
            src={producto.imagen || undefined}
            priority={priority}
          />
        </Link>

        {/* Badges superiores */}
        <div className="pointer-events-none absolute left-2 top-2 flex flex-col gap-1">
          {producto.es_nuevo && <Badge>Nuevo</Badge>}
          {producto.precio_anterior && producto.precio_anterior > producto.precio && (
            <Badge variant="destructive">Oferta</Badge>
          )}
        </div>

        <div className="absolute right-2 top-2">
          <WishlistButton producto={producto} />
        </div>

        {!producto.en_stock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60">
            <Badge variant="muted" className="text-sm">
              Agotado
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {producto.categoria.nombre}
        </p>
        <Link
          href={`/producto/${producto.slug}`}
          className="line-clamp-2 text-sm font-medium leading-snug hover:underline"
        >
          {producto.nombre}
        </Link>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <PriceDisplay
            precio={producto.precio}
            precioAnterior={producto.precio_anterior}
            size="sm"
          />
          <StockBadge enStock={producto.en_stock} />
        </div>
        <AddToCartButton
          producto={producto}
          size="sm"
          className="mt-2 w-full"
        />
      </div>
    </div>
  );
}
