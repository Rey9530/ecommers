import { formatPrice } from "@/lib/utils";
import type { CartLine } from "@/lib/store/cart-store";
import { CartSummary } from "@/components/cart/cart-summary";
import { ProductThumb } from "@/components/common/product-thumb";

export function OrderSummary({
  items,
  subtotal,
  descuento = 0,
}: {
  items: CartLine[];
  subtotal: number;
  descuento?: number;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card p-5">
        <h2 className="mb-3 text-sm font-semibold">Tu pedido ({items.length})</h2>
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id_catalogo} className="flex items-center gap-3">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-md border">
                <ProductThumb
                  nombre={item.nombre}
                  seed={item.id_catalogo}
                  src={item.imagen || undefined}
                  sizes="48px"
                />
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                  {item.cantidad}
                </span>
              </div>
              <span className="line-clamp-2 flex-1 text-sm">{item.nombre}</span>
              <span className="text-sm font-medium">
                {formatPrice(item.precio_unitario * item.cantidad)}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <CartSummary subtotal={subtotal} descuento={descuento} />
    </div>
  );
}
