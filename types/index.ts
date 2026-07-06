/**
 * Tipos del dominio de la tienda.
 *
 * Alineados con el contrato real del backend (módulo `ecommerce`, prefijo `/tienda`).
 * Ver: sys-facturacion-bk/src/modules/ecommerce/README.md
 *
 * Convenciones del backend:
 *  - Moneda USD, IVA único 13%. Los `precio*` incluyen IVA salvo `precio_sin_iva`.
 *  - Respuestas envueltas en { data, status, msg }.
 *  - Catálogo SIN variantes: un producto = un `id_catalogo`.
 */

// ---------------------------------------------------------------------------
// Envoltura de respuesta / paginación
// ---------------------------------------------------------------------------

export interface ApiResponse<T> {
  data: T;
  status: boolean;
  msg: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

// ---------------------------------------------------------------------------
// Catálogo
// ---------------------------------------------------------------------------

export interface CategoriaRef {
  id_categoria: number;
  nombre: string;
}

export interface Categoria extends CategoriaRef {
  id_categoria_padre: number | null;
}

/** Categoría con hijos resueltos (árbol armado en el frontend). */
export interface CategoriaArbol extends Categoria {
  hijos: CategoriaArbol[];
}

export interface ImagenProducto {
  path: string;
  path_miniature: string;
  orden: number;
}

/** Producto en listados (catálogo, búsqueda, relacionados). */
export interface ProductoLista {
  id_catalogo: number;
  slug: string;
  nombre: string;
  descripcion_corta: string;
  precio: number; // con IVA (precio de oferta si está vigente)
  precio_sin_iva: number;
  /** Precio anterior tachado cuando hay oferta vigente. */
  precio_anterior?: number | null;
  /** true si hay oferta vigente. */
  en_oferta?: boolean;
  /** true si fue creado en los últimos 30 días. */
  es_nuevo?: boolean;
  en_stock: boolean;
  imagen: string | null;
  categoria: CategoriaRef;
  calificacion_promedio?: number;
  total_resenas?: number;
}

/** Detalle de producto (PDP). */
export interface ProductoDetalle {
  id_catalogo: number;
  slug: string;
  nombre: string;
  descripcion: string;
  descripcion_corta: string;
  meta_title: string;
  meta_description: string;
  exento_iva: boolean;
  precio: number; // con IVA (precio de oferta si está vigente)
  precio_sin_iva: number;
  /** Precio anterior tachado cuando hay oferta vigente. */
  precio_anterior?: number | null;
  /** true si hay oferta vigente. */
  en_oferta?: boolean;
  /** true si fue creado en los últimos 30 días. */
  es_nuevo?: boolean;
  disponible: number; // existencias - reservas activas
  en_stock: boolean;
  categoria: CategoriaRef;
  imagenes: ImagenProducto[];
  calificacion_promedio?: number;
  total_resenas?: number;
  // Campos solo-frontend (no provistos por el backend hoy):
  atributos?: { etiqueta: string; valor: string }[];
}

export type OrdenCatalogo = "nombre" | "precio_asc" | "precio_desc" | "nuevos";

export interface CatalogoQuery {
  page?: number;
  limit?: number;
  categoria?: number;
  q?: string;
  orden?: OrdenCatalogo;
  precioMin?: number;
  precioMax?: number;
  soloDisponibles?: boolean;
}

/** Sugerencia de autocompletado (`GET /tienda/catalogo/sugerencias`). */
export interface Sugerencia {
  slug: string;
  nombre: string;
  precio: number;
  imagen: string | null;
}

// ---------------------------------------------------------------------------
// Carrito
// ---------------------------------------------------------------------------

export interface CarritoItem {
  id_carrito_item: number;
  id_catalogo: number;
  slug?: string; // ayuda al frontend a enlazar al PDP
  imagen?: string;
  nombre: string;
  cantidad: number;
  precio_unitario: number; // con IVA
  importe: number;
  disponible: number;
  excede_stock: boolean;
}

export interface Carrito {
  id_carrito: number;
  items: CarritoItem[];
  cantidad_items: number;
  cupon: string | null;
  subtotal: number;
  descuento: number;
  total: number;
}

// ---------------------------------------------------------------------------
// Cliente / auth
// ---------------------------------------------------------------------------

export interface Cliente {
  id_cliente: number;
  email: string;
  email_verificado: boolean;
  nombre: string;
  telefono?: string;
  tipo_precio: string; // '1'..'6' (6 = público)
  id_tipo_cliente: number | null;
}

export interface AuthResponse {
  token: string;
  cliente: Cliente;
}

// ---------------------------------------------------------------------------
// Direcciones
// ---------------------------------------------------------------------------

export type TipoDireccion = "ENVIO" | "FACTURACION";

export interface Direccion {
  id_direccion: number;
  tipo: TipoDireccion;
  nombre_contacto: string;
  telefono: string;
  id_municipio: number | null;
  municipio_nombre?: string;
  direccion: string;
  referencia: string;
  es_predeterminada: boolean;
}

// ---------------------------------------------------------------------------
// Encomendistas (catálogo público del storefront)
// ---------------------------------------------------------------------------

export interface EncomendistaDireccion {
  id_transportista_direccion: number;
  direccion: string;
  foto?: string | null;
  comentario?: string | null;
}

export interface Encomendista {
  id_transportista: number;
  nombre: string;
  contacto?: string | null;
  comentario?: string | null;
  IaTransportistasDirecciones: EncomendistaDireccion[];
}

// ---------------------------------------------------------------------------
// Pedidos
// ---------------------------------------------------------------------------

export type TipoDocumento = "CONSUMIDOR_FINAL" | "CREDITO_FISCAL";
export type MetodoEntrega = "ENVIO" | "RETIRO";
export type MetodoPago = "TRANSFERENCIA" | "CONTRA_ENTREGA";
export type EstadoPedido =
  | "PENDIENTE_PAGO"
  | "PAGADO"
  | "PREPARANDO"
  | "ENVIADO"
  | "ENTREGADO"
  | "CANCELADO";

export interface PedidoItem {
  id_pedido_item: number;
  id_catalogo: number;
  slug?: string;
  imagen?: string;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
  precio_con_iva: number;
  exento_iva: boolean;
  subtotal: number;
}

export interface HistorialPedido {
  id_historial: number;
  estado: EstadoPedido;
  nota: string;
  fecha: string;
}

export interface Pedido {
  id_pedido: number;
  numero_pedido: string;
  id_cliente: number | null;
  email_contacto: string;
  telefono_contacto: string;
  tipo_documento: TipoDocumento;
  fiscal_nombre: string;
  fiscal_nit: string;
  fiscal_nrc: string;
  fiscal_giro: string;
  metodo_entrega: MetodoEntrega;
  id_transportista?: number | null;
  id_transportista_direccion?: number | null;
  fecha_entrega?: string | null;
  envio_nombre?: string;
  envio_telefono?: string;
  envio_id_municipio?: number | null;
  envio_direccion?: string;
  envio_referencia?: string;
  metodo_pago: MetodoPago;
  comprobante_pago_url: string;
  subtotal: number;
  descuento: number;
  costo_envio: number;
  iva: number;
  total: number;
  estado: EstadoPedido;
  id_factura: number | null;
  nota: string;
  expira_en: string | null;
  fecha_creacion: string;
  items: PedidoItem[];
  historial: HistorialPedido[];
}

/** Cuerpo del checkout (POST /tienda/pedidos/checkout). */
export interface CheckoutDto {
  tipo_documento: TipoDocumento;
  fiscal_nombre?: string;
  fiscal_nit?: string;
  fiscal_nrc?: string;
  fiscal_giro?: string;
  metodo_entrega: MetodoEntrega;
  /** Requeridos cuando metodo_entrega === "ENVIO". */
  id_transportista?: number;
  id_transportista_direccion?: number;
  /** YYYY-MM-DD. Requerido cuando metodo_entrega === "ENVIO". */
  fecha_entrega?: string;
  /** Requerido cuando metodo_entrega === "ENVIO". Nombre de quien recibe el envío. */
  envio_nombre?: string;
  metodo_pago: MetodoPago;
  email_contacto?: string;
  telefono_contacto?: string;
  nota?: string;
}

// ---------------------------------------------------------------------------
// Reseñas (API real: GET /tienda/catalogo/:slug/resenas)
// ---------------------------------------------------------------------------

export interface ResenaPublica {
  id_resena: number;
  calificacion: number; // 1..5
  comentario: string | null;
  nombre: string;
  fecha: string;
}

export interface ResenasResponse {
  promedio: number;
  total: number;
  resenas: ResenaPublica[];
}

// ---------------------------------------------------------------------------
// Geo (selectores de dirección)
// ---------------------------------------------------------------------------

export interface Departamento {
  id_departamento: number;
  nombre: string;
  codigo: string;
}

export interface Municipio {
  id_municipio: number;
  nombre: string;
  id_departamento: number;
}
