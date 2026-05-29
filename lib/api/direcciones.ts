/**
 * Direcciones del cliente — API real (`/tienda/direcciones`, requiere Bearer).
 */

import type { Direccion, TipoDireccion } from "@/types";
import { api } from "@/lib/api/client";

export interface DireccionInput {
  tipo: TipoDireccion;
  nombre_contacto: string;
  telefono?: string;
  id_municipio?: number | null;
  direccion: string;
  referencia?: string;
  es_predeterminada?: boolean;
}

export function getDirecciones(token: string): Promise<Direccion[]> {
  return api<Direccion[]>("/tienda/direcciones", { token });
}

export function crearDireccion(
  token: string,
  input: DireccionInput
): Promise<Direccion> {
  return api<Direccion>("/tienda/direcciones", {
    method: "POST",
    token,
    body: input,
  });
}

export function actualizarDireccion(
  token: string,
  id: number,
  input: Partial<DireccionInput>
): Promise<Direccion> {
  return api<Direccion>(`/tienda/direcciones/${id}`, {
    method: "PATCH",
    token,
    body: input,
  });
}

export function eliminarDireccion(
  token: string,
  id: number
): Promise<{ eliminada: boolean }> {
  return api(`/tienda/direcciones/${id}`, { method: "DELETE", token });
}
