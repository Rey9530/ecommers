import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/checkout", "/carrito", "/cuenta", "/buscar"],
    },
    sitemap: "https://bolsabonita.sv/sitemap.xml",
  };
}
