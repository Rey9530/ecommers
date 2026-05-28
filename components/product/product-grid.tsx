import { cn } from "@/lib/utils";
import type { ProductoLista } from "@/types";
import { ProductCard } from "@/components/product/product-card";

interface ProductGridProps {
  productos: ProductoLista[];
  className?: string;
}

export function ProductGrid({ productos, className }: ProductGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4",
        className
      )}
    >
      {productos.map((p, i) => (
        <ProductCard key={p.id_catalogo} producto={p} priority={i < 4} />
      ))}
    </div>
  );
}
