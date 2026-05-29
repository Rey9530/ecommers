/**
 * Favoritos — API real (`/tienda/favoritos`, requiere Bearer).
 * Devuelve productos de listado (no solo ids).
 */

import type { ProductoLista } from "@/types";
import { api } from "@/lib/api/client";

export function getFavoritos(token: string): Promise<ProductoLista[]> {
  return api<ProductoLista[]>("/tienda/favoritos", { token });
}

export function agregarFavorito(
  token: string,
  idCatalogo: number
): Promise<{ agregado: boolean }> {
  return api("/tienda/favoritos", {
    method: "POST",
    token,
    body: { id_catalogo: idCatalogo },
  });
}

export function quitarFavorito(
  token: string,
  idCatalogo: number
): Promise<{ eliminado: boolean }> {
  return api(`/tienda/favoritos/${idCatalogo}`, { method: "DELETE", token });
}
