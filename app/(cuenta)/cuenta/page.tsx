"use client";

import * as React from "react";
import Link from "next/link";
import { Package, Heart, MapPin, User, ChevronRight } from "lucide-react";

import { formatDate, formatPrice } from "@/lib/utils";
import type { Pedido } from "@/types";
import { useAuthStore } from "@/lib/store/auth-store";
import { getMisPedidos } from "@/lib/api/pedidos";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { Skeleton } from "@/components/ui/skeleton";

const ACCESOS = [
  { href: "/cuenta/pedidos", label: "Mis pedidos", desc: "Historial y seguimiento", icon: Package },
  { href: "/cuenta/favoritos", label: "Favoritos", desc: "Tus productos guardados", icon: Heart },
  { href: "/cuenta/direcciones", label: "Direcciones", desc: "Envío y facturación", icon: MapPin },
  { href: "/cuenta/perfil", label: "Perfil", desc: "Tus datos personales", icon: User },
];

export default function CuentaPage() {
  const token = useAuthStore((s) => s.token);
  const cliente = useAuthStore((s) => s.cliente);
  const [recientes, setRecientes] = React.useState<Pedido[]>([]);
  const [cargando, setCargando] = React.useState(true);

  React.useEffect(() => {
    if (!token) return;
    let cancel = false;
    getMisPedidos(token)
      .then((p) => {
        if (!cancel) setRecientes(p.slice(0, 2));
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancel) setCargando(false);
      });
    return () => {
      cancel = true;
    };
  }, [token]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">
          Hola{cliente ? `, ${cliente.nombre.split(" ")[0]}` : ""}
        </h1>
        <p className="text-muted-foreground">
          Gestiona tus pedidos, direcciones y preferencias.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {ACCESOS.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="group flex items-center gap-3 rounded-xl border bg-card p-4 transition-shadow hover:shadow-md"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <a.icon className="size-5" />
            </span>
            <span className="flex-1">
              <span className="block font-medium">{a.label}</span>
              <span className="block text-sm text-muted-foreground">{a.desc}</span>
            </span>
            <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Pedidos recientes</h2>
          <Link href="/cuenta/pedidos" className="text-sm font-medium text-primary hover:underline">
            Ver todos
          </Link>
        </div>
        {cargando ? (
          <Skeleton className="h-28 w-full rounded-xl" />
        ) : recientes.length === 0 ? (
          <p className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
            Aún no tienes pedidos.
          </p>
        ) : (
          <div className="divide-y rounded-xl border bg-card">
            {recientes.map((p) => (
              <Link
                key={p.id_pedido}
                href={`/cuenta/pedidos/${p.numero_pedido}`}
                className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-accent/50"
              >
                <div>
                  <p className="font-medium">{p.numero_pedido}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(p.fecha_creacion)} · {p.items.length} artículo(s)
                  </p>
                </div>
                <div className="text-right">
                  <OrderStatusBadge estado={p.estado} />
                  <p className="mt-1 text-sm font-medium">{formatPrice(p.total)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
