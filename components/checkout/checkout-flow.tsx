"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShoppingBag,
  Truck,
  Store,
  Landmark,
  HandCoins,
  ArrowRight,
  Upload,
  FileText,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import {
  useCartStore,
  selectSubtotal,
} from "@/lib/store/cart-store";
import { useAuthStore } from "@/lib/store/auth-store";
import { useOrderStore } from "@/lib/store/order-store";
import { getSessionId } from "@/lib/session";
import {
  sincronizarCarrito,
  checkout as checkoutApi,
  checkoutConComprobante,
  aplicarCupon,
  quitarCupon,
} from "@/lib/api/pedidos";
import { getEncomendistas } from "@/lib/api/encomendistas";
import { ApiError } from "@/lib/api/client";
import type {
  CheckoutDto,
  Encomendista,
  MetodoEntrega,
  MetodoPago,
} from "@/types";

import { OrderSummary } from "@/components/checkout/order-summary";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/combobox";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";

function Section({
  numero,
  titulo,
  children,
}: {
  numero: number;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border bg-card p-5">
      <h2 className="mb-4 flex items-center gap-2 font-semibold">
        <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
          {numero}
        </span>
        {titulo}
      </h2>
      {children}
    </section>
  );
}

function OptionCard({
  active,
  onClick,
  icon: Icon,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Truck;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-1 items-start gap-3 rounded-lg border p-3 text-left transition-colors",
        active ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-accent"
      )}
    >
      <Icon className="mt-0.5 size-5 text-primary" />
      <span>
        <span className="block text-sm font-medium">{title}</span>
        <span className="block text-xs text-muted-foreground">{desc}</span>
      </span>
    </button>
  );
}

