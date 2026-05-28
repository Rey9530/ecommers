/**
 * Guarda el último pedido creado para mostrarlo en la confirmación.
 * MOCK: en producción la confirmación leería el pedido de
 * `GET /tienda/pedidos/:numero`.
 */

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Pedido } from "@/types";

interface OrderState {
  ultimo: Pedido | null;
  hydrated: boolean;
  setHydrated: () => void;
  setUltimo: (pedido: Pedido) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      ultimo: null,
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      setUltimo: (pedido) => set({ ultimo: pedido }),
    }),
    {
      name: "bolsabonita-last-order",
      partialize: (s) => ({ ultimo: s.ultimo }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    }
  )
);
