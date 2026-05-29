"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PackageX } from "lucide-react";

import type { Pedido } from "@/types";
import { useAuthStore } from "@/lib/store/auth-store";
import { useOrderStore } from "@/lib/store/order-store";
import { getPedido } from "@/lib/api/pedidos";
import { OrderDetail } from "@/components/account/order-detail";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function PedidoDetallePage() {
  const params = useParams<{ numero: string }>();
  const numero = decodeURIComponent(params.numero);
  const token = useAuthStore((s) => s.token);
  const ultimo = useOrderStore((s) => s.ultimo);

  const [pedido, setPedido] = React.useState<Pedido | null>(null);
  const [cargando, setCargando] = React.useState(true);

  React.useEffect(() => {
    let cancel = false;
    getPedido(numero, { token })
      .then((p) => {
        if (!cancel) setPedido(p);
      })
      .catch(() => {
        // Fallback: pedido recién creado guardado en el store.
        if (!cancel && ultimo?.numero_pedido === numero) setPedido(ultimo);
      })
      .finally(() => {
        if (!cancel) setCargando(false);
      });
    return () => {
      cancel = true;
    };
  }, [numero, token, ultimo]);

  if (cargando) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (!pedido) {
    return (
      <EmptyState
        icon={PackageX}
        title="Pedido no encontrado"
        description={`No encontramos el pedido ${numero}.`}
      >
        <Button asChild>
          <Link href="/cuenta/pedidos">Ver mis pedidos</Link>
        </Button>
      </EmptyState>
    );
  }

  return <OrderDetail pedido={pedido} onUpdate={setPedido} />;
}
