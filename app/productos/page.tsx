import type { Metadata } from "next";

import { getCatalogo } from "@/lib/api/catalogo";
import { parseFiltros, type RawSearchParams } from "@/lib/catalogo-params";
import { CatalogView } from "@/components/catalog/catalog-view";

export const metadata: Metadata = {
  title: "Todos los productos",
  description:
    "Explora bolsas de regalo, kraft, cajas decorativas, moños y más en Bolsa Bonita.",
};

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const sp = await searchParams;
  const filtros = parseFiltros(sp);
  const resultado = await getCatalogo(filtros);

  return (
    <CatalogView
      titulo="Todos los productos"
      descripcion="Todo lo que necesitas para que cada regalo se vea increíble."
      resultado={resultado}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Productos" },
      ]}
    />
  );
}
