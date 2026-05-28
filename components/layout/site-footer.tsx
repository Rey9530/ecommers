import Link from "next/link";
import { Sparkles, Camera, MessageCircle, Mail, Phone } from "lucide-react";

import { buildCategoriaTree, categoriaSlug } from "@/lib/categorias";
import { NewsletterForm } from "@/components/layout/newsletter-form";

export function SiteFooter() {
  const categorias = buildCategoriaTree();

  return (
    <footer className="mt-16 border-t bg-muted/30">
      <div className="container-page grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Sparkles className="size-5" />
            </span>
            <span className="font-display text-xl font-semibold">
              Bolsa Bonita
            </span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Bolsas, cajas y detalles decorativos para que cada regalo se vea
            especial. Mayoreo y menudeo.
          </p>
          <div className="mt-4 flex gap-2">
            <a
              href="#"
              aria-label="WhatsApp"
              className="flex size-9 items-center justify-center rounded-full border transition-colors hover:bg-accent"
            >
              <MessageCircle className="size-4" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="flex size-9 items-center justify-center rounded-full border transition-colors hover:bg-accent"
            >
              <Camera className="size-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Categorías</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {categorias.slice(0, 6).map((c) => (
              <li key={c.id_categoria}>
                <Link
                  href={`/categoria/${categoriaSlug(c)}`}
                  className="transition-colors hover:text-foreground"
                >
                  {c.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Ayuda</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {[
              { href: "/nosotros", label: "Quiénes somos" },
              { href: "/ayuda", label: "Preguntas frecuentes" },
              { href: "/envios", label: "Envíos y entregas" },
              { href: "/devoluciones", label: "Devoluciones" },
              { href: "/terminos", label: "Términos y condiciones" },
              { href: "/privacidad", label: "Política de privacidad" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="transition-colors hover:text-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Mantente al día</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Recibe ofertas y nuevos diseños en tu correo.
          </p>
          <div className="mt-3">
            <NewsletterForm />
          </div>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Phone className="size-4" /> 2222-2222
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4" /> hola@bolsabonita.sv
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-4 text-xs text-muted-foreground sm:flex-row">
          <p>© 2026 Bolsa Bonita. Todos los derechos reservados.</p>
          <p>Precios en USD · IVA incluido</p>
        </div>
      </div>
    </footer>
  );
}
