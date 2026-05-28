"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Heart,
  MapPin,
  User,
  LogOut,
  LogIn,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/auth-store";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";

const NAV = [
  { href: "/cuenta", label: "Resumen", icon: LayoutDashboard, exact: true },
  { href: "/cuenta/pedidos", label: "Mis pedidos", icon: Package },
  { href: "/cuenta/favoritos", label: "Favoritos", icon: Heart },
  { href: "/cuenta/direcciones", label: "Direcciones", icon: MapPin },
  { href: "/cuenta/perfil", label: "Perfil", icon: User },
];

export function AccountShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const cliente = useAuthStore((s) => s.cliente);
  const hydrated = useAuthStore((s) => s.hydrated);
  const logout = useAuthStore((s) => s.logout);

  if (!hydrated) {
    return (
      <div className="container-page py-8">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // Favoritos es público (la wishlist vive en el cliente, sirve a invitados).
  const esPublica = pathname.startsWith("/cuenta/favoritos");

  if (!cliente && !esPublica) {
    return (
      <div className="container-page py-12">
        <EmptyState
          icon={LogIn}
          title="Inicia sesión"
          description="Necesitas una cuenta para ver esta sección."
        >
          <Button asChild>
            <Link href="/login">Iniciar sesión</Link>
          </Button>
        </EmptyState>
      </div>
    );
  }

  if (!cliente && esPublica) {
    return (
      <div className="container-page py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed bg-muted/30 p-4 text-sm">
          <span className="text-muted-foreground">
            Estás como invitado. Inicia sesión para guardar tus favoritos en tu
            cuenta.
          </span>
          <Button asChild size="sm" variant="outline">
            <Link href="/login">Iniciar sesión</Link>
          </Button>
        </div>
        {children}
      </div>
    );
  }

  if (!cliente) return null;

  return (
    <div className="container-page py-8">
      <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="mb-4 rounded-xl border bg-card p-4">
            <p className="text-sm font-medium">{cliente.nombre}</p>
            <p className="truncate text-xs text-muted-foreground">
              {cliente.email}
            </p>
          </div>
          <nav className="space-y-1">
            {NAV.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <LogOut className="size-4" />
              Cerrar sesión
            </button>
          </nav>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
