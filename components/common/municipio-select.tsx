"use client";

import * as React from "react";

import type { Departamento, Municipio } from "@/types";
import { getDepartamentos, getMunicipios } from "@/lib/api/geo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface MunicipioSelectProps {
  value: number | null;
  onChange: (idMunicipio: number | null) => void;
}

/** Cascada Departamento → Municipio que devuelve el `id_municipio` real. */
export function MunicipioSelect({ value, onChange }: MunicipioSelectProps) {
  const [departamentos, setDepartamentos] = React.useState<Departamento[]>([]);
  const [municipios, setMunicipios] = React.useState<Municipio[]>([]);
  const [depto, setDepto] = React.useState<number | null>(null);
  const [resuelto, setResuelto] = React.useState(false);

  // Cargar departamentos al montar.
  React.useEffect(() => {
    let cancel = false;
    getDepartamentos().then((d) => {
      if (!cancel) setDepartamentos(d);
    });
    return () => {
      cancel = true;
    };
  }, []);

  // Si llega un id_municipio inicial, resolver su departamento una sola vez.
  React.useEffect(() => {
    if (resuelto || !value) return;
    let cancel = false;
    getMunicipios().then((todos) => {
      if (cancel) return;
      const m = todos.find((x) => x.id_municipio === value);
      if (m) setDepto(m.id_departamento);
      setResuelto(true);
    });
    return () => {
      cancel = true;
    };
  }, [value, resuelto]);

  // Cargar municipios del departamento seleccionado.
  React.useEffect(() => {
    if (!depto) return;
    let cancel = false;
    getMunicipios(depto).then((m) => {
      if (!cancel) setMunicipios(m);
    });
    return () => {
      cancel = true;
    };
  }, [depto]);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <Label className="mb-1.5 block">Departamento</Label>
        <Select
          value={depto ? String(depto) : undefined}
          onValueChange={(v) => {
            setDepto(Number(v));
            setMunicipios([]);
            onChange(null);
          }}
        >
          <SelectTrigger aria-label="Departamento">
            <SelectValue placeholder="Selecciona…" />
          </SelectTrigger>
          <SelectContent>
            {departamentos.map((d) => (
              <SelectItem key={d.id_departamento} value={String(d.id_departamento)}>
                {d.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="mb-1.5 block">Municipio</Label>
        <Select
          value={value ? String(value) : undefined}
          onValueChange={(v) => onChange(Number(v))}
          disabled={!depto}
        >
          <SelectTrigger aria-label="Municipio">
            <SelectValue placeholder={depto ? "Selecciona…" : "Elige departamento"} />
          </SelectTrigger>
          <SelectContent>
            {municipios.map((m) => (
              <SelectItem key={m.id_municipio} value={String(m.id_municipio)}>
                {m.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
