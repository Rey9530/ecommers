"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuthStore } from "@/lib/store/auth-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export function RegisterForm() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const [nombre, setNombre] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [telefono, setTelefono] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [acepta, setAcepta] = React.useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!acepta) {
      toast.error("Debes aceptar los términos para continuar.");
      return;
    }
    // TODO: API — POST /tienda/auth/registro → guardar Bearer + verificar email.
    register(nombre, email);
    toast.success("¡Cuenta creada!", {
      description: "Te enviamos un correo para verificar tu cuenta.",
    });
    router.push("/cuenta");
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label htmlFor="nombre" className="mb-1.5 block">
          Nombre completo
        </Label>
        <Input
          id="nombre"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          autoComplete="name"
        />
      </div>
      <div>
        <Label htmlFor="email" className="mb-1.5 block">
          Correo electrónico
        </Label>
        <Input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>
      <div>
        <Label htmlFor="telefono" className="mb-1.5 block">
          Teléfono
        </Label>
        <Input
          id="telefono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="7777-7777"
          autoComplete="tel"
        />
      </div>
      <div>
        <Label htmlFor="password" className="mb-1.5 block">
          Contraseña
        </Label>
        <Input
          id="password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
      </div>
      <label className="flex cursor-pointer items-start gap-2 text-sm">
        <Checkbox
          checked={acepta}
          onCheckedChange={(c) => setAcepta(c === true)}
          className="mt-0.5"
        />
        <span className="text-muted-foreground">
          Acepto los términos y condiciones y la política de privacidad.
        </span>
      </label>
      <Button type="submit" size="lg" className="w-full">
        Crear cuenta
      </Button>
    </form>
  );
}
