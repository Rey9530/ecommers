import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCatalogo } from "@/lib/api/catalogo";
import { parseFiltros, type RawSearchParams } from "@/lib/catalogo-params";
import {
  findCategoriaBySlug,
  getCategoriaPath,
  getCategorias,
  categoriaSlug,
} from "@/lib/categorias";
import { CatalogView, type Crumb } from "@/components/catalog/catalog-view";

export async function generateStaticParams() {
  return getCategorias().map((c) => ({ slug: categoriaSlug(c) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const categoria = findCategoriaBySlug(slug);
  if (!categoria) return { title: "Categoría no encontrada" };
  return {
    title: categoria.nombre,
    description: `Compra ${categoria.nombre.toLowerCase()} en Bolsa Bonita. Diseños únicos, mayoreo y menudeo.`,
  };
}

export default async function CategoriaPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<RawSearchParams>;
}) {
  const { slug } = await params;
  const categoria = findCategoriaBySlug(slug);
  if (!categoria) notFound();

  const sp = await searchParams;
  const filtros = parseFiltros(sp);
  const resultado = await getCatalogo({
    ...filtros,
    categoria: categoria.id_categoria,
  });

  const breadcrumbs: Crumb[] = [
    { label: "Inicio", href: "/" },
    { label: "Productos", href: "/productos" },
    ...getCategoriaPath(categoria.id_categoria).map((c, i, arr) => ({
      label: c.nombre,
      href:
        i < arr.length - 1 ? `/categoria/${categoriaSlug(c)}` : undefined,
    })),
  ];

  return (
    <CatalogView
      titulo={categoria.nombre}
      resultado={resultado}
      categoriaActiva={categoria.id_categoria}
      breadcrumbs={breadcrumbs}
    />
  );
}
