import { Badge } from "@/components/ui/badge";
import { ESTADO_META } from "@/lib/pedidos";
import type { EstadoPedido } from "@/types";

export function OrderStatusBadge({ estado }: { estado: EstadoPedido }) {
  const meta = ESTADO_META[estado];
  return <Badge variant={meta.badge}>{meta.label}</Badge>;
}
