"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PackageX } from "lucide-react";

import { PEDIDOS_DEMO } from "@/lib/mock/data";
import { useOrderStore } from "@/lib/store/order-store";
import { OrderDetail } from "@/components/account/order-detail";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function PedidoDetallePage() {
  const params = useParams<{ numero: string }>();
  const numero = decodeURIComponent(params.numero);
  const ultimo = useOrderStore((s) => s.ultimo);
  const hydrated = useOrderStore((s) => s.hydrated);

  const pedido =
    PEDIDOS_DEMO.find((p) => p.numero_pedido === numero) ??
    (ultimo?.numero_pedido === numero ? ultimo : null);

  if (!hydrated && !PEDIDOS_DEMO.some((p) => p.numero_pedido === numero)) {
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

  return <OrderDetail pedido={pedido} />;
}
