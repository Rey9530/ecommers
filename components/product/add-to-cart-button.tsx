"use client";

import { ShoppingBag, Check } from "lucide-react";
import { toast } from "sonner";

import { Button, type ButtonProps } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import type { ProductoDetalle, ProductoLista } from "@/types";

interface AddToCartButtonProps extends Omit<ButtonProps, "onClick"> {
  producto: ProductoLista | ProductoDetalle;
  cantidad?: number;
  label?: string;
  iconOnly?: boolean;
}

export function AddToCartButton({
  producto,
  cantidad = 1,
  label = "Agregar al carrito",
  iconOnly,
  ...props
}: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const agotado = !producto.en_stock;

  function handle() {
    addItem(producto, cantidad);
    toast.success("Agregado al carrito", {
      description: `${cantidad} × ${producto.nombre}`,
      icon: <Check className="size-4" />,
    });
  }

  return (
    <Button onClick={handle} disabled={agotado} {...props}>
      <ShoppingBag />
      {iconOnly ? <span className="sr-only">{label}</span> : agotado ? "Agotado" : label}
    </Button>
  );
}
