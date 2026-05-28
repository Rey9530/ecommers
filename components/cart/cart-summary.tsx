import { formatPrice } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface CartSummaryProps {
  subtotal: number; // con IVA incluido
  descuento?: number;
  costoEnvio?: number | null; // null = "a coordinar"
  children?: React.ReactNode;
}

/**
 * Resumen de importes. Los precios ya incluyen IVA (13%); el backend
 * desglosa el IVA en el pedido. Aquí mostramos el total a pagar.
 */
export function CartSummary({
  subtotal,
  descuento = 0,
  costoEnvio = 0,
  children,
}: CartSummaryProps) {
  const total = subtotal - descuento + (costoEnvio ?? 0);

  return (
    <div className="rounded-xl border bg-card p-6">
      <h2 className="text-lg font-semibold">Resumen</h2>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        {descuento > 0 && (
          <div className="flex justify-between text-success-foreground">
            <dt>Descuento</dt>
            <dd>−{formatPrice(descuento)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Envío</dt>
          <dd>
            {costoEnvio === null
              ? "A coordinar"
              : costoEnvio === 0
                ? "Gratis"
                : formatPrice(costoEnvio)}
          </dd>
        </div>
      </dl>
      <Separator className="my-4" />
      <div className="flex items-baseline justify-between">
        <span className="font-semibold">Total</span>
        <span className="text-2xl font-semibold">{formatPrice(total)}</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">IVA 13% incluido</p>
      {children && <div className="mt-5 space-y-3">{children}</div>}
    </div>
  );
}
