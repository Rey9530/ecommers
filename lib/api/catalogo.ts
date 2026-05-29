/**
 * Acceso al catálogo — API real (`/tienda/catalogo`).
 *
 * Filtros soportados: `page, limit, categoria, q, orden, precio_min, precio_max, en_stock`.
 * Los items traen `precio_anterior`, `en_oferta`, `es_nuevo`, `calificacion_promedio`, `total_resenas`.
 * Las funciones de listado son resilientes: devuelven vacío si el backend falla.
 */

import type {
  CatalogoQuery,
  Paginated,
  ProductoDetalle,
  ProductoLista,
  Sugerencia,
} from "@/types";
import { api, ApiError } from "@/lib/api/client";
import { categoriaSlug } from "@/lib/categorias";

const PAGINADO_VACIO: Paginated<ProductoLista> = {
  data: [],
  meta: { page: 1, limit: 12, total: 0, totalPages: 1 },
};

// GET /tienda/catalogo?page=&limit=&categoria=&q=&orden=&precio_min=&precio_max=&en_stock=
export async function getCatalogo(
  query: CatalogoQuery = {}
): Promise<Paginated<ProductoLista>> {
  try {
    return await api<Paginated<ProductoLista>>("/tienda/catalogo", {
      query: {
        page: query.page,
        limit: query.limit,
        categoria: query.categoria,
        q: query.q,
        orden: query.orden,
        precio_min: query.precioMin,
        precio_max: query.precioMax,
        en_stock: query.soloDisponibles ? "true" : undefined,
      },
      next: { revalidate: 30 },
    });
  } catch {
    return PAGINADO_VACIO;
  }
}

// GET /tienda/catalogo/:slug
export async function getProducto(
  slug: string
): Promise<ProductoDetalle | null> {
  try {
    return await api<ProductoDetalle>(
      `/tienda/catalogo/${encodeURIComponent(slug)}`,
      { next: { revalidate: 30 } }
    );
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    return null;
  }
}

// GET /tienda/catalogo/:slug/relacionados
export async function getRelacionados(slug: string): Promise<ProductoLista[]> {
  try {
    return await api<ProductoLista[]>(
      `/tienda/catalogo/${encodeURIComponent(slug)}/relacionados`,
      { next: { revalidate: 60 } }
    );
  } catch {
    return [];
  }
}

// GET /tienda/catalogo/sugerencias?q=
export async function getSugerencias(q: string): Promise<Sugerencia[]> {
  const term = q.trim();
  if (term.length < 2) return [];
  try {
    return await api<Sugerencia[]>("/tienda/catalogo/sugerencias", {
      query: { q: term },
    });
  } catch {
    return [];
  }
}

/** Destacados para la home (primera página del catálogo). */
export async function getDestacados(limite = 8): Promise<ProductoLista[]> {
  const res = await getCatalogo({ limit: limite });
  return res.data;
}

/** Novedades para la home (orden = nuevos). */
export async function getNovedades(limite = 4): Promise<ProductoLista[]> {
  const res = await getCatalogo({ orden: "nuevos", limit: limite });
  return res.data;
}

/** Rango de precios para el slider (deriva el máximo del producto más caro). */
export async function getRangoPrecios(): Promise<{ min: number; max: number }> {
  const res = await getCatalogo({ orden: "precio_desc", limit: 1 });
  const max = res.data[0]?.precio;
  return { min: 0, max: max ? Math.ceil(max) : 100 };
}

export { categoriaSlug };
