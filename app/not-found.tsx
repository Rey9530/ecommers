import Link from "next/link";
import { Search, Home } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="font-display text-6xl font-semibold text-primary">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold">
        Página no encontrada
      </h1>
      <p className="mt-2 max-w-sm text-muted-foreground">
        Lo sentimos, no encontramos lo que buscas. Quizá fue movido o ya no
        existe.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">
            <Home /> Ir al inicio
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/productos">
            <Search /> Ver productos
          </Link>
        </Button>
      </div>
    </div>
  );
}
