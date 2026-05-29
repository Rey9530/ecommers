/**
 * Sesión de cliente (JWT del backend `/tienda/auth`).
 * Guarda el token y los datos del cliente en localStorage.
 */

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthResponse, Cliente } from "@/types";
import { useWishlistStore } from "@/lib/store/wishlist-store";

interface AuthState {
  cliente: Cliente | null;
  token: string | null;
  hydrated: boolean;
  setHydrated: () => void;
  setSession: (resp: AuthResponse) => void;
  setCliente: (cliente: Cliente) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      cliente: null,
      token: null,
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      setSession: (resp) => set({ cliente: resp.cliente, token: resp.token }),
      setCliente: (cliente) => set({ cliente }),
      logout: () => {
        // Los favoritos en sesión son del backend; al salir se limpia la caché local.
        useWishlistStore.getState().clear();
        set({ cliente: null, token: null });
      },
    }),
    {
      name: "bolsabonita-auth",
      partialize: (s) => ({ cliente: s.cliente, token: s.token }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    }
  )
);
