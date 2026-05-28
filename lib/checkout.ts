/**
 * Construcción del pedido (MOCK) a partir del formulario de checkout.
 * Vive fuera de los componentes para mantener la lógica impura
 * (Math.random / Date) fuera del render.
 *
 * En producción esto lo hace el backend: POST /tienda/pedidos/checkout.
 */

import type {
  Cliente,
  Direccion,
  MetodoEntrega,
  MetodoPago,
  Pedido,
  TipoDocumento,
} from "@/types";
import type { CartLine } from "@/lib/store/cart-store";

export interface CheckoutInput {
  items: CartLine[];
  subtotal: number;
  cliente: Cliente | null;
  email: string;
  telefono: string;
  tipoDoc: TipoDocumento;
  fiscalNombre: string;
  fiscalNit: string;
  fiscalNrc: string;
  fiscalGiro: string;
  entrega: MetodoEntrega;
  direccion?: Direccion;
  envNombre: string;
  envTel: string;
  envDir: string;
  envMuni: string;
  envRef: string;
  pago: MetodoPago;
  nota: string;
}

function numeroPedido(): string {
  const a = Math.random().toString(36).slice(2, 8).toUpperCase();
  const b = Math.floor(Math.random() * 900 + 100);
  return `PED-${a}-${b}`;
}

export function buildPedido(input: CheckoutInput): Pedido {
  const { items, subtotal, cliente, entrega, direccion, tipoDoc, pago } = input;

  // Los precios incluyen IVA (13%); desglosamos para el pedido.
  const total = Math.round(subtotal * 100) / 100;
  const base = Math.round((total / 1.13) * 100) / 100;
  const iva = Math.round((total - base) * 100) / 100;

  const ahora = new Date();
  const expira = new Date(ahora.getTime() + 48 * 3600 * 1000);

  const esEnvio = entrega === "ENVIO";
  const esCCF = tipoDoc === "CREDITO_FISCAL";

  return {
    id_pedido: Math.floor(Math.random() * 9000 + 1000),
    numero_pedido: numeroPedido(),
    id_cliente: cliente?.id_cliente ?? null,
    email_contacto: input.email,
    telefono_contacto: input.telefono,
    tipo_documento: tipoDoc,
    fiscal_nombre: esCCF ? input.fiscalNombre : "",
    fiscal_nit: esCCF ? input.fiscalNit : "",
    fiscal_nrc: esCCF ? input.fiscalNrc : "",
    fiscal_giro: esCCF ? input.fiscalGiro : "",
    metodo_entrega: entrega,
    envio_nombre: esEnvio ? direccion?.nombre_contacto ?? input.envNombre : "",
    envio_telefono: esEnvio ? direccion?.telefono ?? input.envTel : "",
    envio_id_municipio: direccion?.id_municipio ?? null,
    envio_direccion: esEnvio
      ? direccion?.direccion ?? [input.envDir, input.envMuni].filter(Boolean).join(", ")
      : "",
    envio_referencia: esEnvio ? direccion?.referencia ?? input.envRef : "",
    metodo_pago: pago,
    comprobante_pago_url: "",
    subtotal: base,
    descuento: 0,
    costo_envio: 0,
    iva,
    total,
    estado: "PENDIENTE_PAGO",
    id_factura: null,
    nota: input.nota,
    expira_en: expira.toISOString(),
    fecha_creacion: ahora.toISOString(),
    items: items.map((i, idx) => ({
      id_pedido_item: idx + 1,
      id_catalogo: i.id_catalogo,
      slug: i.slug,
      nombre: i.nombre,
      cantidad: i.cantidad,
      precio_unitario: i.precio_unitario,
      precio_con_iva: i.precio_unitario,
      exento_iva: false,
      subtotal: Math.round(i.precio_unitario * i.cantidad * 100) / 100,
    })),
    historial: [
      {
        id_historial: 1,
        estado: "PENDIENTE_PAGO",
        nota: "Pedido creado",
        fecha: ahora.toISOString(),
      },
    ],
  };
}
