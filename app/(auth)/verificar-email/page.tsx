"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MailCheck, MailX } from "lucide-react";

import { AuthCard } from "@/components/account/auth-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function VerificarContenido() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  // TODO: API — GET /tienda/auth/verificar-email?token= → { verificado: true }
  const ok = !!token;

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
