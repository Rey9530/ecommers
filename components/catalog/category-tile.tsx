import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { categoriaSlug } from "@/lib/categorias";
import type { Categoria } from "@/types";

export function CategoryTile({
  categoria,
  index = 0,
}: {
  categoria: Categoria;
  index?: number;
}) {
  const hue = (categoria.id_categoria * 53 + index * 30) % 360;
  return (
    <Link
      href={`/categoria/${categoriaSlug(categoria)}`}
      className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-xl p-5 transition-shadow hover:shadow-md"
      style={{
        background: `linear-gradient(140deg, hsl(${hue} 45% 88%), hsl(${(hue + 40) % 360} 50% 80%))`,
      }}
    >
      <span
        className="text-lg font-semibold"
        style={{ color: `hsl(${hue} 45% 25%)` }}
      >
        {categoria.nombre}
      </span>
      <span
        className="mt-1 inline-flex items-center gap-1 text-sm font-medium opacity-80"
        style={{ color: `hsl(${hue} 40% 30%)` }}
      >
        Ver productos
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
