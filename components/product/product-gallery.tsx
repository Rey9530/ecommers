"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { ProductThumb } from "@/components/common/product-thumb";
import type { ImagenProducto } from "@/types";

interface ProductGalleryProps {
  nombre: string;
  seed: number;
  imagenes: ImagenProducto[];
}

export function ProductGallery({ nombre, seed, imagenes }: ProductGalleryProps) {
  const fotos = imagenes.length > 0 ? imagenes : [{ path: "", path_miniature: "", orden: 0 }];
  const [activo, setActivo] = React.useState(0);
  const [zoom, setZoom] = React.useState(false);
  const [origen, setOrigen] = React.useState("50% 50%");

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigen(`${x}% ${y}%`);
  }

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      {/* Miniaturas */}
      {fotos.length > 1 && (
        <div className="flex gap-3 sm:flex-col">
          {fotos.map((f, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActivo(i)}
              aria-label={`Ver imagen ${i + 1}`}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                i === activo ? "border-primary" : "border-transparent hover:border-border"
              )}
            >
              <ProductThumb
                nombre={nombre}
                seed={seed}
                index={i}
                src={f.path_miniature || undefined}
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Imagen principal con zoom */}
      <div
        className="relative aspect-square flex-1 cursor-zoom-in overflow-hidden rounded-2xl border bg-muted"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={onMove}
      >
        <div
          className="size-full transition-transform duration-200"
          style={{
            transform: zoom ? "scale(1.8)" : "scale(1)",
            transformOrigin: origen,
          }}
        >
          <ProductThumb
            nombre={nombre}
            seed={seed}
            index={activo}
            src={fotos[activo]?.path || undefined}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
      </div>
    </div>
  );
}
