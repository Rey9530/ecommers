/**
 * Lista de favoritos (wishlist) — CLIENTE (Zustand + localStorage).
 *
 * El backend NO expone wishlist hoy, por lo que vive 100% en el cliente.
 * Si más adelante se agrega al ERP, estas acciones se sincronizarán.
 */

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductoDetalle, ProductoLista } from "@/types";

export interface WishlistItem {
  id_catalogo: number;
  slug: string;
  nombre: string;
  imagen: string;
  precio: number;
  en_stock: boolean;
}

interface WishlistState {
  items: WishlistItem[];
  hydrated: boolean;
  setHydrated: () => void;
  setItems: (items: WishlistItem[]) => void;
  toggle: (producto: ProductoLista | ProductoDetalle) => void;
  remove: (idCatalogo: number) => void;
  has: (idCatalogo: number) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      setItems: (items) => set({ items }),
      toggle: (producto) =>
        set((state) => {
          const exists = state.items.some(
            (i) => i.id_catalogo === producto.id_catalogo
          );
          if (exists) {
            return {
              items: state.items.filter(
                (i) => i.id_catalogo !== producto.id_catalogo
              ),
            };
          }
          const imagen =
            "imagenes" in producto
              ? producto.imagenes[0]?.path_miniature ?? ""
              : producto.imagen ?? "";
          const item: WishlistItem = {
            id_catalogo: producto.id_catalogo,
            slug: producto.slug,
            nombre: producto.nombre,
            imagen,
            precio: producto.precio,
            en_stock: producto.en_stock,
          };
          return { items: [...state.items, item] };
        }),
      remove: (idCatalogo) =>
        set((state) => ({
          items: state.items.filter((i) => i.id_catalogo !== idCatalogo),
        })),
      has: (idCatalogo) =>
        get().items.some((i) => i.id_catalogo === idCatalogo),
      clear: () => set({ items: [] }),
    }),
    {
      name: "bolsabonita-wishlist",
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    }
  )
);
