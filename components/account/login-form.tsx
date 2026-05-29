"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuthStore } from "@/lib/store/auth-store";
import { login as loginApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [cargando, setCargando] = React.useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    try {
      const resp = await loginApi(email, password);
      setSession(resp);
      toast.success("Bienvenida de nuevo");
      router.push("/cuenta");
    } catch (err) {
      toast.error("No se pudo iniciar sesión", {
        description:
          err instanceof ApiError ? err.message : "Inténtalo de nuevo.",
      });
    } finally {
      setCargando(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
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
          placeholder="tu@correo.com"
          autoComplete="email"
        />
      </div>
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <Label htmlFor="password">Contraseña</Label>
          <Link
            href="/recuperar"
            className="text-xs font-medium text-primary hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={cargando}>
        {cargando ? "Ingresando…" : "Iniciar sesión"}
      </Button>
    </form>
  );
}
