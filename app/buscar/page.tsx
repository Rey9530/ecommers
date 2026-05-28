import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";

import { getCatalogo, getDestacados } from "@/lib/api/catalogo";
import { parseFiltros, type RawSearchParams } from "@/lib/catalogo-params";
import { CatalogView } from "@/components/catalog/catalog-view";
import { ProductGrid } from "@/components/product/product-grid";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Búsqueda",
  robots: { index: false },
};

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const sp = await searchParams;
  const filtros = parseFiltros(sp);
  const q = filtros.q ?? "";
  const resultado = await getCatalogo(filtros);
  const sugeridos = await getDestacados(4);

  return (
    <CatalogView
      titulo={q ? `Resultados para “${q}”` : "Búsqueda"}
      descripcion={
        q ? `${resultado.meta.total} coincidencia(s)` : "Escribe qué estás buscando."
      }
      resultado={resultado}
      breadcrumbs={[{ label: "Inicio", href: "/" }, { label: "Búsqueda" }]}
      emptyState={
        <div className="space-y-8">
          <EmptyState
            icon={SearchX}
            title={`Sin resultados para “${q}”`}
            description="Revisa la ortografía o prueba con términos más generales como “bolsa”, “caja” o “moño”."
          >
            <Button asChild>
              <Link href="/productos">Ver todos los productos</Link>
            </Button>
          </EmptyState>
          <div>
            <h2 className="mb-4 font-display text-xl font-semibold">
              Quizá te interese
            </h2>
            <ProductGrid productos={sugeridos} />
          </div>
        </div>
      }
    />
  );
}
