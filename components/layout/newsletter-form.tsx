"use client";

import * as React from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  const [email, setEmail] = React.useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    // TODO: API — integrar con servicio de email marketing.
    toast.success("¡Listo!", {
      description: "Te suscribiste al boletín de Bolsa Bonita.",
    });
    setEmail("");
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
      <Button type="submit">Suscribir</Button>
    </form>
  );
}
