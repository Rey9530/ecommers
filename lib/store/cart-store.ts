/**
 * Estado del carrito — CLIENTE (Zustand + localStorage).
 *
 * En la versión real, estas acciones llamarán a `/tienda/carrito*`
 * (POST/PATCH/DELETE) enviando el Bearer del cliente o `x-session-id`
 * para invitados, y el estado se sincronizará con la respuesta del backend.
 * Por ahora todo el cálculo es local sobre datos mock.
 */

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductoDetalle, ProductoLista } from "@/types";

export interface CartLine {
  id_catalogo: number;
  slug: string;
  nombre: string;
  imagen: string;
  precio_unitario: number; // con IVA
  cantidad: number;
  disponible: number;
}

interface CartState {
  items: CartLine[];
  hydrated: boolean;
  setHydrated: () => void;
  addItem: (
    producto: ProductoLista | ProductoDetalle,
    cantidad?: number
  ) => void;
  updateCantidad: (idCatalogo: number, cantidad: number) => void;
  removeItem: (idCatalogo: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      addItem: (producto, cantidad = 1) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.id_catalogo === producto.id_catalogo
          );
          const disponible =
            "disponible" in producto ? producto.disponible : 999;
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id_catalogo === producto.id_catalogo
                  ? {
                      ...i,
                      cantidad: Math.min(i.cantidad + cantidad, disponible),
                    }
                  : i
              ),
            };
          }
          const imagen =
            "imagenes" in producto
              ? producto.imagenes[0]?.path_miniature ?? ""
              : producto.imagen ?? "";
          const line: CartLine = {
            id_catalogo: producto.id_catalogo,
            slug: producto.slug,
            nombre: producto.nombre,
            imagen,
            precio_unitario: producto.precio,
            cantidad: Math.min(cantidad, disponible),
            disponible,
          };
          return { items: [...state.items, line] };
        }),
      updateCantidad: (idCatalogo, cantidad) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.id_catalogo === idCatalogo
                ? { ...i, cantidad: Math.max(0, cantidad) }
                : i
            )
            .filter((i) => i.cantidad > 0),
        })),
      removeItem: (idCatalogo) =>
        set((state) => ({
          items: state.items.filter((i) => i.id_catalogo !== idCatalogo),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "bolsabonita-cart",
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    }
  )
);

// Selectores derivados (se llaman desde componentes cliente).
export const selectCantidadItems = (s: CartState) =>
  s.items.reduce((acc, i) => acc + i.cantidad, 0);

export const selectSubtotal = (s: CartState) =>
  Math.round(
    s.items.reduce((acc, i) => acc + i.precio_unitario * i.cantidad, 0) * 100
  ) / 100;
