"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { buildSearch } from "@/lib/url";
import type { OrdenCatalogo } from "@/types";

const OPCIONES: { value: OrdenCatalogo; label: string }[] = [
  { value: "nombre", label: "Relevancia" },
  { value: "precio_asc", label: "Precio: menor a mayor" },
  { value: "precio_desc", label: "Precio: mayor a menor" },
  { value: "nuevos", label: "Novedades" },
];

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = (searchParams.get("orden") as OrdenCatalogo) ?? "nombre";

  return (
    <Select
      value={current}
      onValueChange={(value) =>
        router.push(`${pathname}${buildSearch(searchParams, { orden: value })}`)
      }
    >
      <SelectTrigger className="w-52" aria-label="Ordenar por">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {OPCIONES.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
