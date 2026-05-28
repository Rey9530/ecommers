import { Fragment } from "react";
import { PackageSearch } from "lucide-react";

import type { Paginated, ProductoLista } from "@/types";
import { buildCategoriaTree } from "@/lib/categorias";
import { getRangoPrecios } from "@/lib/api/catalogo";
import { ProductGrid } from "@/components/product/product-grid";
import { FilterSidebar } from "@/components/catalog/filter-sidebar";
import { MobileFilters } from "@/components/catalog/mobile-filters";
import { SortSelect } from "@/components/catalog/sort-select";
import { ActiveFilters } from "@/components/catalog/active-filters";
import { CatalogPagination } from "@/components/catalog/catalog-pagination";
import { EmptyState } from "@/components/common/empty-state";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface Crumb {
  label: string;
  href?: string;
}

interface CatalogViewProps {
  titulo: string;
  descripcion?: string;
  resultado: Paginated<ProductoLista>;
  categoriaActiva?: number;
  breadcrumbs: Crumb[];
  /** Contenido alternativo cuando no hay resultados (p. ej. sugerencias). */
  emptyState?: React.ReactNode;
}

export function CatalogView({
  titulo,
  descripcion,
  resultado,
  categoriaActiva,
  breadcrumbs,
  emptyState,
}: CatalogViewProps) {
  const categorias = buildCategoriaTree();
  const rango = getRangoPrecios();
  const { data: productos, meta } = resultado;

  return (
    <div className="container-page py-8">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          {breadcrumbs.map((c, i) => (
            <Fragment key={i}>
              <BreadcrumbItem>
                {c.href ? (
                  <BreadcrumbLink href={c.href}>{c.label}</BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{c.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {i < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold">{titulo}</h1>
        {descripcion && (
          <p className="mt-1 text-muted-foreground">{descripcion}</p>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
        <FilterSidebar
          categorias={categorias}
          rango={rango}
          categoriaActiva={categoriaActiva}
          className="hidden lg:block"
        />

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {meta.total}{" "}
              {meta.total === 1 ? "producto" : "productos"}
            </p>
            <div className="flex items-center gap-2">
              <MobileFilters
                categorias={categorias}
                rango={rango}
                categoriaActiva={categoriaActiva}
              />
              <SortSelect />
            </div>
          </div>

          <div className="mb-4">
            <ActiveFilters />
          </div>

          {productos.length === 0 ? (
            emptyState ?? (
              <EmptyState
                icon={PackageSearch}
                title="No encontramos productos"
                description="Prueba ajustando los filtros o explora otras categorías."
              />
            )
          ) : (
            <>
              <ProductGrid productos={productos} />
              <CatalogPagination page={meta.page} totalPages={meta.totalPages} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
