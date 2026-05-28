"use client";

import * as React from "react";
import { Check, Truck, Store, RotateCcw } from "lucide-react";

import type { ProductoDetalle } from "@/types";
import { PriceDisplay } from "@/components/common/price-display";
import { StockBadge } from "@/components/product/stock-badge";
import { QuantityStepper } from "@/components/common/quantity-stepper";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { WishlistButton } from "@/components/product/wishlist-button";

export function ProductPurchase({ producto }: { producto: ProductoDetalle }) {
  const [cantidad, setCantidad] = React.useState(1);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm uppercase tracking-wide text-muted-foreground">
          {producto.categoria.nombre}
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold leading-tight">
          {producto.nombre}
        </h1>
      </div>

      <PriceDisplay
        precio={producto.precio}
        precioAnterior={producto.precio_anterior}
        size="lg"
      />
      <p className="text-sm text-muted-foreground">
        Precio con IVA incluido · {producto.exento_iva ? "Exento de IVA" : "IVA 13%"}
      </p>

      <p className="text-pretty text-muted-foreground">
        {producto.descripcion_corta}
      </p>

      <div className="flex items-center gap-3">
        <StockBadge enStock={producto.en_stock} disponible={producto.disponible} />
        {producto.en_stock && (
          <span className="text-sm text-muted-foreground">
            {producto.disponible} disponibles
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <QuantityStepper
          value={cantidad}
          onChange={setCantidad}
          max={Math.max(1, producto.disponible)}
        />
        <AddToCartButton
          producto={producto}
          cantidad={cantidad}
          size="lg"
          className="flex-1"
        />
      </div>

      <WishlistButton producto={producto} variant="full" className="w-full" />

      {/* Garantías */}
      <ul className="grid gap-3 rounded-xl border bg-card p-4 text-sm">
        {[
          { icon: Truck, text: "Envío a todo El Salvador" },
          { icon: Store, text: "Opción de retiro en tienda" },
          { icon: RotateCcw, text: "Cambios dentro de 8 días" },
          { icon: Check, text: "Pago por transferencia o contra entrega" },
        ].map((b, i) => (
          <li key={i} className="flex items-center gap-2 text-muted-foreground">
            <b.icon className="size-4 text-primary" />
            {b.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
