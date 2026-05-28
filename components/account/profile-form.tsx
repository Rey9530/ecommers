"use client";

import * as React from "react";
import { BadgeCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/lib/store/auth-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ProfileForm() {
  const cliente = useAuthStore((s) => s.cliente);
  const [nombre, setNombre] = React.useState(cliente?.nombre ?? "");
  const [email, setEmail] = React.useState(cliente?.email ?? "");
  const [telefono, setTelefono] = React.useState(cliente?.telefono ?? "");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: API — PATCH /tienda/customers/me
    toast.success("Perfil actualizado");
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
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
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
      <Button type="submit">Guardar cambios</Button>
    </form>
  );
}
