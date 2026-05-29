"use client";

import * as React from "react";
import { toast } from "sonner";

import { suscribirNewsletter } from "@/lib/api/newsletter";
import { ApiError } from "@/lib/api/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  const [email, setEmail] = React.useState("");
  const [enviando, setEnviando] = React.useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setEnviando(true);
    try {
      await suscribirNewsletter(email);
      toast.success("¡Listo!", {
        description: "Te suscribiste al boletín de Bolsa Bonita.",
      });
      setEmail("");
    } catch (err) {
      toast.error("No se pudo suscribir", {
        description: err instanceof ApiError ? err.message : undefined,
      });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <Input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@correo.com"
        aria-label="Correo para el boletín"
      />
      <Button type="submit" disabled={enviando}>
        {enviando ? "…" : "Suscribir"}
      </Button>
    </form>
  );
}
