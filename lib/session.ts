/**
 * Identificador de sesión para invitados (header `x-session-id`).
 * Se genera una sola vez por navegador y se reutiliza en carrito/checkout.
 */

"use client";

const KEY = "bolsabonita-session-id";

export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}
