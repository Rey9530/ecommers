"use client";

import * as React from "react";
import Link from "next/link";
import { ShoppingBag, Trash2 } from "lucide-react";

import { formatPrice } from "@/lib/utils";
import {
  useCartStore,
  selectCantidadItems,
  selectSubtotal,
} from "@/lib/store/cart-store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { QuantityStepper } from "@/components/common/quantity-stepper";
import { ProductThumb } from "@/components/common/product-thumb";
import { EmptyState } from "@/components/common/empty-state";

export function CartButton() {
  const [open, setOpen] = React.useState(false);
  const items = useCartStore((s) => s.items);
  const hydrated = useCartStore((s) => s.hydrated);
  const updateCantidad = useCartStore((s) => s.updateCantidad);
  const removeItem = useCartStore((s) => s.removeItem);
  const cantidad = useCartStore(selectCantidadItems);
  const subtotal = useCartStore(selectSubtotal);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Abrir carrito"
        >
          <ShoppingBag className="size-5" />
          {hydrated && cantidad > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
              {cantidad}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Tu carrito {cantidad > 0 && `(${cantidad})`}</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="px-6">
            <EmptyState
              icon={ShoppingBag}
              title="Tu carrito está vacío"
              description="Agrega productos para verlos aquí."
            >
              <Button asChild onClick={() => setOpen(false)}>
                <Link href="/productos">Explorar productos</Link>
              </Button>
            </EmptyState>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto px-6">
              <ul className="divide-y">
                {items.map((item) => (
                  <li key={item.id_catalogo} className="flex gap-3 py-4">
                    <Link
                      href={`/producto/${item.slug}`}
                      onClick={() => setOpen(false)}
                      className="relative size-16 shrink-0 overflow-hidden rounded-md border"
                    >
                      <ProductThumb
                        nombre={item.nombre}
                        seed={item.id_catalogo}
                        sizes="64px"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <Link
                        href={`/producto/${item.slug}`}
                        onClick={() => setOpen(false)}
                        className="line-clamp-2 text-sm font-medium hover:underline"
                      >
                        {item.nombre}
                      </Link>
                      <span className="mt-0.5 text-sm text-muted-foreground">
                        {formatPrice(item.precio_unitario)}
                      </span>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <QuantityStepper
                          size="sm"
                          value={item.cantidad}
                          max={item.disponible}
                          onChange={(v) =>
                            updateCantidad(item.id_catalogo, v)
                          }
                        />
                        <button
                          type="button"
                          onClick={() => removeItem(item.id_catalogo)}
                          aria-label={`Quitar ${item.nombre}`}
                          className="text-muted-foreground transition-colors hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatPrice(item.precio_unitario * item.cantidad)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <SheetFooter className="border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal (IVA incl.)</span>
                <span className="text-lg font-semibold">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <Separator />
              <div className="grid gap-2">
                <Button asChild size="lg" onClick={() => setOpen(false)}>
                  <Link href="/checkout">Finalizar compra</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  <Link href="/carrito">Ver carrito</Link>
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
