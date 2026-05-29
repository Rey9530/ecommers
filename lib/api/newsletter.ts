/**
 * Newsletter — API real (`POST /tienda/newsletter`). Público.
 */

import { api } from "@/lib/api/client";

export function suscribirNewsletter(
  email: string,
  nombre?: string
): Promise<{ suscrito: boolean }> {
  return api("/tienda/newsletter", {
    method: "POST",
    body: { email, nombre },
  });
}
