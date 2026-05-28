import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/account/auth-card";
import { LoginForm } from "@/components/account/login-form";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <AuthCard
      titulo="Iniciar sesión"
      subtitulo="Accede a tu cuenta para ver pedidos y direcciones."
      footer={
        <>
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="font-medium text-primary hover:underline">
            Crear cuenta
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}
