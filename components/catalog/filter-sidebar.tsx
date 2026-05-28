"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { cn, formatPrice } from "@/lib/utils";
import { buildSearch } from "@/lib/url";
import { categoriaSlug } from "@/lib/categorias";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { CategoriaArbol } from "@/types";

interface FilterSidebarProps {
  categorias: CategoriaArbol[];
  rango: { min: number; max: number };
  /** id de la categoría activa (cuando estamos en /categoria/[slug]). */
  categoriaActiva?: number;
  className?: string;
}

export function FilterSidebar({
  categorias,
  rango,
  categoriaActiva,
  className,
}: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const precioMin = Number(searchParams.get("precioMin")) || rango.min;
  const precioMax = Number(searchParams.get("precioMax")) || rango.max;
  const soloDisponibles = searchParams.get("disp") === "1";

  const [rangoLocal, setRangoLocal] = React.useState<[number, number]>([
    precioMin,
    precioMax,
  ]);
  // Resincroniza el slider cuando los filtros de la URL cambian externamente
  // (patrón de ajuste de estado en render recomendado por React, sin efecto).
  const [prevRango, setPrevRango] = React.useState<[number, number]>([
    precioMin,
    precioMax,
  ]);
  if (prevRango[0] !== precioMin || prevRango[1] !== precioMax) {
    setPrevRango([precioMin, precioMax]);
    setRangoLocal([precioMin, precioMax]);
  }

  function aplicarPrecio([min, max]: number[]) {
    router.push(
      `${pathname}${buildSearch(searchParams, {
        precioMin: min > rango.min ? min : undefined,
        precioMax: max < rango.max ? max : undefined,
      })}`
    );
  }

  return (
    <aside className={cn("space-y-6", className)}>
      {/* Categorías */}
      <div>
        <h3 className="mb-3 text-sm font-semibold">Categorías</h3>
        <ul className="space-y-1 text-sm">
          <li>
            <Link
              href="/productos"
              className={cn(
                "block rounded-md px-2 py-1.5 hover:bg-accent",
                !categoriaActiva && pathname === "/productos" && "bg-accent font-medium"
              )}
            >
              Todos los productos
            </Link>
          </li>
          {categorias.map((c) => (
            <li key={c.id_categoria}>
              <Link
                href={`/categoria/${categoriaSlug(c)}`}
                className={cn(
                  "block rounded-md px-2 py-1.5 hover:bg-accent",
                  categoriaActiva === c.id_categoria && "bg-accent font-medium"
                )}
              >
                {c.nombre}
              </Link>
              {c.hijos.length > 0 && (
                <ul className="ml-3 space-y-1 border-l pl-2">
                  {c.hijos.map((h) => (
                    <li key={h.id_categoria}>
                      <Link
                        href={`/categoria/${categoriaSlug(h)}`}
                        className={cn(
                          "block rounded-md px-2 py-1.5 text-muted-foreground hover:bg-accent hover:text-foreground",
                          categoriaActiva === h.id_categoria &&
                            "bg-accent font-medium text-foreground"
                        )}
                      >
                        {h.nombre}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Precio */}
      <div>
        <h3 className="mb-3 text-sm font-semibold">Precio</h3>
        <Slider
          min={rango.min}
          max={rango.max}
          step={1}
          value={rangoLocal}
          onValueChange={(v) => setRangoLocal([v[0], v[1]])}
          onValueCommit={aplicarPrecio}
          className="mt-2"
        />
        <div className="mt-2 flex justify-between text-sm text-muted-foreground">
          <span>{formatPrice(rangoLocal[0])}</span>
          <span>{formatPrice(rangoLocal[1])}</span>
        </div>
      </div>

      {/* Disponibilidad */}
      <div>
        <h3 className="mb-3 text-sm font-semibold">Disponibilidad</h3>
        <div className="flex items-center gap-2">
          <Checkbox
            id="solo-disponibles"
            checked={soloDisponibles}
            onCheckedChange={(checked) =>
              router.push(
                `${pathname}${buildSearch(searchParams, {
                  disp: checked ? "1" : undefined,
                })}`
              )
            }
          />
          <Label htmlFor="solo-disponibles" className="cursor-pointer font-normal">
            Solo productos en stock
          </Label>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground"
        onClick={() => router.push(pathname)}
      >
        Limpiar filtros
      </Button>
    </aside>
  );
}
