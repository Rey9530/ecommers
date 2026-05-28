import Link from "next/link";
import { Sparkles } from "lucide-react";

interface AuthCardProps {
  titulo: string;
  subtitulo?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthCard({ titulo, subtitulo, children, footer }: AuthCardProps) {
  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Sparkles className="size-5" />
            </span>
            <span className="font-display text-xl font-semibold">Bolsa Bonita</span>
          </Link>
        </div>
        <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          <h1 className="font-display text-2xl font-semibold">{titulo}</h1>
          {subtitulo && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitulo}</p>
          )}
          <div className="mt-6">{children}</div>
        </div>
        {footer && (
          <p className="mt-4 text-center text-sm text-muted-foreground">{footer}</p>
        )}
      </div>
    </div>
  );
}
