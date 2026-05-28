"use client";

import * as React from "react";
import { MailCheck } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function RecoverForm() {
  const [email, setEmail] = React.useState("");
  const [enviado, setEnviado] = React.useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: API — POST /tienda/auth/solicitar-reset (no revela si el correo existe).
    setEnviado(true);
    toast.success("Revisa tu correo");
  }

  if (enviado) {
    return (
      <div className="text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-success/15 text-success">
          <MailCheck className="size-6" />
        </span>
        <p className="mt-4 text-sm text-muted-foreground">
          Si <strong className="text-foreground">{email}</strong> está
          registrado, te enviamos instrucciones para restablecer tu contraseña.
        </p>
      </div>
    );
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
        />
      </div>
      <Button type="submit" size="lg" className="w-full">
        Enviar instrucciones
      </Button>
    </form>
  );
}
