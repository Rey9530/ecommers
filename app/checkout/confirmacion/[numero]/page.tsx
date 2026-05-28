"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2, Package, Clock } from "lucide-react";

import { formatPrice, formatDateTime } from "@/lib/utils";
import { useOrderStore } from "@/lib/store/order-store";
import { METODO_ENTREGA_LABEL } from "@/lib/pedidos";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/common/empty-state";
import { PaymentInstructions } from "@/components/checkout/payment-instructions";

export default function ConfirmacionPage() {
  const params = useParams<{ numero: string }>();
  const numero = params.numero;
  const ultimo = useOrderStore((s) => s.ultimo);
  const hydrated = useOrderStore((s) => s.hydrated);

  if (!hydrated) {
    return (
      <div className="container-page py-12">
        <Skeleton className="mx-auto h-64 w-full max-w-2xl" />
      </div>
    );
  }

  if (!ultimo || ultimo.numero_pedido !== numero) {
    return (
      <div className="container-page py-12">
        <EmptyState
          icon={Package}
          title="No encontramos este pedido"
          description="Es posible que el enlace haya expirado. Consulta el estado en tu cuenta."
        >
          <Button asChild>
            <Link href="/cuenta/pedidos">Ver mis pedidos</Link>
          </Button>
        </EmptyState>
      </div>
    );
  }

  const pedido = ultimo;

  return (
    <div className="container-page max-w-2xl py-12">
      <div className="text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="size-9" />
        </span>
        <h1 className="mt-4 font-display text-3xl font-semibold">
          ¡Pedido confirmado!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Gracias por tu compra. Tu número de pedido es:
        </p>
        <p className="mt-1 text-lg font-semibold tracking-wide">
          {pedido.numero_pedido}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-warning/10 px-4 py-2 text-sm text-warning-foreground">
        <Clock className="size-4 text-warning" />
        Reservamos tu stock hasta el{" "}
        {pedido.expira_en && formatDateTime(pedido.expira_en)}
      </div>

      {/* Instrucciones de pago */}
      <div className="mt-6">
        <PaymentInstructions pedido={pedido} />
      </div>

      {/* Resumen */}
      <div className="mt-6 rounded-xl border bg-card p-5">
        <h2 className="font-semibold">Resumen del pedido</h2>
        <ul className="mt-3 divide-y text-sm">
          {pedido.items.map((it) => (
            <li key={it.id_pedido_item} className="flex justify-between py-2">
              <span>
                {it.cantidad} × {it.nombre}
              </span>
              <span className="font-medium">{formatPrice(it.subtotal)}</span>
            </li>
          ))}
        </ul>
        <Separator className="my-3" />
        <div className="space-y-1 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal (sin IVA)</span>
            <span>{formatPrice(pedido.subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>IVA (13%)</span>
            <span>{formatPrice(pedido.iva)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>{METODO_ENTREGA_LABEL[pedido.metodo_entrega]}</span>
            <span>{pedido.costo_envio === 0 ? "Gratis" : formatPrice(pedido.costo_envio)}</span>
          </div>
          <div className="flex justify-between pt-1 text-base font-semibold">
            <span>Total</span>
            <span>{formatPrice(pedido.total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Button asChild variant="outline" className="flex-1">
          <Link href={`/cuenta/pedidos/${pedido.numero_pedido}`}>
            Seguir mi pedido
          </Link>
        </Button>
        <Button asChild className="flex-1">
          <Link href="/productos">Seguir comprando</Link>
        </Button>
      </div>
    </div>
  );
}
