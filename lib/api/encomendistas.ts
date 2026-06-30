/**
 * Catálogo público de encomendistas (transportistas + sus direcciones de encomienda).
 * Consumido por el checkout. Endpoint: `GET /tienda/encomendistas` (público, sin JWT).
 */

import { api } from "@/lib/api/client";
import type { Encomendista, Paginated } from "@/types";

// GET /tienda/encomendistas
export function getEncomendistas(): Promise<Paginated<Encomendista>> {
  return api<Paginated<Encomendista>>("/tienda/encomendistas", {
    cache: "no-store",
  });
}
