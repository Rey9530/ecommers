/**
 * Reseñas — API real (`/tienda/catalogo/:slug/resenas`).
 */

import type { ResenasResponse } from "@/types";
import { api } from "@/lib/api/client";

const VACIO: ResenasResponse = { promedio: 0, total: 0, resenas: [] };

export async function getResenas(slug: string): Promise<ResenasResponse> {
  try {
    return await api<ResenasResponse>(
      `/tienda/catalogo/${encodeURIComponent(slug)}/resenas`,
      { next: { revalidate: 30 } }
    );
  } catch {
    return VACIO;
  }
}

export interface CrearResenaInput {
  calificacion: number; // 1..5
  comentario?: string;
}

// POST /tienda/catalogo/:slug/resenas (Bearer; requiere compra verificada)
export function crearResena(
  slug: string,
  input: CrearResenaInput,
  token: string
): Promise<{ mensaje: string }> {
  return api(`/tienda/catalogo/${encodeURIComponent(slug)}/resenas`, {
    method: "POST",
    token,
    body: input,
  });
}
