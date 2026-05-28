import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/account/auth-card";
import { RegisterForm } from "@/components/account/register-form";

export const metadata: Metadata = {
  title: "Crear cuenta",
  robots: { index: false },
};

export default function RegistroPage() {
  return (
    <AuthCard
      titulo="Crear cuenta"
      subtitulo="Regístrate para comprar más rápido y seguir tus pedidos."
      footer={
        <>
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Iniciar sesión
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthCard>
  );
}
