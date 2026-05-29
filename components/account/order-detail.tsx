import Link from "next/link";
import { ArrowLeft, MapPin, CreditCard, FileText } from "lucide-react";

import { formatPrice, formatDate } from "@/lib/utils";
import {
  METODO_ENTREGA_LABEL,
  METODO_PAGO_LABEL,
  TIPO_DOCUMENTO_LABEL,
} from "@/lib/pedidos";
import type { Pedido } from "@/types";
import { Separator } from "@/components/ui/separator";
import { ProductThumb } from "@/components/common/product-thumb";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { OrderStatusTimeline } from "@/components/account/order-status-timeline";
import { OrderActions } from "@/components/account/order-actions";

function InfoCard({
  icon: Icon,
  titulo,
  children,
}: {
  icon: typeof MapPin;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <Icon className="size-4 text-primary" /> {titulo}
      </h3>
      <div className="text-sm text-muted-foreground">{children}</div>
    </div>
  );
}

export function OrderDetail({
  pedido,
  onUpdate,
}: {
  pedido: Pedido;
  onUpdate?: (pedido: Pedido) => void;
}) {
  return (
    <div>
      <Link
        href="/cuenta/pedidos"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Volver a pedidos
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">
            {pedido.numero_pedido}
          </h1>
          <p className="text-sm text-muted-foreground">
            Realizado el {formatDate(pedido.fecha_creacion)}
          </p>
        </div>
        <OrderStatusBadge estado={pedido.estado} />
      </div>

      <div className="mt-4">
        <OrderActions pedido={pedido} onUpdate={onUpdate} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_18rem]">
        <div className="space-y-6">
          {/* Items */}
          <div className="rounded-xl border bg-card">
            <ul className="divide-y px-4">
              {pedido.items.map((it) => (
                <li key={it.id_pedido_item} className="flex gap-4 py-4">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border">
                    <ProductThumb
                      nombre={it.nombre}
                      seed={it.id_catalogo}
                      src={it.imagen || undefined}
                      sizes="64px"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    {it.slug ? (
                      <Link
                        href={`/producto/${it.slug}`}
                        className="font-medium hover:underline"
                      >
                        {it.nombre}
                      </Link>
                    ) : (
                      <span className="font-medium">{it.nombre}</span>
                    )}
                    <span className="text-sm text-muted-foreground">
                      {it.cantidad} × {formatPrice(it.precio_unitario)}
                    </span>
                  </div>
                  <span className="font-semibold">{formatPrice(it.subtotal)}</span>
                </li>
              ))}
            </ul>
            <Separator />
            <div className="space-y-1 p-4 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatPrice(pedido.subtotal + pedido.iva)}</span>
              </div>
              {pedido.descuento > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Descuento</span>
                  <span>−{formatPrice(pedido.descuento)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Envío</span>
                <span>
                  {pedido.costo_envio === 0 ? "Gratis" : formatPrice(pedido.costo_envio)}
                </span>
              </div>
              <div className="flex justify-between pt-1 text-base font-semibold">
                <span>Total</span>
                <span>{formatPrice(pedido.total)}</span>
              </div>
            </div>
          </div>

          {/* Datos */}
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoCard icon={MapPin} titulo={METODO_ENTREGA_LABEL[pedido.metodo_entrega]}>
              {pedido.metodo_entrega === "ENVIO" ? (
                <>
                  <p className="font-medium text-foreground">{pedido.envio_nombre}</p>
                  <p>{pedido.envio_telefono}</p>
                  <p>{pedido.envio_direccion}</p>
                  {pedido.envio_referencia && <p>Ref: {pedido.envio_referencia}</p>}
                </>
              ) : (
                <p>Retiro en tienda — Av. Las Magnolias #100, San Salvador.</p>
              )}
            </InfoCard>

            <InfoCard icon={CreditCard} titulo="Pago">
              <p className="font-medium text-foreground">
                {METODO_PAGO_LABEL[pedido.metodo_pago]}
              </p>
              <p>{TIPO_DOCUMENTO_LABEL[pedido.tipo_documento]}</p>
              {pedido.tipo_documento === "CREDITO_FISCAL" && (
                <>
                  <p className="mt-1">{pedido.fiscal_nombre}</p>
                  <p>NIT: {pedido.fiscal_nit}</p>
                  <p>NRC: {pedido.fiscal_nrc}</p>
                </>
              )}
            </InfoCard>
          </div>

          {pedido.nota && (
            <InfoCard icon={FileText} titulo="Nota">
              {pedido.nota}
            </InfoCard>
          )}
        </div>

        {/* Seguimiento */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-xl border bg-card p-5">
            <h2 className="mb-4 font-semibold">Seguimiento</h2>
            <OrderStatusTimeline pedido={pedido} />
          </div>
        </div>
      </div>
    </div>
  );
}
