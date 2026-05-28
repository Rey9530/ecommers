import type { MetadataRoute } from "next";

import { PRODUCTOS, CATEGORIAS } from "@/lib/mock/data";
import { categoriaSlug } from "@/lib/categorias";

const BASE = "https://bolsabonita.sv";

export default function sitemap(): MetadataRoute.Sitemap {
  const estaticas = ["", "/productos"].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: "daily" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const categorias = CATEGORIAS.map((c) => ({
    url: `${BASE}/categoria/${categoriaSlug(c)}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const productos = PRODUCTOS.map((p) => ({
    url: `${BASE}/producto/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...estaticas, ...categorias, ...productos];
}
