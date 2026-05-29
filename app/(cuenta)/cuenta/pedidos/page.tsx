"use client";

import * as React from "react";
import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import { formatPrice, formatDate } from "@/lib/utils";
import type { Pedido } from "@/types";
import { useAuthStore } from "@/lib/store/auth-store";
import { getMisPedidos } from "@/lib/api/pedidos";
import { ApiError } from "@/lib/api/client";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function PedidosPage() {
  const token = useAuthStore((s) => s.token);
  const [pedidos, setPedidos] = React.useState<Pedido[]>([]);
  const [cargando, setCargando] = React.useState(true);

  React.useEffect(() => {
    if (!token) return;
    let cancel = false;
    getMisPedidos(token)
      .then((p) => {
        if (!cancel) setPedidos(p);
      })
      .catch((err) => {
        if (!cancel)
          toast.error("No se pudieron cargar tus pedidos", {
            description: err instanceof ApiError ? err.message : undefined,
          });
      })
      .finally(() => {
        if (!cancel) setCargando(false);
      });
    return () => {
      cancel = true;
    };
  }, [token]);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold">Mis pedidos</h1>

      {cargando ? (
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : pedidos.length === 0 ? (
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
