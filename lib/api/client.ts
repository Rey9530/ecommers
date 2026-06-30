/**
 * Cliente HTTP para la API del ERP (módulo `/tienda`).
 *
 * - Lee la URL base de `NEXT_PUBLIC_API_URL` (backend en :3010).
 * - Desenvuelve la respuesta `{ data, status, msg }` → devuelve `data`.
 * - Normaliza errores de NestJS (`{ statusCode, message, error }`) lanzando `ApiError`.
 * - Adjunta `Authorization: Bearer` y/o `x-session-id` cuando se proveen.
 *
 * Funciona en server components (catálogo SSR) y en client components.
 */

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
/**
 * URL base para imágenes servidas por el backend (MinIO/ERP).
 * Requiere el prefijo `NEXT_PUBLIC_` para estar disponible en client components.
 */
export const IMAGE_URL = process.env.NEXT_PUBLIC_URL_IMAGE ?? "";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type QueryValue = string | number | boolean | undefined | null;

interface ApiOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  token?: string | null;
  sessionId?: string | null;
  query?: Record<string, QueryValue>;
  /** Opciones de caché de Next para fetch en server components. */
  cache?: RequestCache;
  next?: { revalidate?: number | false; tags?: string[] };
  signal?: AbortSignal;
}

export async function api<T>(path: string, opts: ApiOptions = {}): Promise<T> {
  const base = API_URL.replace(/\/$/, "");
  const url = new URL(`${base}${path}`);
  if (opts.query) {
    for (const [k, v] of Object.entries(opts.query)) {
      if (v !== undefined && v !== null && v !== "") {
        url.searchParams.set(k, String(v));
      }
    }
  }

  const headers: Record<string, string> = {};
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";
  if (opts.token) headers["Authorization"] = `Bearer ${opts.token}`;
  if (opts.sessionId) headers["x-session-id"] = opts.sessionId;

  let res: Response;
  try {
    res = await fetch(url.toString(), {
      method: opts.method ?? "GET",
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
      cache: opts.cache,
      next: opts.next,
      signal: opts.signal,
    });
  } catch {
    throw new ApiError(
      "No se pudo conectar con el servidor. Inténtalo de nuevo.",
      0
    );
  }

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const raw = json?.message;
    const msg = Array.isArray(raw)
      ? raw.join(", ")
      : typeof raw === "string"
        ? raw
        : `Error ${res.status}`;
    throw new ApiError(msg, res.status);
  }

  // Respuestas exitosas vienen envueltas en { data, status, msg }.
  return (json && "data" in json ? json.data : json) as T;
}
