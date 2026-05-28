/**
 * Capa de acceso al catálogo — IMPLEMENTACIÓN MOCK.
 *
 * Cada función documenta el endpoint real del backend que la sustituirá.
 * Para conectar la API real: reemplazar el cuerpo por un `fetch` que lea
 * la respuesta bajo la clave `data` (envoltura { data, status, msg }).
 */

import type {
  CatalogoQuery,
  Paginated,
  ProductoDetalle,
  ProductoLista,
  Resena,
} from "@/types";
import { PRODUCTOS, RESENAS_DEMO } from "@/lib/mock/data";
import { categoriaSlug, getCategoriaConDescendientes } from "@/lib/categorias";

/**
 * Filtros adicionales SOLO-FRONTEND (el backend hoy solo filtra por
 * categoria/q/orden). Al integrar la API real, estos se resolverán en
 * cliente o se añadirán como query params si el backend los soporta.
 */
export interface CatalogoFiltrosUI extends CatalogoQuery {
  precioMin?: number;
  precioMax?: number;
  soloDisponibles?: boolean;
}

/** Rango de precios disponible en el catálogo (para el slider de facetas). */
export function getRangoPrecios(): { min: number; max: number } {
  const precios = PRODUCTOS.map((p) => p.precio);
  return {
    min: Math.floor(Math.min(...precios)),
    max: Math.ceil(Math.max(...precios)),
  };
}

/** Deriva la forma de listado a partir del detalle. */
export function toLista(p: ProductoDetalle): ProductoLista {
  return {
    id_catalogo: p.id_catalogo,
    slug: p.slug,
    nombre: p.nombre,
    descripcion_corta: p.descripcion_corta,
    precio: p.precio,
    precio_sin_iva: p.precio_sin_iva,
    precio_anterior: p.precio_anterior,
    es_nuevo: p.es_nuevo,
    en_stock: p.en_stock,
    imagen: p.imagenes?.[0]?.path_miniature ?? "",
    categoria: p.categoria,
  };
}

// GET /tienda/catalogo?page=&limit=&categoria=&q=&orden=
export async function getCatalogo(
  query: CatalogoFiltrosUI = {}
): Promise<Paginated<ProductoLista>> {
  const {
    page = 1,
    limit = 12,
    categoria,
    q,
    orden = "nombre",
    precioMin,
    precioMax,
    soloDisponibles,
  } = query;

  let items = PRODUCTOS.slice();

  if (categoria) {
    const ids = getCategoriaConDescendientes(categoria);
    items = items.filter((p) => ids.includes(p.categoria.id_categoria));
  }

  // Filtros solo-frontend
  if (typeof precioMin === "number")
    items = items.filter((p) => p.precio >= precioMin);
  if (typeof precioMax === "number")
    items = items.filter((p) => p.precio <= precioMax);
  if (soloDisponibles) items = items.filter((p) => p.en_stock);

  if (q && q.trim().length >= 2) {
    const term = q.trim().toLowerCase();
    items = items.filter(
      (p) =>
        p.nombre.toLowerCase().includes(term) ||
        p.descripcion_corta.toLowerCase().includes(term) ||
        p.slug.includes(term)
    );
  }

  switch (orden) {
    case "precio_asc":
      items.sort((a, b) => a.precio - b.precio);
      break;
    case "precio_desc":
      items.sort((a, b) => b.precio - a.precio);
      break;
    case "nuevos":
      items.sort(
        (a, b) => Number(b.es_nuevo ?? false) - Number(a.es_nuevo ?? false)
      );
      break;
    default:
      items.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const data = items.slice(start, start + limit).map(toLista);

  return { data, meta: { page, limit, total, totalPages } };
}

// GET /tienda/catalogo/:slug
export async function getProducto(
  slug: string
): Promise<ProductoDetalle | null> {
  return PRODUCTOS.find((p) => p.slug === slug) ?? null;
}

/** Productos relacionados (misma categoría). Frontend-only por ahora. */
export async function getRelacionados(
  producto: ProductoDetalle,
  limite = 4
): Promise<ProductoLista[]> {
  return PRODUCTOS.filter(
    (p) =>
      p.categoria.id_categoria === producto.categoria.id_categoria &&
      p.id_catalogo !== producto.id_catalogo
  )
    .slice(0, limite)
    .map(toLista);
}

/** Sugerencias de autocompletado para el buscador. */
export async function getSugerencias(
  q: string,
  limite = 6
): Promise<ProductoLista[]> {
  const term = q.trim().toLowerCase();
  if (term.length < 2) return [];
  return PRODUCTOS.filter(
    (p) =>
      p.nombre.toLowerCase().includes(term) ||
      p.categoria.nombre.toLowerCase().includes(term)
  )
    .slice(0, limite)
    .map(toLista);
}

/** Reseñas de un producto (solo-frontend; el backend no las expone aún). */
export async function getResenas(idCatalogo: number): Promise<Resena[]> {
  return RESENAS_DEMO.filter((r) => r.id_catalogo === idCatalogo);
}

/** Productos destacados para la home. */
export async function getDestacados(limite = 8): Promise<ProductoLista[]> {
  return PRODUCTOS.slice(0, limite).map(toLista);
}

/** Novedades para la home. */
export async function getNovedades(limite = 4): Promise<ProductoLista[]> {
  return PRODUCTOS.filter((p) => p.es_nuevo).slice(0, limite).map(toLista);
}

export { categoriaSlug };
