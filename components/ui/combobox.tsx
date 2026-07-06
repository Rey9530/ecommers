"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";

export interface ComboboxOption {
  /** Valor único (lo que se devuelve al onChange). */
  value: string;
  /** Texto que se muestra en la lista y se usa para la búsqueda. */
  label: string;
  /** Texto secundario opcional debajo del label. */
  hint?: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  /** aria-label del campo (importante cuando el placeholder no es descriptivo). */
  ariaLabel?: string;
  /** Deshabilita el filtrado y muestra todas las opciones. Útil con listas pequeñas. */
  disableFilter?: boolean;
}

/**
 * Select con Input de búsqueda integrado. Sin dependencias externas
 * (no usa popover/command); usa un panel posicionado absoluto.
 *
 * - Click en el trigger → abre el panel y enfoca el Input.
 * - Escribir en el Input → filtra la lista por `label` (case-insensitive).
 * - Click en una opción → selecciona y cierra.
 * - Click fuera o Escape → cierra sin seleccionar.
 */
export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Selecciona una opción",
  emptyMessage = "No hay resultados.",
  disabled = false,
  ariaLabel,
  disableFilter = false,
}: ComboboxProps) {
  const [abierto, setAbierto] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Cerrar al hacer click fuera.
  React.useEffect(() => {
    if (!abierto) return;
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setAbierto(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [abierto]);

  // Escape y Enter para cerrar / seleccionar el primero.
  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setAbierto(false);
      setQuery("");
    } else if (e.key === "Enter" && filtrados.length > 0) {
      onChange(filtrados[0].value);
      setAbierto(false);
      setQuery("");
    }
  }

  const filtrados = React.useMemo(() => {
    if (disableFilter || !query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        (o.hint?.toLowerCase().includes(q) ?? false),
    );
  }, [options, query, disableFilter]);

  const seleccionado = options.find((o) => o.value === value);

  function abrir() {
    if (disabled) return;
    setAbierto(true);
    // Enfocar el input en el siguiente tick (después de que se monte).
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function seleccionar(v: string) {
    onChange(v);
    setAbierto(false);
    setQuery("");
  }

  function limpiar() {
    onChange("");
    setAbierto(false);
    setQuery("");
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={abrir}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={abierto}
        aria-label={ariaLabel}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors",
          "focus:outline-none focus:ring-1 focus:ring-ring",
          disabled && "cursor-not-allowed opacity-50",
          !disabled && "hover:bg-accent/40",
        )}
      >
        <span
          className={cn(
            "truncate text-left",
            !seleccionado && "text-muted-foreground",
          )}
        >
          {seleccionado ? seleccionado.label : placeholder}
        </span>
        <span className="flex shrink-0 items-center gap-1">
          {seleccionado && !disabled && (
            <span
              role="button"
              tabIndex={-1}
              aria-label="Limpiar selección"
              onClick={(e) => {
                e.stopPropagation();
                limpiar();
              }}
              className="rounded p-0.5 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <X className="size-3.5" />
            </span>
          )}
          <ChevronsUpDown className="size-4 text-muted-foreground" />
        </span>
      </button>

      {abierto && (
        <div
          role="listbox"
          className="absolute left-0 right-0 z-50 mt-1 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md"
        >
          {!disableFilter && (
            <div className="border-b p-2">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Buscar…"
                aria-label="Buscar en la lista"
                className="h-8 w-full rounded-sm border border-input bg-background px-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
              />
            </div>
          )}
          <div className="max-h-60 overflow-y-auto p-1">
            {filtrados.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </p>
            ) : (
              filtrados.map((opt) => {
                const activo = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={activo}
                    onClick={() => seleccionar(opt.value)}
                    className={cn(
                      "flex w-full items-start gap-2 rounded-sm px-2 py-1.5 text-left text-sm transition-colors",
                      activo
                        ? "bg-primary/10 text-foreground"
                        : "hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <Check
                      className={cn(
                        "mt-0.5 size-4 shrink-0",
                        activo ? "opacity-100 text-primary" : "opacity-0",
                      )}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{opt.label}</span>
                      {opt.hint && (
                        <span className="block truncate text-xs text-muted-foreground">
                          {opt.hint}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}