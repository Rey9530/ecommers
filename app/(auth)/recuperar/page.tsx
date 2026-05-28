import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/account/auth-card";
import { RecoverForm } from "@/components/account/recover-form";

export const metadata: Metadata = {
  title: "Recuperar contraseña",
  robots: { index: false },
};

export default function RecuperarPage() {
  return (
    <AuthCard
      titulo="Recuperar contraseña"
      subtitulo="Te enviaremos un enlace para restablecerla."
      footer={
        <Link href="/login" className="font-medium text-primary hover:underline">
          Volver a iniciar sesión
        </Link>
      }
    >
      <RecoverForm />
    </AuthCard>
  );
}
