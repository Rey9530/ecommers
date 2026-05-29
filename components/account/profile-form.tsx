"use client";

import * as React from "react";
import { BadgeCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/lib/store/auth-store";
import { actualizarPerfil } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ProfileForm() {
  const cliente = useAuthStore((s) => s.cliente);
  const token = useAuthStore((s) => s.token);
  const setCliente = useAuthStore((s) => s.setCliente);
  const [nombre, setNombre] = React.useState(cliente?.nombre ?? "");
  const [telefono, setTelefono] = React.useState(cliente?.telefono ?? "");
  const [guardando, setGuardando] = React.useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !cliente) return;
    setGuardando(true);
    try {
      const r = await actualizarPerfil(token, { nombre, telefono });
      setCliente({
        ...cliente,
        nombre: r.nombre,
        telefono: r.telefono,
        email: r.correo,
        tipo_precio: r.tipo_precio,
      });
      toast.success("Perfil actualizado");
    } catch (err) {
      toast.error("No se pudo actualizar", {
        description: err instanceof ApiError ? err.message : undefined,
      });
    } finally {
      setGuardando(false);
    }
  }

  if (!cliente) return null;

  return (
    <form onSubmit={submit} className="max-w-lg space-y-4">
      <div>
        <Label htmlFor="nombre" className="mb-1.5 block">
          Nombre completo
        </Label>
        <Input
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="email" className="mb-1.5 block">
          Correo electrónico
        </Label>
        <Input id="email" type="email" value={cliente.email} disabled />
        <div className="mt-1.5">
          {cliente.email_verificado ? (
            <Badge variant="success">
              <BadgeCheck className="size-3" /> Verificado
            </Badge>
          ) : (
            <Badge variant="warning">
              <AlertCircle className="size-3" /> Sin verificar
            </Badge>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="telefono" className="mb-1.5 block">
          Teléfono
        </Label>
        <Input
          id="telefono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
      </div>
      <Button type="submit" disabled={guardando}>
        {guardando ? "Guardando…" : "Guardar cambios"}
      </Button>
    </form>
  );
}
