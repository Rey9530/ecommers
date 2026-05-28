"use client";

import Link from "next/link";
import { ShoppingBag, ArrowRight, AlertTriangle } from "lucide-react";

import {
  useCartStore,
  selectSubtotal,
  selectCantidadItems,
} from "@/lib/store/cart-store";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { CouponForm } from "@/components/cart/coupon-form";
import { ShippingEstimator } from "@/components/cart/shipping-estimator";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function CarritoPage() {
  const items = useCartStore((s) => s.items);
  const hydrated = useCartStore((s) => s.hydrated);
  const subtotal = useCartStore(selectSubtotal);
  const cantidad = useCartStore(selectCantidadItems);
  const hayExcedidos = items.some((i) => i.cantidad > i.disponible);

  if (!hydrated) {
    return (
      <div className="container-page py-8">
        <Skeleton className="mb-6 h-9 w-48" />
        <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <h1 className="mb-6 font-display text-3xl font-semibold">
        Tu carrito{cantidad > 0 && ` (${cantidad})`}
      </h1>

      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Tu carrito está vacío"
          description="Explora nuestro catálogo y encuentra el empaque perfecto."
        >
          <Button asChild>
            <Link href="/productos">
              Explorar productos <ArrowRight />
            </Link>
          </Button>
        </EmptyState>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
          <div>
            {hayExcedidos && (
              <div className="mb-4 flex items-start gap-2 rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
                <span>
                  Algunos productos superan el stock disponible. Ajusta las
                  cantidades antes de continuar.
                </span>
              </div>
            )}
            <div className="divide-y rounded-xl border bg-card px-5">
              {items.map((item) => (
                <CartLineItem key={item.id_catalogo} item={item} />
              ))}
            </div>
            <Button asChild variant="link" className="mt-4 px-0">
              <Link href="/productos">
                ← Seguir comprando
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
            <CartSummary subtotal={subtotal}>
              <CouponForm />
              <Button
                asChild
                size="lg"
                className="w-full"
                disabled={hayExcedidos}
              >
                <Link href="/checkout">
                  Finalizar compra <ArrowRight />
                </Link>
              </Button>
            </CartSummary>
            <ShippingEstimator />
          </div>
        </div>
      )}
    </div>
  );
}
