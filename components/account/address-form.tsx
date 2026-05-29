"use client";

import * as React from "react";

import type { Direccion, TipoDireccion } from "@/types";
import type { DireccionInput } from "@/lib/api/direcciones";
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
import { MunicipioSelect } from "@/components/common/municipio-select";

interface AddressFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inicial?: Direccion | null;
  onSave: (input: DireccionInput, id?: number) => void;
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
  const [idMunicipio, setIdMunicipio] = React.useState<number | null>(null);
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
    setIdMunicipio(inicial?.id_municipio ?? null);
    setReferencia(inicial?.referencia ?? "");
    setPredeterminada(inicial?.es_predeterminada ?? false);
  } else if (!open && estabaAbierto) {
    setEstabaAbierto(false);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSave(
      {
        tipo,
        nombre_contacto: nombre,
        telefono,
        id_municipio: idMunicipio,
        direccion,
        referencia,
        es_predeterminada: predeterminada,
      },
      inicial?.id_direccion
    );
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
          <MunicipioSelect value={idMunicipio} onChange={setIdMunicipio} />
          <div>
            <Label className="mb-1.5 block">Dirección</Label>
            <Input value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
          </div>
          <div>
            <Label className="mb-1.5 block">Referencia</Label>
            <Input value={referencia} onChange={(e) => setReferencia(e.target.value)} />
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
