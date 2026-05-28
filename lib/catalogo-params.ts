import type { CatalogoFiltrosUI } from "@/lib/api/catalogo";
import type { OrdenCatalogo } from "@/types";

export type RawSearchParams = Record<string, string | string[] | undefined>;

const ORDENES: OrdenCatalogo[] = [
  "nombre",
  "precio_asc",
  "precio_desc",
  "nuevos",
];

/** Convierte los searchParams crudos de la URL en filtros para `getCatalogo`. */
export function parseFiltros(sp: RawSearchParams): CatalogoFiltrosUI {
  const get = (k: string) => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const orden = get("orden") as OrdenCatalogo | undefined;
  const precioMin = get("precioMin");
  const precioMax = get("precioMax");

  return {
    page: Math.max(1, Number(get("page")) || 1),
    limit: 12,
    q: get("q") || undefined,
    orden: orden && ORDENES.includes(orden) ? orden : "nombre",
    precioMin: precioMin ? Number(precioMin) : undefined,
    precioMax: precioMax ? Number(precioMax) : undefined,
    soloDisponibles: get("disp") === "1",
  };
}
