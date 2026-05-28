"use client";

import * as React from "react";
import { Star, BadgeCheck, PenLine } from "lucide-react";
import { toast } from "sonner";

import { cn, formatDate } from "@/lib/utils";
import type { Resena } from "@/types";
import { RatingStars } from "@/components/common/rating-stars";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ProductReviews({
  idCatalogo,
  resenasIniciales,
}: {
  idCatalogo: number;
  resenasIniciales: Resena[];
}) {
  const [resenas, setResenas] = React.useState<Resena[]>(resenasIniciales);
  const [abierto, setAbierto] = React.useState(false);
  const [calif, setCalif] = React.useState(5);
  const [autor, setAutor] = React.useState("");
  const [titulo, setTitulo] = React.useState("");
  const [comentario, setComentario] = React.useState("");

  const promedio =
    resenas.length > 0
      ? resenas.reduce((a, r) => a + r.calificacion, 0) / resenas.length
      : 0;

  const distribucion = [5, 4, 3, 2, 1].map((n) => ({
    estrellas: n,
    cantidad: resenas.filter((r) => r.calificacion === n).length,
  }));

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    // TODO: API — el backend no expone reseñas aún; se guarda solo en cliente.
    const nueva: Resena = {
      id: Date.now(),
      id_catalogo: idCatalogo,
      autor: autor || "Anónimo",
      calificacion: calif,
      titulo,
      comentario,
      fecha: new Date().toISOString(),
      compra_verificada: false,
    };
    setResenas((prev) => [nueva, ...prev]);
    setAbierto(false);
    setAutor("");
    setTitulo("");
    setComentario("");
    setCalif(5);
    toast.success("¡Gracias por tu reseña!", {
      description: "Se publicará tras moderación.",
    });
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
                {resenas.length} reseña(s)
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
                      width: `${resenas.length ? (d.cantidad / resenas.length) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="w-6 text-right text-muted-foreground">
                  {d.cantidad}
                </span>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setAbierto((v) => !v)}
          >
            <PenLine /> Escribir una reseña
          </Button>
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
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="autor" className="mb-1.5 block">
                    Nombre
                  </Label>
                  <Input
                    id="autor"
                    value={autor}
                    onChange={(e) => setAutor(e.target.value)}
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <Label htmlFor="titulo" className="mb-1.5 block">
                    Título
                  </Label>
                  <Input
                    id="titulo"
                    required
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Resume tu experiencia"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="comentario" className="mb-1.5 block">
                  Comentario
                </Label>
                <Textarea
                  id="comentario"
                  required
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Cuéntanos qué te pareció…"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setAbierto(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Publicar reseña</Button>
              </div>
            </form>
          )}

          {resenas.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aún no hay reseñas. ¡Sé el primero en opinar!
            </p>
          ) : (
            <ul className="divide-y">
              {resenas.map((r) => (
                <li key={r.id} className="py-5">
                  <div className="flex items-center justify-between">
                    <RatingStars value={r.calificacion} />
                    <span className="text-xs text-muted-foreground">
                      {formatDate(r.fecha)}
                    </span>
                  </div>
                  <h3 className="mt-2 font-medium">{r.titulo}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {r.comentario}
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    {r.autor}
                    {r.compra_verificada && (
                      <span className="inline-flex items-center gap-1 text-success">
                        <BadgeCheck className="size-3.5" /> Compra verificada
                      </span>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
