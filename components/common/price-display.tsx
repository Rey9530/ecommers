import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";

interface PriceDisplayProps {
  precio: number;
  precioAnterior?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

/** Muestra el precio (con IVA), el precio anterior tachado y el ahorro si hay oferta. */
export function PriceDisplay({
  precio,
  precioAnterior,
  className,
  size = "md",
}: PriceDisplayProps) {
  const enOferta = !!precioAnterior && precioAnterior > precio;
  const ahorro = enOferta ? precioAnterior! - precio : 0;
  const pct = enOferta ? Math.round((ahorro / precioAnterior!) * 100) : 0;

  const sizes = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-3xl",
  } as const;

  return (
    <div className={cn("flex flex-wrap items-baseline gap-2", className)}>
      <span className={cn("font-semibold text-foreground", sizes[size])}>
        {formatPrice(precio)}
      </span>
      {enOferta && (
        <>
          <span className="text-sm text-muted-foreground line-through">
            {formatPrice(precioAnterior!)}
          </span>
          <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
            -{pct}%
          </span>
        </>
      )}
    </div>
  );
}
