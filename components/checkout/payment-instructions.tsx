"use client";

import * as React from "react";
import { Landmark, HandCoins, Copy, Check } from "lucide-react";

import { formatPrice } from "@/lib/utils";
import type { Pedido } from "@/types";
import { Button } from "@/components/ui/button";

const BANCO = {
  banco: "Banco Agrícola",
  titular: "Bolsa Bonita, S.A. de C.V.",
  cuenta: "0123-4567-8901",
  tipo: "Cuenta corriente",
};

export function PaymentInstructions({ pedido }: { pedido: Pedido }) {
  const [copiado, setCopiado] = React.useState(false);

  function copiar() {
    navigator.clipboard?.writeText(BANCO.cuenta);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1500);
  }

  if (pedido.metodo_pago === "CONTRA_ENTREGA") {
    return (
      <div className="rounded-xl border bg-card p-5">
        <h3 className="flex items-center gap-2 font-semibold">
          <HandCoins className="size-5 text-primary" /> Pago contra entrega
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Pagarás <strong className="text-foreground">{formatPrice(pedido.total)}</strong>{" "}
          en efectivo al momento de{" "}
          {pedido.metodo_entrega === "RETIRO" ? "retirar" : "recibir"} tu pedido.
          Te contactaremos para coordinar.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-5">
      <h3 className="flex items-center gap-2 font-semibold">
        <Landmark className="size-5 text-primary" /> Datos para transferencia
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Transfiere{" "}
        <strong className="text-foreground">{formatPrice(pedido.total)}</strong> a la
        siguiente cuenta. Adjuntaste el comprobante junto con el pedido, así que
        solo queda esperar la verificación del pago.
      </p>

      <dl className="mt-4 space-y-2 rounded-lg bg-muted/40 p-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Banco</dt>
          <dd className="font-medium">{BANCO.banco}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Titular</dt>
          <dd className="font-medium">{BANCO.titular}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Tipo</dt>
          <dd className="font-medium">{BANCO.tipo}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">No. de cuenta</dt>
          <dd className="flex items-center gap-2 font-medium">
            {BANCO.cuenta}
            <button
              type="button"
              onClick={copiar}
              aria-label="Copiar número de cuenta"
              className="text-muted-foreground hover:text-foreground"
            >
              {copiado ? (
                <Check className="size-4 text-success" />
              ) : (
                <Copy className="size-4" />
              )}
            </button>
          </dd>
        </div>
        <div className="flex justify-between border-t pt-2">
          <dt className="text-muted-foreground">Referencia</dt>
          <dd className="font-medium">{pedido.numero_pedido}</dd>
        </div>
      </dl>

      <p className="mt-3 text-xs text-muted-foreground">
        Si necesitas reemplazar el comprobante, contáctanos por WhatsApp
        indicando tu número de pedido.
      </p>
    </div>
  );
}