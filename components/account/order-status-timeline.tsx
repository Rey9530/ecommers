import { Check, X } from "lucide-react";

import { cn, formatDateTime } from "@/lib/utils";
import { ESTADOS_FLUJO, ESTADO_META } from "@/lib/pedidos";
import type { Pedido } from "@/types";

export function OrderStatusTimeline({ pedido }: { pedido: Pedido }) {
  if (pedido.estado === "CANCELADO") {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
        <span className="flex size-8 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
          <X className="size-4" />
        </span>
        <div>
          <p className="font-medium text-destructive">Pedido cancelado</p>
          <p className="text-sm text-muted-foreground">
            {ESTADO_META.CANCELADO.descripcion}
          </p>
        </div>
      </div>
    );
  }

  const actualIdx = ESTADOS_FLUJO.indexOf(pedido.estado);

  const fechaDe = (estado: string) =>
    pedido.historial.find((h) => h.estado === estado)?.fecha;

  return (
    <ol className="relative space-y-6">
      {ESTADOS_FLUJO.map((estado, i) => {
        const completado = i <= actualIdx;
        const actual = i === actualIdx;
        const fecha = fechaDe(estado);
        return (
          <li key={estado} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  completado
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground"
                )}
              >
                {completado ? <Check className="size-4" /> : i + 1}
              </span>
              {i < ESTADOS_FLUJO.length - 1 && (
                <span
                  className={cn(
                    "mt-1 w-0.5 flex-1",
                    i < actualIdx ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </div>
            <div className={cn("pb-2", !completado && "opacity-60")}>
              <p className={cn("font-medium", actual && "text-primary")}>
                {ESTADO_META[estado].label}
              </p>
              <p className="text-sm text-muted-foreground">
                {ESTADO_META[estado].descripcion}
              </p>
              {fecha && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatDateTime(fecha)}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
