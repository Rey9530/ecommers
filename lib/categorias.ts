import type { Categoria, CategoriaArbol } from "@/types";
import { slugify } from "@/lib/utils";
import { CATEGORIAS } from "@/lib/mock/data";

/** Slug derivado del nombre (el backend no expone slug de categoría). */
export function categoriaSlug(c: Pick<Categoria, "nombre">): string {
  return slugify(c.nombre);
}

export function getCategorias(): Categoria[] {
  return CATEGORIAS;
}

/** Arma el árbol jerárquico a partir de la lista plana. */
export function buildCategoriaTree(): CategoriaArbol[] {
  const map = new Map<number, CategoriaArbol>();
  CATEGORIAS.forEach((c) => map.set(c.id_categoria, { ...c, hijos: [] }));
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

export function findCategoriaBySlug(slug: string): Categoria | undefined {
  return CATEGORIAS.find((c) => categoriaSlug(c) === slug);
}

export function findCategoriaById(id: number): Categoria | undefined {
  return CATEGORIAS.find((c) => c.id_categoria === id);
}

/** IDs de una categoría y todos sus descendientes (para filtrar incluyendo subcategorías). */
export function getCategoriaConDescendientes(id: number): number[] {
  const result = [id];
  const stack = [id];
  while (stack.length) {
    const current = stack.pop()!;
    CATEGORIAS.filter((c) => c.id_categoria_padre === current).forEach((c) => {
      result.push(c.id_categoria);
      stack.push(c.id_categoria);
    });
  }
  return result;
}

/** Ruta de migas de pan desde la raíz hasta la categoría dada. */
export function getCategoriaPath(id: number): Categoria[] {
  const path: Categoria[] = [];
  let current = findCategoriaById(id);
  while (current) {
    path.unshift(current);
    current = current.id_categoria_padre
      ? findCategoriaById(current.id_categoria_padre)
      : undefined;
  }
  return path;
}
