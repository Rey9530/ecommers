"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

import { formatPrice } from "@/lib/utils";
import { buildSearch } from "@/lib/url";

export function ActiveFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const q = searchParams.get("q");
  const precioMin = searchParams.get("precioMin");
  const precioMax = searchParams.get("precioMax");
  const disp = searchParams.get("disp") === "1";

  const chips: { label: string; clear: Record<string, undefined> }[] = [];
  if (q) chips.push({ label: `“${q}”`, clear: { q: undefined } });
  if (precioMin || precioMax)
    chips.push({
      label: `${precioMin ? formatPrice(Number(precioMin)) : "Mín"} – ${
        precioMax ? formatPrice(Number(precioMax)) : "Máx"
      }`,
      clear: { precioMin: undefined, precioMax: undefined },
    });
  if (disp) chips.push({ label: "En stock", clear: { disp: undefined } });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip, i) => (
        <button
          key={i}
          type="button"
          onClick={() =>
            router.push(`${pathname}${buildSearch(searchParams, chip.clear)}`)
          }
          className="inline-flex items-center gap-1 rounded-full border bg-secondary px-3 py-1 text-xs font-medium transition-colors hover:bg-accent"
        >
          {chip.label}
          <X className="size-3" />
        </button>
      ))}
      <button
        type="button"
        onClick={() => router.push(pathname)}
        className="text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        Limpiar todo
      </button>
    </div>
  );
}
