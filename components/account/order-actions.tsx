"use client";

import { useRouter } from "next/navigation";
import { Download, RotateCcw, XCircle } from "lucide-react";
import { toast } from "sonner";

import type { Pedido } from "@/types";
import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";

export function OrderActions({ pedido }: { pedido: Pedido }) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

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

  const puedeCancelar =
    pedido.estado === "PENDIENTE_PAGO" || pedido.estado === "PAGADO";

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={reordenar}>
        <RotateCcw /> Volver a comprar
      </Button>
      {pedido.id_factura ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            // TODO: API — descargar PDF de la factura/DTE.
            toast.info("Descarga de factura", {
              description: "La factura electrónica estará disponible pronto.",
            })
          }
        >
          <Download /> Descargar factura
        </Button>
      ) : null}
      {puedeCancelar && (
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() =>
            // TODO: API — solicitar cancelación (gestión interna del ERP).
            toast.info("Solicitud enviada", {
              description: "Revisaremos tu solicitud de cancelación.",
            })
          }
        >
          <XCircle /> Solicitar cancelación
        </Button>
      )}
    </div>
  );
}
