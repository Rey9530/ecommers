import type { MetadataRoute } from "next";

import { getCatalogo } from "@/lib/api/catalogo";
import { getCategorias, categoriaSlug } from "@/lib/categorias";

const BASE = "https://bolsabonita.sv";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categorias, catalogo] = await Promise.all([
    getCategorias(),
    getCatalogo({ limit: 60 }),
  ]);

  const estaticas: MetadataRoute.Sitemap = ["", "/productos"].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: "daily",
    priority: path === "" ? 1 : 0.8,
  }));

  const cats: MetadataRoute.Sitemap = categorias.map((c) => ({
    url: `${BASE}/categoria/${categoriaSlug(c)}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const productos: MetadataRoute.Sitemap = catalogo.data.map((p) => ({
    url: `${BASE}/producto/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...estaticas, ...cats, ...productos];
}
