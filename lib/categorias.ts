import type { Categoria, CategoriaArbol } from "@/types";
import { slugify } from "@/lib/utils";
import { api } from "@/lib/api/client";

/** Slug derivado del nombre (el backend no expone slug de categoría). */
export function categoriaSlug(c: Pick<Categoria, "nombre">): string {
  return slugify(c.nombre);
}

// GET /tienda/catalogo/categorias — lista plana. Resiliente: [] si el backend falla.
export async function getCategorias(): Promise<Categoria[]> {
  try {
    return await api<Categoria[]>("/tienda/catalogo/categorias", {
      next: { revalidate: 300 },
    });
  } catch {
    return [];
  }
}

/** Arma el árbol jerárquico a partir de la lista plana. */
export function buildCategoriaTree(categorias: Categoria[]): CategoriaArbol[] {
  const map = new Map<number, CategoriaArbol>();
  categorias.forEach((c) => map.set(c.id_categoria, { ...c, hijos: [] }));
  const roots: CategoriaArbol[] = [];
  map.forEach((node) => {
    if (node.id_categoria_padre && map.has(node.id_categoria_padre)) {
      map.get(node.id_categoria_padre)!.hijos.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}

export function findCategoriaBySlug(
  categorias: Categoria[],
  slug: string
): Categoria | undefined {
  return categorias.find((c) => categoriaSlug(c) === slug);
}

export function findCategoriaById(
  categorias: Categoria[],
  id: number
): Categoria | undefined {
  return categorias.find((c) => c.id_categoria === id);
}

/** Ruta de migas de pan desde la raíz hasta la categoría dada. */
export function getCategoriaPath(
  categorias: Categoria[],
  id: number
): Categoria[] {
  const path: Categoria[] = [];
  let current = findCategoriaById(categorias, id);
  while (current) {
    path.unshift(current);
    current = current.id_categoria_padre
      ? findCategoriaById(categorias, current.id_categoria_padre)
      : undefined;
  }
  return path;
}
