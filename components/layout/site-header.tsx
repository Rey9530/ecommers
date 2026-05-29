import Link from "next/link";
import { Sparkles } from "lucide-react";

import { buildCategoriaTree, categoriaSlug, getCategorias } from "@/lib/categorias";
import { SearchBar } from "@/components/layout/search-bar";
import { CartButton } from "@/components/layout/cart-button";
import { WishlistLink } from "@/components/layout/wishlist-link";
import { AccountMenu } from "@/components/layout/account-menu";
import { MobileNav } from "@/components/layout/mobile-nav";

export async function SiteHeader() {
  const categorias = buildCategoriaTree(await getCategorias());

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {/* Barra de anuncio */}
      <div className="bg-primary text-primary-foreground">
        <div className="container-page flex h-9 items-center justify-center gap-2 text-xs font-medium">
          <Sparkles className="size-3.5" />
          Envío a todo El Salvador · Paga por transferencia o contra entrega
        </div>
      </div>

      {/* Fila principal */}
      <div className="container-page flex h-16 items-center gap-3">
        <MobileNav categorias={categorias} />

        <Link
          href="/"
          className="flex shrink-0 items-center gap-2"
          aria-label="Inicio Bolsa Bonita"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Sparkles className="size-5" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">
            Bolsa Bonita
          </span>
        </Link>

        <div className="mx-auto hidden w-full max-w-md md:block">
          <SearchBar />
        </div>

        <div className="ml-auto flex items-center gap-0.5 md:ml-0">
          <AccountMenu />
          <WishlistLink />
          <CartButton />
        </div>
      </div>

      {/* Navegación de categorías (desktop) */}
      <nav className="hidden border-t lg:block">
        <div className="container-page flex h-11 items-center gap-1">
          <Link
            href="/productos"
            className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
          >
            Todo
          </Link>
          {categorias.map((c) => (
            <div key={c.id_categoria} className="group relative">
              <Link
                href={`/categoria/${categoriaSlug(c)}`}
                className="inline-block rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
              >
                {c.nombre}
              </Link>
              {c.hijos.length > 0 && (
                <div className="invisible absolute left-0 top-full z-50 min-w-52 rounded-xl border bg-popover p-1 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                  {c.hijos.map((h) => (
                    <Link
                      key={h.id_categoria}
                      href={`/categoria/${categoriaSlug(h)}`}
                      className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
                    >
                      {h.nombre}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Buscador en móvil */}
      <div className="container-page pb-3 md:hidden">
        <SearchBar />
      </div>
    </header>
  );
}
