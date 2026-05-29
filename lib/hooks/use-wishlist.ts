"use client";

import * as React from "react";
import { toast } from "sonner";

import type { ProductoDetalle, ProductoLista } from "@/types";
import { useAuthStore } from "@/lib/store/auth-store";
import {
  useWishlistStore,
  type WishlistItem,
} from "@/lib/store/wishlist-store";
import {
  getFavoritos,
  agregarFavorito,
  quitarFavorito,
} from "@/lib/api/favoritos";

function toItem(p: ProductoLista | ProductoDetalle): WishlistItem {
  return {
    id_catalogo: p.id_catalogo,
    slug: p.slug,
    nombre: p.nombre,
    imagen: ("imagen" in p ? p.imagen : p.imagenes[0]?.path_miniature) ?? "",
    precio: p.precio,
    en_stock: p.en_stock,
  };
}

/**
 * Favoritos: si hay sesión usa el backend (`/tienda/favoritos`); si es invitado
 * usa el store local (localStorage). No sincroniza el local al iniciar sesión.
 */
export function useWishlist() {
  const token = useAuthStore((s) => s.token);
  const authHydrated = useAuthStore((s) => s.hydrated);
  const items = useWishlistStore((s) => s.items);
  const wlHydrated = useWishlistStore((s) => s.hydrated);
  const setItems = useWishlistStore((s) => s.setItems);
  const toggleLocal = useWishlistStore((s) => s.toggle);

  const logueado = authHydrated && !!token;

  // Al iniciar sesión, cargar los favoritos del backend (reemplaza la caché local).
  React.useEffect(() => {
    if (!logueado || !token) return;
    let cancel = false;
    getFavoritos(token)
      .then((prods) => {
        if (!cancel) setItems(prods.map(toItem));
      })
      .catch(() => undefined);
    return () => {
      cancel = true;
    };
  }, [logueado, token, setItems]);

  const has = React.useCallback(
    (idCatalogo: number) => items.some((i) => i.id_catalogo === idCatalogo),
    [items]
  );

  const toggle = React.useCallback(
    async (producto: ProductoLista | ProductoDetalle) => {
      const activo = items.some((i) => i.id_catalogo === producto.id_catalogo);

      if (logueado && token) {
        try {
          if (activo) {
            await quitarFavorito(token, producto.id_catalogo);
            setItems(items.filter((i) => i.id_catalogo !== producto.id_catalogo));
          } else {
            await agregarFavorito(token, producto.id_catalogo);
            setItems([...items, toItem(producto)]);
          }
          toast(activo ? "Quitado de favoritos" : "Agregado a favoritos", {
            description: producto.nombre,
          });
        } catch {
          toast.error("No se pudo actualizar favoritos");
        }
      } else {
        toggleLocal(producto);
        toast(activo ? "Quitado de favoritos" : "Agregado a favoritos", {
          description: producto.nombre,
        });
      }
    },
    [items, logueado, token, setItems, toggleLocal]
  );

  return {
    items,
    has,
    toggle,
    hydrated: authHydrated && wlHydrated,
  };
}
