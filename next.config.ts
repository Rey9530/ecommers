import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bundle de producción autocontenido en .next/standalone/ con tree-shaking
  // de node_modules. Necesario para reducir la imagen Docker a ~150 MB.
  // No afecta al dev server (`pnpm dev`).
  output: "standalone",
  images: {
    // Las imágenes de producto provienen de MinIO/ERP (host variable).
    // Se desactiva la optimización para aceptar cualquier origen sin allowlist.
    unoptimized: true,
  },
};

export default nextConfig;
