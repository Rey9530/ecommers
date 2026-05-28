/**
 * Sesión de cliente — MOCK (Zustand + localStorage).
 *
 * Simula el JWT de cliente del backend (`/tienda/auth`). En la versión real,
 * `login`/`register` llamarán a `/tienda/auth/login|registro`, guardarán el
 * token y `me` se obtendrá de `/tienda/auth/me`. Aquí usamos el cliente demo.
 */

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Cliente } from "@/types";
import { CLIENTE_DEMO } from "@/lib/mock/data";

interface AuthState {
  cliente: Cliente | null;
  token: string | null;
  hydrated: boolean;
  setHydrated: () => void;
  login: (email?: string) => void;
  register: (nombre: string, email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      cliente: null,
      token: null,
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      login: (email) =>
        set({
          cliente: { ...CLIENTE_DEMO, email: email || CLIENTE_DEMO.email },
          token: "mock.jwt.token",
        }),
      register: (nombre, email) =>
        set({
          cliente: {
            ...CLIENTE_DEMO,
            nombre,
            email,
            email_verificado: false,
          },
          token: "mock.jwt.token",
        }),
      logout: () => set({ cliente: null, token: null }),
    }),
    {
      name: "bolsabonita-auth",
      partialize: (s) => ({ cliente: s.cliente, token: s.token }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    }
  )
);
