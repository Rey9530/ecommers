"use client";

import { Suspense } from "react";
import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MailCheck, MailX, Loader2 } from "lucide-react";

import { verificarEmail } from "@/lib/api/auth";
import { AuthCard } from "@/components/account/auth-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type Estado = "cargando" | "ok" | "error";

function VerificarContenido() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [estado, setEstado] = React.useState<Estado>(
    token ? "cargando" : "error"
  );

  React.useEffect(() => {
    if (!token) return;
    let cancelado = false;
    verificarEmail(token)
      .then((r) => {
        if (!cancelado) setEstado(r.verificado ? "ok" : "error");
      })
      .catch(() => {
        if (!cancelado) setEstado("error");
      });
    return () => {
      cancelado = true;
    };
  }, [token]);

  if (estado === "cargando") {
    return (
      <AuthCard titulo="Verificando…">
        <div className="flex items-center justify-center py-6 text-muted-foreground">
          <Loader2 className="size-6 animate-spin" />
        </div>
      </AuthCard>
    );
  }

  const ok = estado === "ok";
  return (
    <AuthCard titulo={ok ? "Correo verificado" : "Enlace inválido"}>
      <div className="text-center">
        <span
          className={`mx-auto flex size-14 items-center justify-center rounded-full ${
            ok ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
          }`}
        >
          {ok ? <MailCheck className="size-7" /> : <MailX className="size-7" />}
        </span>
        <p className="mt-4 text-sm text-muted-foreground">
          {ok
            ? "Tu correo fue verificado correctamente. Ya puedes disfrutar de todas las funciones de tu cuenta."
            : "El enlace de verificación no es válido o expiró. Solicita uno nuevo desde tu cuenta."}
        </p>
        <Button asChild className="mt-6 w-full">
          <Link href={ok ? "/cuenta" : "/login"}>
            {ok ? "Ir a mi cuenta" : "Iniciar sesión"}
          </Link>
        </Button>
      </div>
    </AuthCard>
  );
}

export default function VerificarEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="container-page py-12">
          <Skeleton className="mx-auto h-64 w-full max-w-md" />
        </div>
      }
    >
      <VerificarContenido />
    </Suspense>
  );
}
