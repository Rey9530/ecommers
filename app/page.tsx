import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck, Sparkles, Gift } from "lucide-react";

import { getDestacados, getNovedades } from "@/lib/api/catalogo";
import { buildCategoriaTree, getCategorias } from "@/lib/categorias";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/product/product-grid";
import { CategoryTile } from "@/components/catalog/category-tile";

export default async function HomePage() {
  const [destacados, novedades, categoriasPlanas] = await Promise.all([
    getDestacados(8),
    getNovedades(4),
    getCategorias(),
  ]);
  const categorias = buildCategoriaTree(categoriasPlanas);

  return (
    <div>
      {/* Hero */}
      <section className="border-b bg-gradient-to-br from-accent/50 via-background to-secondary/40">
        <div className="container-page grid items-center gap-8 py-12 md:grid-cols-2 md:py-20">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="size-3.5" /> Nuevos diseños cada temporada
            </span>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Bolsas y detalles decorativos
            </h1>
            <p className="mt-4 max-w-md text-lg text-muted-foreground">
              Bolsas, cajas, moños y más. Mayoreo y menudeo.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/productos">
                  Explorar productos <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/categoria/bolsas-de-regalo">Bolsas de regalo</Link>
              </Button>
            </div>
          </div>
          <div className="relative hidden aspect-square md:block">
            <div className="absolute inset-0 grid grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((i) => {
                const hue = (i * 60 + 20) % 360;
                return (
                  <div
                    key={i}
                    className="flex items-center justify-center rounded-2xl"
                    style={{
                      background: `linear-gradient(135deg, hsl(${hue} 50% 88%), hsl(${(hue + 40) % 360} 55% 80%))`,
                    }}
                  >
                    <Gift
                      className="size-12"
                      style={{ color: `hsl(${hue} 45% 35%)` }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Novedades */}
      {novedades.length > 0 && (
        <section className="container-page py-6">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-2xl font-semibold">Novedades</h2>
            <Link
              href="/productos?orden=nuevos"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Ver más <ArrowRight className="size-4" />
            </Link>
          </div>
          <ProductGrid productos={novedades} />
        </section>
      )}

      {/* Beneficios */}
      <section className="container-page py-12">
        <div className="grid gap-4 rounded-2xl border bg-card p-6 sm:grid-cols-3">
          {[
            {
              icon: Truck,
              title: "Envío a todo el país",
              desc: "Recibe en tu casa o retira en tienda.",
            },
            {
              icon: ShieldCheck,
              title: "Pago seguro",
              desc: "Transferencia o contra entrega.",
            },
            {
              icon: Sparkles,
              title: "Calidad garantizada",
              desc: "Materiales premium y diseños únicos.",
            },
          ].map((b) => (
            <div key={b.title} className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <b.icon className="size-5" />
              </span>
              <div>
                <h3 className="text-sm font-semibold">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Destacados */}
      <section className="container-page py-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold">Más vendidos</h2>
          <Link
            href="/productos"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Ver todo <ArrowRight className="size-4" />
          </Link>
        </div>
        <ProductGrid productos={destacados} />
      </section>

      {/* Categorías */}
      <section className="container-page py-12 pb-16">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold">Categorías</h2>
          <Link
            href="/productos"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Ver todo <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {categorias.slice(0, 4).map((c, i) => (
            <CategoryTile key={c.id_categoria} categoria={c} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
