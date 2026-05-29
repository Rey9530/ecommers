import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Las imágenes de producto provienen de MinIO/ERP (host variable).
    // Se desactiva la optimización para aceptar cualquier origen sin allowlist.
    unoptimized: true,
  },
};

export default nextConfig;
