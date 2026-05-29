"use client";

import * as React from "react";
import { MapPin, Plus, Pencil, Trash2, Star } from "lucide-react";
import { toast } from "sonner";

import type { Direccion } from "@/types";
import { useAuthStore } from "@/lib/store/auth-store";
import {
  getDirecciones,
  crearDireccion,
  actualizarDireccion,
  eliminarDireccion,
  type DireccionInput,
} from "@/lib/api/direcciones";
import { ApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { AddressForm } from "@/components/account/address-form";

export function AddressBook() {
  const token = useAuthStore((s) => s.token);
  const [direcciones, setDirecciones] = React.useState<Direccion[]>([]);
  const [cargando, setCargando] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [editando, setEditando] = React.useState<Direccion | null>(null);

  React.useEffect(() => {
    if (!token) return;
    let cancel = false;
    getDirecciones(token)
      .then((d) => {
        if (!cancel) setDirecciones(d);
      })
      .catch((err) => {
        if (!cancel)
          toast.error("No se pudieron cargar las direcciones", {
            description: err instanceof ApiError ? err.message : undefined,
          });
      })
      .finally(() => {
        if (!cancel) setCargando(false);
      });
    return () => {
      cancel = true;
    };
  }, [token]);

  async function recargar() {
    if (!token) return;
    setDirecciones(await getDirecciones(token));
  }

  async function guardar(input: DireccionInput, id?: number) {
    if (!token) return;
    try {
      if (id) {
        await actualizarDireccion(token, id, input);
        toast.success("Dirección actualizada");
      } else {
        await crearDireccion(token, input);
        toast.success("Dirección agregada");
      }
      await recargar();
    } catch (err) {
      toast.error("No se pudo guardar", {
        description: err instanceof ApiError ? err.message : undefined,
      });
    }
  }

  async function eliminar(id: number) {
    if (!token) return;
    try {
      await eliminarDireccion(token, id);
      setDirecciones((prev) => prev.filter((d) => d.id_direccion !== id));
      toast.success("Dirección eliminada");
    } catch (err) {
      toast.error("No se pudo eliminar", {
        description: err instanceof ApiError ? err.message : undefined,
      });
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Mis direcciones</h1>
        <Button
          onClick={() => {
            setEditando(null);
            setOpen(true);
          }}
        >
          <Plus /> Agregar
        </Button>
      </div>

      {cargando ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : direcciones.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="Sin direcciones guardadas"
          description="Agrega una dirección para agilizar tus compras."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {direcciones.map((d) => (
            <div key={d.id_direccion} className="rounded-xl border bg-card p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {d.tipo === "ENVIO" ? "Envío" : "Facturación"}
                  </Badge>
                  {d.es_predeterminada && (
                    <Badge>
                      <Star className="size-3" /> Predeterminada
                    </Badge>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    aria-label="Editar"
                    onClick={() => {
                      setEditando(d);
                      setOpen(true);
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Eliminar"
                    onClick={() => eliminar(d.id_direccion)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
              <p className="mt-3 font-medium">{d.nombre_contacto}</p>
              <p className="text-sm text-muted-foreground">{d.telefono}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {d.direccion}
                {d.municipio_nombre ? `, ${d.municipio_nombre}` : ""}
              </p>
              {d.referencia && (
                <p className="text-sm text-muted-foreground">Ref: {d.referencia}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <AddressForm
        open={open}
        onOpenChange={setOpen}
        inicial={editando}
        onSave={guardar}
      />
    </div>
  );
}
