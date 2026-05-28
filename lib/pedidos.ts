import type {
  EstadoPedido,
  MetodoEntrega,
  MetodoPago,
  TipoDocumento,
} from "@/types";

/** Flujo lineal de estados (para la línea de tiempo de seguimiento). */
export const ESTADOS_FLUJO: EstadoPedido[] = [
  "PENDIENTE_PAGO",
  "PAGADO",
  "PREPARANDO",
  "ENVIADO",
  "ENTREGADO",
];

type EstadoBadge = "warning" | "default" | "secondary" | "success" | "destructive";

export const ESTADO_META: Record<
  EstadoPedido,
  { label: string; descripcion: string; badge: EstadoBadge }
> = {
  PENDIENTE_PAGO: {
    label: "Pendiente de pago",
    descripcion: "Esperando confirmación del pago.",
    badge: "warning",
  },
  PAGADO: {
    label: "Pagado",
    descripcion: "Recibimos tu pago.",
    badge: "default",
  },
  PREPARANDO: {
    label: "Preparando",
    descripcion: "Estamos preparando tu pedido.",
    badge: "secondary",
  },
  ENVIADO: {
    label: "Enviado",
    descripcion: "Tu pedido va en camino.",
    badge: "default",
  },
  ENTREGADO: {
    label: "Entregado",
    descripcion: "Pedido entregado. ¡Gracias!",
    badge: "success",
  },
  CANCELADO: {
    label: "Cancelado",
    descripcion: "Este pedido fue cancelado.",
    badge: "destructive",
  },
};

export const METODO_PAGO_LABEL: Record<MetodoPago, string> = {
  TRANSFERENCIA: "Transferencia bancaria",
  CONTRA_ENTREGA: "Pago contra entrega",
};

export const METODO_ENTREGA_LABEL: Record<MetodoEntrega, string> = {
  ENVIO: "Envío a domicilio",
  RETIRO: "Retiro en tienda",
};

export const TIPO_DOCUMENTO_LABEL: Record<TipoDocumento, string> = {
  CONSUMIDOR_FINAL: "Consumidor final",
  CREDITO_FISCAL: "Crédito fiscal (CCF)",
};
