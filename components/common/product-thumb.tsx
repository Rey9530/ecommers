import Image from "next/image";
import { Gift } from "lucide-react";

import { cn } from "@/lib/utils";

interface ProductThumbProps {
  nombre: string;
  /** Semilla para variar el color del placeholder (normalmente id_catalogo). */
  seed: number;
  /** Índice de imagen en la galería, varía el tono. */
  index?: number;
  /** URL real de imagen; si se provee, se usa next/image. */
  src?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * Imagen de producto. Mientras no haya imágenes reales del backend
 * (`imagen` / `imagenes[].path`), renderiza un placeholder decorativo
 * y de marca. Cuando `src` es una URL real, usa next/image.
 */
export function ProductThumb({
  nombre,
  seed,
  index = 0,
  src,
  className,
  sizes = "(max-width: 768px) 50vw, 25vw",
  priority,
}: ProductThumbProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={nombre}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", className)}
      />
    );
  }

  const hue = (seed * 47 + index * 35) % 360;
  const hue2 = (hue + 35) % 360;

  return (
    <div
      aria-hidden
      className={cn(
        "flex size-full flex-col items-center justify-center gap-3 p-6 text-center",
        className
      )}
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 48% 90%), hsl(${hue2} 52% 82%))`,
      }}
    >
      <Gift
        className="size-10 opacity-60"
        style={{ color: `hsl(${hue} 45% 35%)` }}
      />
      <span
        className="line-clamp-2 max-w-[80%] text-xs font-medium"
        style={{ color: `hsl(${hue} 40% 28%)` }}
      >
        {nombre}
      </span>
    </div>
  );
}
