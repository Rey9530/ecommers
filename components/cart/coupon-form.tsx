"use client";

import * as React from "react";
import { Tag } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * En el carrito el cupón es informativo: como el carrito vive en el cliente
 * hasta el checkout, el descuento se valida y aplica al finalizar la compra
 * (ver checkout-flow → `/tienda/carrito/coupon`).
 */
export function CouponForm() {
  const [codigo, setCodigo] = React.useState("");

  function aplicar(e: React.FormEvent) {
    e.preventDefault();
    if (!codigo.trim()) return;
    toast.info("Aplica tu cupón al finalizar", {
      description: "Podrás ingresar y validar el código en el checkout.",
    });
  }

  return (
    <form onSubmit={aplicar} className="flex gap-2">
      <div className="relative flex-1">
        <Tag className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Código de descuento"
          className="pl-9"
          aria-label="Código de descuento"
        />
      </div>
      <Button type="submit" variant="outline">
        Aplicar
      </Button>
    </form>
  );
}
