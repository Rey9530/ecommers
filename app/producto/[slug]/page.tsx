import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getProducto,
  getRelacionados,
  categoriaSlug,
} from "@/lib/api/catalogo";
import { getResenas } from "@/lib/api/resenas";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductPurchase } from "@/components/product/product-purchase";
import { ProductTabs } from "@/components/product/product-tabs";
import { ProductReviews } from "@/components/product/product-reviews";
import { ProductGrid } from "@/components/product/product-grid";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const producto = await getProducto(slug);
  if (!producto) return { title: "Producto no encontrado" };
  return {
    title: producto.meta_title || producto.nombre,
    description: producto.meta_description || producto.descripcion_corta,
    openGraph: {
      title: producto.nombre,
      description: producto.descripcion_corta,
      type: "website",
    },
  };
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const producto = await getProducto(slug);
  if (!producto) notFound();

  const [relacionados, resenas] = await Promise.all([
    getRelacionados(slug),
    getResenas(slug),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: producto.nombre,
    description: producto.descripcion_corta,
    sku: String(producto.id_catalogo),
    category: producto.categoria.nombre,
    ...(producto.total_resenas && producto.total_resenas > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: producto.calificacion_promedio,
            reviewCount: producto.total_resenas,
          },
        }
      : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: producto.precio.toFixed(2),
      availability: producto.en_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="container-page py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/categoria/${categoriaSlug(producto.categoria)}`}>
              {producto.categoria.nombre}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{producto.nombre}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery
          nombre={producto.nombre}
          seed={producto.id_catalogo}
          imagenes={producto.imagenes}
        />
        <ProductPurchase producto={producto} />
      </div>

      <div className="mt-12">
        <ProductTabs producto={producto} />
      </div>

      <div className="mt-12">
        <ProductReviews slug={slug} inicial={resenas} />
      </div>

      {relacionados.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-2xl font-semibold">
            También te puede interesar
          </h2>
          <ProductGrid productos={relacionados} />
        </section>
      )}
    </div>
  );
}
