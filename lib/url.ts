/**
 * Helpers para sincronizar filtros con la URL (searchParams).
 * Los filtros viven en la URL para que sean compartibles e indexables (SEO).
 */

export type ParamUpdates = Record<string, string | number | undefined | null>;

/**
 * Devuelve un querystring nuevo aplicando `updates` sobre `current`.
 * Un valor `undefined`/`null`/"" elimina la clave. Al cambiar cualquier
 * filtro se reinicia la paginación (salvo que se actualice `page`).
 */
export function buildSearch(
  current: URLSearchParams | string,
  updates: ParamUpdates
): string {
  const params = new URLSearchParams(current.toString());
  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined || value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
  }
  if (!("page" in updates)) params.delete("page");
  const str = params.toString();
  return str ? `?${str}` : "";
}
