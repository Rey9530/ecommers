"use client";

import * as React from "react";
import Link from "next/link";
import { Star, PenLine } from "lucide-react";
import { toast } from "sonner";

import { cn, formatDate } from "@/lib/utils";
import type { ResenasResponse } from "@/types";
import { crearResena } from "@/lib/api/resenas";
import { useAuthStore } from "@/lib/store/auth-store";
import { ApiError } from "@/lib/api/client";
import { RatingStars } from "@/components/common/rating-stars";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ProductReviews({
  slug,
  inicial,
}: {
  slug: string;
  inicial: ResenasResponse;
}) {
  const token = useAuthStore((s) => s.token);
  const [abierto, setAbierto] = React.useState(false);
  const [calif, setCalif] = React.useState(5);
  const [comentario, setComentario] = React.useState("");
  const [enviando, setEnviando] = React.useState(false);
  const [enviada, setEnviada] = React.useState(false);

  const { promedio, total, resenas } = inicial;

  const distribucion = [5, 4, 3, 2, 1].map((n) => ({
    estrellas: n,
    cantidad: resenas.filter((r) => r.calificacion === n).length,
  }));

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      toast.error("Inicia sesión para reseñar");
      return;
    }
    setEnviando(true);
    try {
      const r = await crearResena(slug, { calificacion: calif, comentario }, token);
      setEnviada(true);
      setAbierto(false);
      setComentario("");
      setCalif(5);
      toast.success("¡Gracias por tu reseña!", {
        description: r.mensaje ?? "Se publicará tras moderación.",
      });
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.status === 403
            ? "Solo puedes reseñar productos que has comprado."
            : err.message
          : "No se pudo enviar la reseña.";
      toast.error("No se pudo enviar", { description: msg });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="border-t pt-10">
      <h2 className="font-display text-2xl font-semibold">Reseñas</h2>

      <div className="mt-6 grid gap-8 md:grid-cols-[18rem_1fr]">
        {/* Resumen */}
        <div className="space-y-4">
          <div className="flex items-end gap-3">
            <span className="text-5xl font-semibold">{promedio.toFixed(1)}</span>
            <div className="pb-1">
              <RatingStars value={promedio} size="md" />
              <p className="mt-1 text-sm text-muted-foreground">
                {total} reseña(s)
              </p>
            </div>
          </div>
          <div className="space-y-1.5">
            {distribucion.map((d) => (
              <div key={d.estrellas} className="flex items-center gap-2 text-sm">
                <span className="flex w-10 items-center gap-1 text-muted-foreground">
                  {d.estrellas} <Star className="size-3 fill-warning text-warning" />
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-warning"
                    style={{
                      width: `${total ? (d.cantidad / total) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="w-6 text-right text-muted-foreground">
                  {d.cantidad}
                </span>
              </div>
            ))}
          </div>
          {token ? (
            <Button
              variant="outline"
              className="w-full"
              disabled={enviada}
              onClick={() => setAbierto((v) => !v)}
            >
              <PenLine /> {enviada ? "Reseña enviada" : "Escribir una reseña"}
            </Button>
          ) : (
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">Inicia sesión para reseñar</Link>
            </Button>
          )}
        </div>

        {/* Formulario + lista */}
        <div className="space-y-6">
          {abierto && (
            <form
              onSubmit={enviar}
              className="space-y-4 rounded-xl border bg-card p-5"
            >
              <div>
                <Label className="mb-1.5 block">Tu calificación</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setCalif(n)}
                      aria-label={`${n} estrellas`}
                    >
                      <Star
                        className={cn(
                          "size-6 transition-colors",
                          n <= calif
                            ? "fill-warning text-warning"
                            : "text-muted-foreground/40"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="comentario" className="mb-1.5 block">
                  Comentario
                </Label>
                <Textarea
                  id="comentario"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Cuéntanos qué te pareció…"
                  maxLength={1000}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setAbierto(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={enviando}>
                  {enviando ? "Enviando…" : "Publicar reseña"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Solo puedes reseñar productos que has comprado. Tu reseña pasa por
                moderación antes de publicarse.
              </p>
            </form>
          )}

          {resenas.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aún no hay reseñas. ¡Sé el primero en opinar!
            </p>
          ) : (
            <ul className="divide-y">
              {resenas.map((r) => (
                <li key={r.id_resena} className="py-5">
                  <div className="flex items-center justify-between">
                    <RatingStars value={r.calificacion} />
                    <span className="text-xs text-muted-foreground">
                      {formatDate(r.fecha)}
                    </span>
                  </div>
                  {r.comentario && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {r.comentario}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">{r.nombre}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
