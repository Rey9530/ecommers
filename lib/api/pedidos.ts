/**
 * Carrito y pedidos — API real (`/tienda/carrito`, `/tienda/pedidos`).
 *
 * Estrategia "carrito local hasta el checkout": el carrito se mantiene en el
 * cliente (cart-store) durante la navegación; al finalizar (o al aplicar un
 * cupón en el checkout) se sincroniza al backend (con `x-session-id`).
 */

import type { Carrito, CheckoutDto, Pedido } from "@/types";
import type { CartLine } from "@/lib/store/cart-store";
import { api, API_URL, ApiError } from "@/lib/api/client";

interface AuthCtx {
  token?: string | null;
  sessionId?: string | null;
}

export function vaciarCarrito(ctx: AuthCtx): Promise<Carrito> {
  return api<Carrito>("/tienda/carrito", {
    method: "DELETE",
    token: ctx.token,
    sessionId: ctx.sessionId,
  });
}

// POST /tienda/carrito/merge — fusiona ítems en el carrito del servidor.
export function mergeCarrito(
  ctx: AuthCtx,
  items: CartLine[]
): Promise<Carrito> {
  return api<Carrito>("/tienda/carrito/merge", {
    method: "POST",
    token: ctx.token,
    sessionId: ctx.sessionId,
    body: {
      items: items.map((i) => ({
        id_catalogo: i.id_catalogo,
        cantidad: i.cantidad,
      })),
    },
  });
}

/**
 * Sincroniza el carrito local con el del backend: vacía y fusiona.
 * Devuelve el carrito del servidor (con subtotal/descuento/total).
 */
export async function sincronizarCarrito(
  ctx: AuthCtx,
  items: CartLine[]
): Promise<Carrito> {
  await vaciarCarrito(ctx).catch(() => undefined);
  return mergeCarrito(ctx, items);
}

// POST /tienda/carrito/coupon
export function aplicarCupon(ctx: AuthCtx, codigo: string): Promise<Carrito> {
  return api<Carrito>("/tienda/carrito/coupon", {
    method: "POST",
    token: ctx.token,
    sessionId: ctx.sessionId,
    body: { codigo },
  });
}

// DELETE /tienda/carrito/coupon
export function quitarCupon(ctx: AuthCtx): Promise<Carrito> {
  return api<Carrito>("/tienda/carrito/coupon", {
    method: "DELETE",
    token: ctx.token,
    sessionId: ctx.sessionId,
  });
}

// POST /tienda/pedidos/checkout
export function checkout(ctx: AuthCtx, dto: CheckoutDto): Promise<Pedido> {
  return api<Pedido>("/tienda/pedidos/checkout", {
    method: "POST",
    token: ctx.token,
    sessionId: ctx.sessionId,
    body: dto,
  });
}

// GET /tienda/pedidos (Bearer)
export function getMisPedidos(token: string): Promise<Pedido[]> {
  return api<Pedido[]>("/tienda/pedidos", { token });
}

// GET /tienda/pedidos/:numero (dueño con token, o invitado con ?email=)
export function getPedido(
  numero: string,
  ctx: { token?: string | null; email?: string }
): Promise<Pedido> {
  return api<Pedido>(`/tienda/pedidos/${encodeURIComponent(numero)}`, {
    token: ctx.token,
    query: ctx.email ? { email: ctx.email } : undefined,
  });
}

// POST /tienda/pedidos/:numero/cancelacion (solo PENDIENTE_PAGO)
export function cancelarPedido(
  numero: string,
  ctx: { token?: string | null; email?: string }
): Promise<Pedido> {
  return api<Pedido>(
    `/tienda/pedidos/${encodeURIComponent(numero)}/cancelacion`,
    {
      method: "POST",
      token: ctx.token,
      query: ctx.email ? { email: ctx.email } : undefined,
    }
  );
}

// GET /tienda/pedidos/:numero/factura → { numero_pedido, pdf_base64 } (409 si no hay DTE)
export function descargarFactura(
  numero: string,
  ctx: { token?: string | null; email?: string }
): Promise<{ numero_pedido: string; pdf_base64: string }> {
  return api(`/tienda/pedidos/${encodeURIComponent(numero)}/factura`, {
    token: ctx.token,
    query: ctx.email ? { email: ctx.email } : undefined,
  });
}

/**
 * POST /tienda/pedidos/:numero/comprobante — multipart/form-data (campo `file`).
 * Usa fetch directo porque el wrapper `api()` envía JSON.
 */
export async function subirComprobante(
  numero: string,
  ctx: { token?: string | null; email?: string },
  file: File
): Promise<{ comprobante_pago_url: string }> {
  const base = API_URL.replace(/\/$/, "");
  const url = new URL(
    `${base}/tienda/pedidos/${encodeURIComponent(numero)}/comprobante`
  );
  if (ctx.email) url.searchParams.set("email", ctx.email);

  const form = new FormData();
  form.append("file", file);

  const headers: Record<string, string> = {};
  if (ctx.token) headers["Authorization"] = `Bearer ${ctx.token}`;

  let res: Response;
  try {
    res = await fetch(url.toString(), { method: "POST", headers, body: form });
  } catch {
    throw new ApiError("No se pudo conectar con el servidor.", 0);
  }
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const raw = json?.message;
    const msg = Array.isArray(raw) ? raw.join(", ") : raw ?? `Error ${res.status}`;
    throw new ApiError(msg, res.status);
  }
  return (json && "data" in json ? json.data : json) as {
    comprobante_pago_url: string;
  };
}
