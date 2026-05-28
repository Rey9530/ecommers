"use client";

import Link from "next/link";
import { Trash2, AlertTriangle } from "lucide-react";

import { formatPrice } from "@/lib/utils";
import { useCartStore, type CartLine } from "@/lib/store/cart-store";
import { ProductThumb } from "@/components/common/product-thumb";
import { QuantityStepper } from "@/components/common/quantity-stepper";

export function CartLineItem({ item }: { item: CartLine }) {
  const updateCantidad = useCartStore((s) => s.updateCantidad);
  const removeItem = useCartStore((s) => s.removeItem);
  const excede = item.cantidad > item.disponible;

  return (
    <div className="flex gap-4 py-5">
      <Link
        href={`/producto/${item.slug}`}
        className="relative size-24 shrink-0 overflow-hidden rounded-lg border"
      >
        <ProductThumb
          nombre={item.nombre}
          seed={item.id_catalogo}
          src={item.imagen || undefined}
          sizes="96px"
        />
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="flex justify-between gap-4">
          <Link
            href={`/producto/${item.slug}`}
            className="font-medium leading-snug hover:underline"
          >
            {item.nombre}
          </Link>
          <span className="shrink-0 font-semibold">
            {formatPrice(item.precio_unitario * item.cantidad)}
          </span>
        </div>
        <span className="mt-0.5 text-sm text-muted-foreground">
          {formatPrice(item.precio_unitario)} c/u
        </span>

        {excede && (
          <p className="mt-1 flex items-center gap-1 text-xs text-warning-foreground">
            <AlertTriangle className="size-3.5 text-warning" />
            Solo quedan {item.disponible} en stock
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-3">
          <QuantityStepper
            size="sm"
            value={item.cantidad}
            max={Math.max(1, item.disponible)}
            onChange={(v) => updateCantidad(item.id_catalogo, v)}
          />
          <button
            type="button"
            onClick={() => removeItem(item.id_catalogo)}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-destructive"
          >
            <Trash2 className="size-4" /> Quitar
          </button>
        </div>
      </div>
    </div>
  );
}
