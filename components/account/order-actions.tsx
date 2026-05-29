"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Download, RotateCcw, XCircle } from "lucide-react";
import { toast } from "sonner";

import type { Pedido } from "@/types";
import { useCartStore } from "@/lib/store/cart-store";
import { useAuthStore } from "@/lib/store/auth-store";
import { cancelarPedido, descargarFactura } from "@/lib/api/pedidos";
import { ApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";

export function OrderActions({
  pedido,
  onUpdate,
}: {
  pedido: Pedido;
  onUpdate?: (pedido: Pedido) => void;
}) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const token = useAuthStore((s) => s.token);
  const [cargando, setCargando] = React.useState(false);

  const ctx = {
    token,
    email: token ? undefined : pedido.email_contacto,
  };

  function reordenar() {
    pedido.items.forEach((it) => {
      addItem(
        {
          id_catalogo: it.id_catalogo,
          slug: it.slug ?? "",
          nombre: it.nombre,
          precio: it.precio_unitario,
          precio_sin_iva: it.precio_unitario,
          en_stock: true,
          imagen: it.imagen ?? "",
          descripcion_corta: "",
          categoria: { id_categoria: 0, nombre: "" },
        },
        it.cantidad
      );
    });
    toast.success("Productos agregados al carrito");
    router.push("/carrito");
  }

  async function cancelar() {
    setCargando(true);
    try {
      const actualizado = await cancelarPedido(pedido.numero_pedido, ctx);
      onUpdate?.(actualizado);
      toast.success("Pedido cancelado");
    } catch (err) {
      toast.error("No se pudo cancelar", {
        description: err instanceof ApiError ? err.message : undefined,
      });
    } finally {
      setCargando(false);
    }
  }

  async function factura() {
    try {
      const { pdf_base64 } = await descargarFactura(pedido.numero_pedido, ctx);
      const bytes = Uint8Array.from(atob(pdf_base64), (c) => c.charCodeAt(0));
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${pedido.numero_pedido}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      const msg =
        err instanceof ApiError && err.status === 409
          ? "La factura aún no está disponible."
          : err instanceof ApiError
            ? err.message
            : "No se pudo descargar la factura.";
      toast.error("Factura no disponible", { description: msg });
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={reordenar}>
        <RotateCcw /> Volver a comprar
      </Button>
      {pedido.id_factura && (
        <Button variant="outline" size="sm" onClick={factura}>
          <Download /> Descargar factura
        </Button>
      )}
      {pedido.estado === "PENDIENTE_PAGO" && (
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          disabled={cargando}
          onClick={cancelar}
        >
          <XCircle /> {cargando ? "Cancelando…" : "Cancelar pedido"}
        </Button>
      )}
    </div>
  );
}
