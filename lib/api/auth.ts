/**
 * Auth de cliente — API real (`/tienda/auth`).
 * El token (JWT cliente, 30 días) se guarda en el `auth-store`.
 */

import type { AuthResponse, Cliente } from "@/types";
import { api } from "@/lib/api/client";

export interface RegistroInput {
  nombre: string;
  email: string;
  password: string;
  telefono?: string;
}

export function registro(input: RegistroInput): Promise<AuthResponse> {
  return api<AuthResponse>("/tienda/auth/registro", {
    method: "POST",
    body: input,
  });
}

export function login(email: string, password: string): Promise<AuthResponse> {
  return api<AuthResponse>("/tienda/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export function me(token: string): Promise<Cliente> {
  return api<Cliente>("/tienda/auth/me", { token });
}

export function solicitarReset(email: string): Promise<{ mensaje: string }> {
  return api("/tienda/auth/solicitar-reset", {
    method: "POST",
    body: { email },
  });
}

export function resetPassword(
  token: string,
  password: string
): Promise<{ restablecido: boolean }> {
  return api("/tienda/auth/reset-password", {
    method: "POST",
    body: { token, password },
  });
}

export function verificarEmail(token: string): Promise<{ verificado: boolean }> {
  return api("/tienda/auth/verificar-email", { query: { token } });
}

export interface PerfilInput {
  nombre?: string;
  telefono?: string;
  razon_social?: string;
  nit?: string;
  registro_nrc?: string;
  giro?: string;
}

/** Respuesta del PATCH (ojo: el backend usa `correo`, no `email`). */
export interface PerfilActualizado {
  id_cliente: number;
  nombre: string;
  telefono: string;
  correo: string;
  razon_social: string | null;
  nit: string | null;
  registro_nrc: string | null;
  giro: string | null;
  tipo_precio: string;
}

// PATCH /tienda/auth/me (Bearer)
export function actualizarPerfil(
  token: string,
  input: PerfilInput
): Promise<PerfilActualizado> {
  return api<PerfilActualizado>("/tienda/auth/me", {
    method: "PATCH",
    token,
    body: input,
  });
}
