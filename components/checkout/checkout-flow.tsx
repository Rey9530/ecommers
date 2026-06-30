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
  TipoDocumento,
} from "@/types";

import { OrderSummary } from "@/components/checkout/order-summary";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [tipoDoc, setTipoDoc] = React.useState<TipoDocumento>("CONSUMIDOR_FINAL");
  const [fiscalNombre, setFiscalNombre] = React.useState("");
  const [fiscalNit, setFiscalNit] = React.useState("");
  const [fiscalNrc, setFiscalNrc] = React.useState("");
  const [fiscalGiro, setFiscalGiro] = React.useState("");
  const [entrega, setEntrega] = React.useState<MetodoEntrega>("ENVIO");
  const [idTransportista, setIdTransportista] = React.useState<number | null>(null);
  const [idDireccionEncomienda, setIdDireccionEncomienda] = React.useState<number | null>(null);
  const [fechaEntrega, setFechaEntrega] = React.useState("");
  const [pago, setPago] = React.useState<MetodoPago>("TRANSFERENCIA");
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
    if (tipoDoc === "CREDITO_FISCAL" && (!fiscalNombre || !fiscalNit || !fiscalNrc))
      return "Completa los datos fiscales para crédito fiscal.";
    if (entrega === "ENVIO") {
      if (!idTransportista || !idDireccionEncomienda || !fechaEntrega)
        return "Selecciona encomendista, dirección y fecha de entrega.";
    }
    if (!terminos) return "Debes aceptar los términos y condiciones.";
    return null;
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
      tipo_documento: tipoDoc,
      ...(tipoDoc === "CREDITO_FISCAL" && {
        fiscal_nombre: fiscalNombre,
        fiscal_nit: fiscalNit,
        fiscal_nrc: fiscalNrc,
        fiscal_giro: fiscalGiro,
      }),
      metodo_entrega: entrega,
      ...(entrega === "ENVIO" && {
        id_transportista: idTransportista!,
        id_transportista_direccion: idDireccionEncomienda!,
        fecha_entrega: fechaEntrega,
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
      const pedido = await checkoutApi(ctx, dto);
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

        {/* 2. Documento */}
        <Section numero={2} titulo="Documento tributario">
          <RadioGroup
            value={tipoDoc}
            onValueChange={(v) => setTipoDoc(v as TipoDocumento)}
            className="gap-3"
          >
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <RadioGroupItem value="CONSUMIDOR_FINAL" /> Consumidor final
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <RadioGroupItem value="CREDITO_FISCAL" /> Crédito fiscal (CCF)
            </label>
          </RadioGroup>

          {tipoDoc === "CREDITO_FISCAL" && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label className="mb-1.5 block">Nombre / razón social *</Label>
                <Input
                  value={fiscalNombre}
                  onChange={(e) => setFiscalNombre(e.target.value)}
                  placeholder="Empresa S.A. de C.V."
                />
              </div>
              <div>
                <Label className="mb-1.5 block">NIT *</Label>
                <Input value={fiscalNit} onChange={(e) => setFiscalNit(e.target.value)} placeholder="0614-..." />
              </div>
              <div>
                <Label className="mb-1.5 block">NRC *</Label>
                <Input value={fiscalNrc} onChange={(e) => setFiscalNrc(e.target.value)} placeholder="123456-7" />
              </div>
              <div className="sm:col-span-2">
                <Label className="mb-1.5 block">Giro</Label>
                <Input value={fiscalGiro} onChange={(e) => setFiscalGiro(e.target.value)} placeholder="Comercio" />
              </div>
            </div>
          )}
        </Section>

        {/* 3. Entrega */}
        <Section numero={3} titulo="Método de entrega">
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
                <Select
                  value={idTransportista ? String(idTransportista) : ""}
                  onValueChange={(v) => setIdTransportista(Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un encomendista" />
                  </SelectTrigger>
                  <SelectContent>
                    {encomendistas.map((e) => (
                      <SelectItem
                        key={e.id_transportista}
                        value={String(e.id_transportista)}
                      >
                        {e.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-1.5 block">Dirección de la encomienda *</Label>
                <Select
                  value={idDireccionEncomienda ? String(idDireccionEncomienda) : ""}
                  onValueChange={(v) => setIdDireccionEncomienda(Number(v))}
                  disabled={!idTransportista}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        idTransportista
                          ? "Selecciona una dirección"
                          : "Primero elige encomendista"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {encomendistas
                      .find((e) => e.id_transportista === idTransportista)
                      ?.IaTransportistasDirecciones.map((d) => (
                        <SelectItem
                          key={d.id_transportista_direccion}
                          value={String(d.id_transportista_direccion)}
                        >
                          {d.direccion}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
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

        {/* 4. Pago (B6) */}
        <Section numero={4} titulo="Método de pago">
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
        </Section>

        {/* 5. Nota + términos */}
        <Section numero={5} titulo="Revisión y confirmación">
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
