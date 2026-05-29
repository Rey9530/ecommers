/**
 * Geo — API real (`/tienda/departamentos`, `/tienda/municipios`). Públicos.
 */

import type { Departamento, Municipio } from "@/types";
import { api } from "@/lib/api/client";

export async function getDepartamentos(): Promise<Departamento[]> {
  try {
    return await api<Departamento[]>("/tienda/departamentos", {
      next: { revalidate: 3600 },
    });
  } catch {
    return [];
  }
}

export async function getMunicipios(
  departamento?: number
): Promise<Municipio[]> {
  try {
    return await api<Municipio[]>("/tienda/municipios", {
      query: { departamento },
      next: { revalidate: 3600 },
    });
  } catch {
    return [];
  }
}
