"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SearchBar } from "@/components/layout/search-bar";
import { categoriaSlug } from "@/lib/categorias";
import type { CategoriaArbol } from "@/types";

const LINKS = [
  { href: "/productos", label: "Todos los productos" },
  { href: "/cuenta/pedidos", label: "Mis pedidos" },
  { href: "/cuenta/favoritos", label: "Favoritos" },
  { href: "/ayuda", label: "Ayuda" },
];

export function MobileNav({ categorias }: { categorias: CategoriaArbol[] }) {
  const [open, setOpen] = React.useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Abrir menú"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full p-0 sm:max-w-xs">
        <SheetHeader>
          <SheetTitle className="text-left font-display text-xl">
            Bolsa Bonita
          </SheetTitle>
        </SheetHeader>
        <div className="px-6 pb-4">
          <SearchBar onNavigate={close} />
        </div>
        <nav className="flex-1 overflow-auto px-3 pb-8">
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Categorías
          </p>
          <ul>
            {categorias.map((c) => (
              <li key={c.id_categoria}>
                <Link
                  href={`/categoria/${categoriaSlug(c)}`}
                  onClick={close}
                  className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent"
                >
                  {c.nombre}
                  <ChevronRight className="size-4 text-muted-foreground" />
                </Link>
                {c.hijos.length > 0 && (
                  <ul className="ml-3 border-l pl-3">
                    {c.hijos.map((h) => (
                      <li key={h.id_categoria}>
                        <Link
                          href={`/categoria/${categoriaSlug(h)}`}
                          onClick={close}
                          className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
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
          <div className="my-3 h-px bg-border" />
          <ul>
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={close}
                  className="block rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
