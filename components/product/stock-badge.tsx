import { Badge } from "@/components/ui/badge";

interface StockBadgeProps {
  enStock: boolean;
  disponible?: number;
  /** Umbral para mostrar "últimas unidades". */
  umbralBajo?: number;
}

export function StockBadge({
  enStock,
  disponible,
  umbralBajo = 10,
}: StockBadgeProps) {
  if (!enStock || disponible === 0) {
    return <Badge variant="muted">Agotado</Badge>;
  }
  if (typeof disponible === "number" && disponible <= umbralBajo) {
    return <Badge variant="warning">Últimas {disponible}</Badge>;
  }
  return <Badge variant="success">Disponible</Badge>;
}
