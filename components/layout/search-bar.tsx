"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";

import { cn, formatPrice } from "@/lib/utils";
import { getSugerencias } from "@/lib/api/catalogo";
import { ProductThumb } from "@/components/common/product-thumb";
import type { Sugerencia } from "@/types";

/** Semilla numérica estable a partir del slug (para el placeholder). */
function seedDeSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) % 100000;
  return h;
}

interface SearchBarProps {
  className?: string;
  autoFocus?: boolean;
  onNavigate?: () => void;
}

export function SearchBar({ className, autoFocus, onNavigate }: SearchBarProps) {
  const router = useRouter();
  const [q, setQ] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [sugerencias, setSugerencias] = React.useState<Sugerencia[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const term = q.trim();
    const t = setTimeout(async () => {
      if (term.length < 2) {
        setSugerencias([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const res = await getSugerencias(term);
      setSugerencias(res);
      setLoading(false);
    }, 200);
    return () => clearTimeout(t);
  }, [q]);

  React.useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    setOpen(false);
    onNavigate?.();
    router.push(`/buscar?q=${encodeURIComponent(term)}`);
  }

  function goTo(slug: string) {
    setOpen(false);
    setQ("");
    onNavigate?.();
    router.push(`/producto/${slug}`);
  }

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <form onSubmit={submit} role="search">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={q}
            autoFocus={autoFocus}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Buscar bolsas, cajas, moños…"
            aria-label="Buscar productos"
            className="h-10 w-full rounded-full border border-input bg-background pl-9 pr-9 text-sm shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-search-cancel-button]:hidden"
          />
          {q && (
            <button
              type="button"
              onClick={() => {
                setQ("");
                setOpen(false);
              }}
              aria-label="Limpiar búsqueda"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </form>

      {open && q.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-xl border bg-popover shadow-lg">
          {loading ? (
            <div className="flex items-center gap-2 px-4 py-6 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Buscando…
            </div>
          ) : sugerencias.length > 0 ? (
            <ul className="max-h-96 overflow-auto py-1">
              {sugerencias.map((p) => (
                <li key={p.slug}>
                  <button
                    type="button"
                    onClick={() => goTo(p.slug)}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-accent"
                  >
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-md">
                      <ProductThumb
                        nombre={p.nombre}
                        seed={seedDeSlug(p.slug)}
                        src={p.imagen || undefined}
                        sizes="40px"
                      />
                    </div>
                    <span className="flex-1 truncate text-sm">{p.nombre}</span>
                    <span className="text-sm font-medium">
                      {formatPrice(p.precio)}
                    </span>
                  </button>
                </li>
              ))}
              <li className="border-t">
                <button
                  type="button"
                  onClick={submit}
                  className="w-full px-3 py-2.5 text-center text-sm font-medium text-primary hover:bg-accent"
                >
                  Ver todos los resultados de “{q.trim()}”
                </button>
              </li>
            </ul>
          ) : (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              No encontramos productos para “{q.trim()}”.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
