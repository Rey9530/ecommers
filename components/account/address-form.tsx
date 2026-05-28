"use client";

import * as React from "react";

import type { Direccion, TipoDireccion } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface AddressFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inicial?: Direccion | null;
  onSave: (dir: Direccion) => void;
}

export function AddressForm({
  open,
  onOpenChange,
  inicial,
  onSave,
}: AddressFormProps) {
  const [tipo, setTipo] = React.useState<TipoDireccion>("ENVIO");
  const [nombre, setNombre] = React.useState("");
  const [telefono, setTelefono] = React.useState("");
  const [direccion, setDireccion] = React.useState("");
  const [municipio, setMunicipio] = React.useState("");
  const [referencia, setReferencia] = React.useState("");
  const [predeterminada, setPredeterminada] = React.useState(false);

  // Carga los valores al abrir el diálogo (ajuste de estado en render, sin efecto).
  const [estabaAbierto, setEstabaAbierto] = React.useState(false);
  if (open && !estabaAbierto) {
    setEstabaAbierto(true);
    setTipo(inicial?.tipo ?? "ENVIO");
    setNombre(inicial?.nombre_contacto ?? "");
    setTelefono(inicial?.telefono ?? "");
    setDireccion(inicial?.direccion ?? "");
    setMunicipio(inicial?.municipio_nombre ?? "");
    setReferencia(inicial?.referencia ?? "");
    setPredeterminada(inicial?.es_predeterminada ?? false);
  } else if (!open && estabaAbierto) {
    setEstabaAbierto(false);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: API — POST/PATCH /tienda/direcciones
    onSave({
      id_direccion: inicial?.id_direccion ?? Date.now(),
      tipo,
      nombre_contacto: nombre,
      telefono,
      id_municipio: inicial?.id_municipio ?? null,
      municipio_nombre: municipio,
      direccion,
      referencia,
      es_predeterminada: predeterminada,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {inicial ? "Editar dirección" : "Nueva dirección"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <RadioGroup
            value={tipo}
            onValueChange={(v) => setTipo(v as TipoDireccion)}
            className="flex gap-4"
          >
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <RadioGroupItem value="ENVIO" /> Envío
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <RadioGroupItem value="FACTURACION" /> Facturación
            </label>
          </RadioGroup>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="mb-1.5 block">Nombre de contacto</Label>
              <Input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
            <div>
              <Label className="mb-1.5 block">Teléfono</Label>
              <Input value={telefono} onChange={(e) => setTelefono(e.target.value)} />
            </div>
          </div>
          <div>
            <Label className="mb-1.5 block">Dirección</Label>
            <Input value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="mb-1.5 block">Municipio</Label>
              <Input value={municipio} onChange={(e) => setMunicipio(e.target.value)} />
            </div>
            <div>
              <Label className="mb-1.5 block">Referencia</Label>
              <Input value={referencia} onChange={(e) => setReferencia(e.target.value)} />
            </div>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <Checkbox
              checked={predeterminada}
              onCheckedChange={(c) => setPredeterminada(c === true)}
            />
            Usar como predeterminada
          </label>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
