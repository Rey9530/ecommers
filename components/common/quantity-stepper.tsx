"use client";

import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
  size?: "sm" | "md";
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
  size = "md",
}: QuantityStepperProps) {
  const dim = size === "sm" ? "size-8" : "size-10";
  const set = (v: number) => onChange(Math.max(min, Math.min(max, v)));

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border border-input",
        className
      )}
    >
      <button
        type="button"
        onClick={() => set(value - 1)}
        disabled={value <= min}
        aria-label="Disminuir cantidad"
        className={cn(
          dim,
          "flex items-center justify-center rounded-l-md text-muted-foreground transition-colors hover:bg-accent disabled:opacity-40 disabled:hover:bg-transparent"
        )}
      >
        <Minus className="size-4" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        min={min}
        max={max}
        onChange={(e) => set(parseInt(e.target.value, 10) || min)}
        aria-label="Cantidad"
        className="h-full w-10 border-x border-input bg-transparent text-center text-sm font-medium outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => set(value + 1)}
        disabled={value >= max}
        aria-label="Aumentar cantidad"
        className={cn(
          dim,
          "flex items-center justify-center rounded-r-md text-muted-foreground transition-colors hover:bg-accent disabled:opacity-40 disabled:hover:bg-transparent"
        )}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
