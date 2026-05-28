"use client";

import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FilterSidebar } from "@/components/catalog/filter-sidebar";
import type { CategoriaArbol } from "@/types";

interface MobileFiltersProps {
  categorias: CategoriaArbol[];
  rango: { min: number; max: number };
  categoriaActiva?: number;
}

export function MobileFilters(props: MobileFiltersProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden">
          <SlidersHorizontal className="size-4" /> Filtros
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full overflow-auto sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
        </SheetHeader>
        <div className="p-6">
          <FilterSidebar {...props} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
