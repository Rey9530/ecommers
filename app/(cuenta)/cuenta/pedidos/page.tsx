import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";

import { formatPrice, formatDate } from "@/lib/utils";
import { PEDIDOS_DEMO } from "@/lib/mock/data";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";

export default function PedidosPage() {
  const pedidos = PEDIDOS_DEMO;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold">Mis pedidos</h1>

      {pedidos.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Aún no tienes pedidos"
          description="Cuando compres, tus pedidos aparecerán aquí."
        >
          <Button asChild>
            <Link href="/productos">Explorar productos</Link>
          </Button>
        </EmptyState>
      ) : (
        <div className="space-y-4">
          {pedidos.map((p) => (
            <Link
              key={p.id_pedido}
              href={`/cuenta/pedidos/${p.numero_pedido}`}
              className="group flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-4 transition-shadow hover:shadow-md"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{p.numero_pedido}</p>
                  <OrderStatusBadge estado={p.estado} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatDate(p.fecha_creacion)} · {p.items.length} artículo(s)
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold">{formatPrice(p.total)}</span>
                <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