export function CheckoutFlow() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore(selectSubtotal);
  const hydrated = useCartStore((s) => s.hydrated);
  const clear = useCartStore((s) => s.clear);
  const cliente = useAuthStore((s) => s.cliente);
  const token = useAuthStore((s) => s.token);
  const authHydrated = useAuthStore((s) => s.hydrated);
  const setUltimo = useOrderStore((s) => s.setUltimo);

  const logueado = authHydrated && !!cliente;

  // Catálogo público de encomendistas (transportistas activos con sus direcciones).
  const [encomendistas, setEncomendistas] = React.useState<Encomendista[]>([]);

  // Estado del formulario
  const [email, setEmail] = React.useState("");
  const [telefono, setTelefono] = React.useState("");
  const [entrega, setEntrega] = React.useState<MetodoEntrega>("ENVIO");
  const [idTransportista, setIdTransportista] = React.useState<number | null>(null);
  const [idDireccionEncomienda, setIdDireccionEncomienda] = React.useState<number | null>(null);
  const [fechaEntrega, setFechaEntrega] = React.useState("");
  const [envioNombre, setEnvioNombre] = React.useState("");
  const [pago, setPago] = React.useState<MetodoPago>("TRANSFERENCIA");
  const [comprobante, setComprobante] = React.useState<File | null>(null);
  const [comprobanteError, setComprobanteError] = React.useState<string | null>(null);
  const comprobanteRef = React.useRef<HTMLInputElement>(null);
  const [nota, setNota] = React.useState("");
  const [terminos, setTerminos] = React.useState(false);
  const [enviando, setEnviando] = React.useState(false);
  const [cupon, setCupon] = React.useState("");
  const [cuponAplicado, setCuponAplicado] = React.useState<string | null>(null);
  const [descuento, setDescuento] = React.useState(0);
  const [aplicandoCupon, setAplicandoCupon] = React.useState(false);

  // Prefill de contacto al cargar la sesión (ajuste de estado en render, sin efecto).
  const [prefillId, setPrefillId] = React.useState<number | null>(null);
  if (logueado && cliente && cliente.id_cliente !== prefillId) {
    setPrefillId(cliente.id_cliente);
    setEmail(cliente.email);
    setTelefono(cliente.telefono ?? "");
  }

  // Cargar encomendistas activos (público, sin auth).
  React.useEffect(() => {
    let cancel = false;
    getEncomendistas()
      .then((res) => {
        if (cancel) return;
        setEncomendistas(res.data);
      })
      .catch(() => undefined);
    return () => {
      cancel = true;
    };
  }, []);

  // Al cambiar de encomendista se limpia la dirección seleccionada.
  React.useEffect(() => {
    setIdDireccionEncomienda(null);
  }, [idTransportista]);

  // Al cambiar a RETIRO se descarta el nombre de quien recibe.
  React.useEffect(() => {
    if (entrega !== "ENVIO") setEnvioNombre("");
  }, [entrega]);

  // Si cambia a CONTRA_ENTREGA, descartamos el comprobante (ya no aplica).
  React.useEffect(() => {
    if (pago !== "TRANSFERENCIA") {
      setComprobante(null);
      setComprobanteError(null);
      if (comprobanteRef.current) comprobanteRef.current.value = "";
    }
  }, [pago]);

  if (!hydrated || !authHydrated) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="No hay nada para finalizar"
        description="Agrega productos a tu carrito antes de ir al checkout."
      >
        <Button asChild>
          <Link href="/productos">Explorar productos</Link>
        </Button>
      </EmptyState>
    );
  }

  function validar(): string | null {
    if (!email.trim()) return "Ingresa un correo de contacto.";
    if (entrega === "ENVIO") {
      if (!idTransportista || !idDireccionEncomienda || !fechaEntrega)
        return "Selecciona encomendista, dirección y fecha de entrega.";
      if (!envioNombre.trim())
        return "Ingresa el nombre de quien recibe el envío.";
    }
    if (!terminos) return "Debes aceptar los términos y condiciones.";
    if (pago === "TRANSFERENCIA" && !comprobante)
      return "Adjunta el comprobante de la transferencia.";
    return null;
  }

  const MAX_COMPROBANTE_BYTES = 10 * 1024 * 1024; // 10 MB
  const MIMES_COMPROBANTE = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

  function onComprobanteChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setComprobante(null);
      setComprobanteError(null);
      return;
    }
    if (!MIMES_COMPROBANTE.includes(file.type)) {
      setComprobante(null);
      setComprobanteError("Tipo de archivo no permitido. Usa PDF, JPEG, PNG o WEBP.");
      if (comprobanteRef.current) comprobanteRef.current.value = "";
      return;
    }
    if (file.size > MAX_COMPROBANTE_BYTES) {
      setComprobante(null);
      setComprobanteError("El comprobante no puede pesar más de 10 MB.");
      if (comprobanteRef.current) comprobanteRef.current.value = "";
      return;
    }
    setComprobante(file);
    setComprobanteError(null);
  }

  function quitarComprobante() {
    setComprobante(null);
    setComprobanteError(null);
    if (comprobanteRef.current) comprobanteRef.current.value = "";
  }

  async function aplicarCuponCheckout() {
    if (!cupon.trim()) return;
    setAplicandoCupon(true);
    const ctx = { token, sessionId: getSessionId() };
    try {
      await sincronizarCarrito(ctx, items);
      const carrito = await aplicarCupon(ctx, cupon.trim());
      setCuponAplicado(carrito.cupon);
      setDescuento(carrito.descuento);
      toast.success("Cupón aplicado");
    } catch (err) {
      toast.error("Cupón inválido", {
        description: err instanceof ApiError ? err.message : undefined,
      });
    } finally {
      setAplicandoCupon(false);
    }
  }

  async function quitarCuponCheckout() {
    const ctx = { token, sessionId: getSessionId() };
    try {
      await quitarCupon(ctx);
    } catch {
      // ignorar
    }
    setCuponAplicado(null);
    setDescuento(0);
    setCupon("");
  }

  async function finalizar(e: React.FormEvent) {
    e.preventDefault();
    const error = validar();
    if (error) {
      toast.error("Revisa el formulario", { description: error });
      return;
    }
    setEnviando(true);

    const ctx = { token, sessionId: getSessionId() };

    const dto: CheckoutDto = {
      // Sección "Documento tributario" oculta en UI; siempre enviamos CF.
      tipo_documento: "CONSUMIDOR_FINAL",
      metodo_entrega: entrega,
      ...(entrega === "ENVIO" && {
        id_transportista: idTransportista!,
        id_transportista_direccion: idDireccionEncomienda!,
        fecha_entrega: fechaEntrega,
        envio_nombre: envioNombre.trim(),
      }),
      metodo_pago: pago,
      email_contacto: email,
      telefono_contacto: telefono,
      nota,
    };

    try {
      // Carrito local hasta el checkout: sincronizar, reaplicar cupón y crear el pedido.
      await sincronizarCarrito(ctx, items);
      if (cuponAplicado) await aplicarCupon(ctx, cuponAplicado);
      // Si hay comprobante (TRANSFERENCIA), usar endpoint multipart; si no, JSON normal.
      const pedido = comprobante
        ? await checkoutConComprobante(ctx, dto, comprobante)
        : await checkoutApi(ctx, dto);
      setUltimo(pedido);
      clear();
      router.push(`/checkout/confirmacion/${pedido.numero_pedido}`);
    } catch (err) {
      setEnviando(false);
      toast.error("No se pudo completar la compra", {
        description:
          err instanceof ApiError
            ? err.message
            : "Revisa tu conexión e inténtalo de nuevo.",
      });
    }
  }

  return (
    <form onSubmit={finalizar} className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <div className="space-y-5">
        {!logueado && (
          <div className="rounded-xl border border-dashed bg-muted/30 p-4 text-sm">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Inicia sesión
            </Link>{" "}
            para usar tus datos guardados, o continúa como invitado.
          </div>
        )}

        {/* 1. Contacto */}
        <Section numero={1} titulo="Datos de contacto">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="email" className="mb-1.5 block">
                Correo electrónico *
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
              />
            </div>
            <div>
              <Label htmlFor="tel" className="mb-1.5 block">
                Teléfono
              </Label>
              <Input
                id="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="7777-7777"
              />
            </div>
          </div>
        </Section>

        {/* 2. Entrega */}
        <Section numero={2} titulo="Método de entrega">
          <div className="flex flex-col gap-3 sm:flex-row">
            <OptionCard
              active={entrega === "ENVIO"}
              onClick={() => setEntrega("ENVIO")}
              icon={Truck}
              title="Envío a domicilio"
              desc="Recibe en tu dirección"
            />
            <OptionCard
              active={entrega === "RETIRO"}
              onClick={() => setEntrega("RETIRO")}
              icon={Store}
              title="Retiro en tienda"
              desc="Recoge sin costo"
            />
          </div>

          {entrega === "ENVIO" && (
            <div className="mt-4 space-y-4">
              <div>
                <Label className="mb-1.5 block">Encomendista *</Label>
                <Combobox
                  options={encomendistas.map((e) => ({
                    value: String(e.id_transportista),
                    label: e.nombre.trim() || `Encomendista #${e.id_transportista}`,
                    hint: e.contacto || undefined,
                  }))}
                  value={idTransportista ? String(idTransportista) : ""}
                  onChange={(v) => setIdTransportista(v ? Number(v) : null)}
                  placeholder="Selecciona un encomendista"
                  emptyMessage="No hay encomendistas que coincidan con la búsqueda."
                  ariaLabel="Buscar y seleccionar encomendista"
                />
              </div>

              <div>
                <Label className="mb-1.5 block">Dirección de la encomienda *</Label>
                {(() => {
                  const direcciones =
                    encomendistas.find(
                      (e) => e.id_transportista === idTransportista,
                    )?.IaTransportistasDirecciones ?? [];
                  return (
                    <Combobox
                      options={direcciones.map((d) => ({
                        value: String(d.id_transportista_direccion),
                        label: d.direccion.trim() || `Dirección #${d.id_transportista_direccion}`,
                        hint: d.comentario || undefined,
                      }))}
                      value={idDireccionEncomienda ? String(idDireccionEncomienda) : ""}
                      onChange={(v) => setIdDireccionEncomienda(v ? Number(v) : null)}
                      placeholder={
                        idTransportista
                          ? "Selecciona una dirección"
                          : "Primero elige encomendista"
                      }
                      emptyMessage={
                        idTransportista
                          ? "Este encomendista no tiene direcciones registradas."
                          : "Elige un encomendista para ver sus direcciones."
                      }
                      disabled={!idTransportista}
                      ariaLabel="Buscar y seleccionar dirección de encomienda"
                    />
                  );
                })()}
              </div>

              <div>
                <Label htmlFor="fechaEntrega" className="mb-1.5 block">
                  Fecha de entrega *
                </Label>
                <Input
                  id="fechaEntrega"
                  type="date"
                  value={fechaEntrega}
                  min={(() => {
                    const t = new Date();
                    t.setDate(t.getDate() + 1);
                    return t.toISOString().slice(0, 10);
                  })()}
                  onChange={(e) => setFechaEntrega(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="envioNombre" className="mb-1.5 block">
                  Nombre de quien recibe *
                </Label>
                <Input
                  id="envioNombre"
                  value={envioNombre}
                  onChange={(e) => setEnvioNombre(e.target.value)}
                  placeholder="Ej. María Pérez"
                  autoComplete="name"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Persona que retirará el paquete en la dirección de la encomienda.
                </p>
              </div>
            </div>
          )}

          {entrega === "RETIRO" && (
            <div className="mt-4 rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">
              Retira en <strong className="text-foreground">Bolsa Bonita</strong>, Av.
              Las Magnolias #100, San Salvador. Horario: L–S 9:00–18:00. Te
              avisaremos cuando esté listo.
            </div>
          )}
        </Section>

        {/* 3. Pago */}
        <Section numero={3} titulo="Método de pago">
          <div className="flex flex-col gap-3 sm:flex-row">
            <OptionCard
              active={pago === "TRANSFERENCIA"}
              onClick={() => setPago("TRANSFERENCIA")}
              icon={Landmark}
              title="Transferencia"
              desc="Banco / depósito"
            />
            <OptionCard
              active={pago === "CONTRA_ENTREGA"}
              onClick={() => setPago("CONTRA_ENTREGA")}
              icon={HandCoins}
              title="Contra entrega"
              desc="Paga al recibir"
            />
          </div>
          <div className="mt-4 rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">
            {pago === "TRANSFERENCIA" ? (
              <p>
                Te mostraremos los datos bancarios al confirmar. Realiza la
                transferencia y sube tu comprobante para procesar el pedido.
              </p>
            ) : (
              <p>
                Pagarás en efectivo al momento de recibir o retirar tu pedido.
              </p>
            )}
            <p className="mt-2 text-xs">
              🔒 No almacenamos datos de tarjetas. Pago seguro y sin pasarela.
            </p>
          </div>

          {pago === "TRANSFERENCIA" && (
            <div className="mt-4">
              <Label className="mb-1.5 block">
                Comprobante de transferencia *
              </Label>
              <input
                ref={comprobanteRef}
                type="file"
                accept="application/pdf,image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={onComprobanteChange}
              />
              {comprobante ? (
                <div className="flex items-center justify-between rounded-lg border bg-success/5 p-3 text-sm">
                  <span className="flex min-w-0 items-center gap-2">
                    {comprobante.type === "application/pdf" ? (
                      <FileText className="size-5 shrink-0 text-primary" />
                    ) : (
                      <ImageIcon className="size-5 shrink-0 text-primary" />
                    )}
                    <span className="truncate">
                      <span className="block truncate font-medium">
                        {comprobante.name}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {(comprobante.size / 1024).toFixed(0)} KB · listo para enviar
                      </span>
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={quitarComprobante}
                    aria-label="Quitar comprobante"
                    className="ml-2 shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => comprobanteRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed bg-background p-4 text-sm text-muted-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-foreground"
                >
                  <Upload className="size-4" />
                  Adjuntar PDF o imagen (máx. 10 MB)
                </button>
              )}
              {comprobanteError && (
                <p className="mt-1 text-xs text-destructive">{comprobanteError}</p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                Aceptamos PDF, JPEG, PNG o WEBP. Se enviará al confirmar el pedido.
              </p>
            </div>
          )}
        </Section>

        {/* 4. Nota + términos */}
        <Section numero={4} titulo="Revisión y confirmación">
          <Label htmlFor="nota" className="mb-1.5 block">
            Nota para el pedido (opcional)
          </Label>
          <Textarea
            id="nota"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Ej. Entregar por la tarde"
          />
          <label className="mt-4 flex cursor-pointer items-start gap-2 text-sm">
            <Checkbox
              checked={terminos}
              onCheckedChange={(c) => setTerminos(c === true)}
              className="mt-0.5"
            />
            <span>
              Acepto los{" "}
              <Link href="/terminos" className="text-primary hover:underline">
                términos y condiciones
              </Link>{" "}
              y la{" "}
              <Link href="/privacidad" className="text-primary hover:underline">
                política de privacidad
              </Link>
              .
            </span>
          </label>
        </Section>
      </div>

      {/* Resumen sticky */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <OrderSummary items={items} subtotal={subtotal} descuento={descuento} />

        {/* Cupón */}
        <div className="mt-4 rounded-xl border bg-card p-4">
          {cuponAplicado ? (
            <div className="flex items-center justify-between text-sm">
              <span>
                Cupón <strong>{cuponAplicado}</strong> aplicado
              </span>
              <button
                type="button"
                onClick={quitarCuponCheckout}
                className="text-muted-foreground hover:text-destructive"
              >
                Quitar
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                value={cupon}
                onChange={(e) => setCupon(e.target.value)}
                placeholder="Código de descuento"
                aria-label="Código de descuento"
              />
              <Button
                type="button"
                variant="outline"
                onClick={aplicarCuponCheckout}
                disabled={aplicandoCupon || !cupon.trim()}
              >
                {aplicandoCupon ? "…" : "Aplicar"}
              </Button>
            </div>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          className="mt-4 w-full"
          disabled={enviando}
        >
          {enviando ? "Procesando…" : "Confirmar pedido"} <ArrowRight />
        </Button>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Al confirmar se reserva el stock por 48 horas.
        </p>
      </div>
    </form>
  );
}
