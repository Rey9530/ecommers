"use client";

import * as React from "react";
import { Truck } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * Estimador de envío. El backend hoy usa `costo_envio = 0` (envío gratis /
 * a coordinar). UI lista para cuando exista cálculo por zona.
 */
export function ShippingEstimator() {
  const [zip, setZip] = React.useState("");
  const [resultado, setResultado] = React.useState<string | null>(null);

  function estimar(e: React.FormEvent) {
    e.preventDefault();
    if (!zip.trim()) return;
    // TODO: API — POST /tienda/checkout/shipping-methods
    setResultado("Envío gratis · entrega en 2–4 días hábiles");
  }

  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <p className="mb-2 flex items-center gap-2 text-sm font-medium">
        <Truck className="size-4 text-primary" /> Estimar envío
      </p>
      <form onSubmit={estimar} className="flex gap-2">
        <Input
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          placeholder="Código postal / municipio"
          aria-label="Código postal"
          className="bg-background"
        />
        <Button type="submit" variant="outline" size="sm">
          Calcular
        </Button>
      </form>
      {resultado && (
        <p className="mt-2 text-sm text-success-foreground">{resultado}</p>
      )}
    </div>
  );
}
