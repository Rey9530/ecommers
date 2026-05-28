import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

interface RatingStarsProps {
  /** Calificación 0..5 (admite decimales). */
  value: number;
  count?: number;
  size?: "sm" | "md";
  className?: string;
  showValue?: boolean;
}

export function RatingStars({
  value,
  count,
  size = "sm",
  className,
  showValue,
}: RatingStarsProps) {
  const px = size === "sm" ? "size-3.5" : "size-5";
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex" aria-label={`Calificación ${value} de 5`}>
        {[0, 1, 2, 3, 4].map((i) => {
          const filled = value >= i + 1;
          const half = !filled && value > i;
          return (
            <span key={i} className="relative">
              <Star className={cn(px, "text-muted-foreground/40")} />
              {(filled || half) && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: filled ? "100%" : "50%" }}
                >
                  <Star className={cn(px, "fill-warning text-warning")} />
                </span>
              )}
            </span>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium">{value.toFixed(1)}</span>
      )}
      {typeof count === "number" && (
        <span className="text-xs text-muted-foreground">({count})</span>
      )}
    </div>
  );
}
