"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProductoDetalle } from "@/types";

export function ProductTabs({ producto }: { producto: ProductoDetalle }) {
  const tieneAtributos = (producto.atributos?.length ?? 0) > 0;

  return (
    <Tabs defaultValue="descripcion" className="w-full">
      <TabsList>
        <TabsTrigger value="descripcion">Descripción</TabsTrigger>
        {tieneAtributos && (
          <TabsTrigger value="especificaciones">Especificaciones</TabsTrigger>
        )}
        <TabsTrigger value="envio">Envío</TabsTrigger>
      </TabsList>

      <TabsContent value="descripcion">
        <p className="max-w-prose text-pretty leading-relaxed text-muted-foreground">
          {producto.descripcion}
        </p>
      </TabsContent>

      {tieneAtributos && (
        <TabsContent value="especificaciones">
          <dl className="max-w-md divide-y rounded-lg border">
            {producto.atributos!.map((a) => (
              <div key={a.etiqueta} className="flex justify-between px-4 py-2.5 text-sm">
                <dt className="text-muted-foreground">{a.etiqueta}</dt>
                <dd className="font-medium">{a.valor}</dd>
              </div>
            ))}
          </dl>
        </TabsContent>
      )}

      <TabsContent value="envio">
        <div className="max-w-prose space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Realizamos envíos a todo El Salvador. También puedes elegir{" "}
            <strong className="text-foreground">retiro en tienda</strong> sin costo.
          </p>
          <p>
            El pago se realiza por <strong className="text-foreground">transferencia
            bancaria</strong> o <strong className="text-foreground">contra entrega</strong>.
            Tu pedido se prepara una vez confirmado el pago.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
