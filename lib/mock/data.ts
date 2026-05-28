/**
 * Datos mock de la tienda "Bolsa Bonita" (bolsas decorativas).
 *
 * Las formas replican exactamente el contrato del backend `/tienda`
 * para que al conectar la API solo se cambie la capa `lib/api/*`.
 * Los campos marcados "solo-frontend" no los provee el backend hoy.
 */

import type {
  Categoria,
  Cliente,
  Direccion,
  ImagenProducto,
  Pedido,
  ProductoDetalle,
  Resena,
} from "@/types";

const IVA = 0.13;
const sinIva = (precioConIva: number) =>
  Math.round((precioConIva / (1 + IVA)) * 100) / 100;

function imgs(n: number): ImagenProducto[] {
  return Array.from({ length: n }, (_, i) => ({
    path: "",
    path_miniature: "",
    orden: i,
  }));
}

// ---------------------------------------------------------------------------
// Categorías (lista plana; el árbol se arma con id_categoria_padre)
// ---------------------------------------------------------------------------

export const CATEGORIAS: Categoria[] = [
  { id_categoria: 1, nombre: "Bolsas de regalo", id_categoria_padre: null },
  { id_categoria: 7, nombre: "Bolsas navideñas", id_categoria_padre: 1 },
  { id_categoria: 8, nombre: "Bolsas para cumpleaños", id_categoria_padre: 1 },
  { id_categoria: 2, nombre: "Bolsas kraft", id_categoria_padre: null },
  { id_categoria: 3, nombre: "Cajas decorativas", id_categoria_padre: null },
  { id_categoria: 4, nombre: "Bolsas de tela", id_categoria_padre: null },
  { id_categoria: 5, nombre: "Moños y cintas", id_categoria_padre: null },
  { id_categoria: 6, nombre: "Papel y relleno", id_categoria_padre: null },
];

const cat = (id: number) => {
  const c = CATEGORIAS.find((x) => x.id_categoria === id)!;
  return { id_categoria: c.id_categoria, nombre: c.nombre };
};

// ---------------------------------------------------------------------------
// Productos (detalle completo; los listados se derivan)
// ---------------------------------------------------------------------------

type ProdSeed = {
  id: number;
  slug: string;
  nombre: string;
  cat: number;
  precio: number;
  precio_anterior?: number;
  disponible: number;
  es_nuevo?: boolean;
  corta: string;
  larga: string;
  imgs?: number;
  atributos?: { etiqueta: string; valor: string }[];
};

const SEEDS: ProdSeed[] = [
  {
    id: 101,
    slug: "bolsa-regalo-roja-grande",
    nombre: "Bolsa de regalo roja grande",
    cat: 1,
    precio: 3.39,
    precio_anterior: 4.25,
    disponible: 48,
    es_nuevo: true,
    corta: "Bolsa de papel premium con acabado mate y asas de cordón.",
    larga:
      "Bolsa de regalo en color rojo intenso, fabricada en papel de 210 g con acabado mate y refuerzo en la base. Incluye asas de cordón trenzado a juego. Ideal para regalos medianos, detalles corporativos y empaques de boutique.",
    imgs: 4,
    atributos: [
      { etiqueta: "Material", valor: "Papel mate 210 g" },
      { etiqueta: "Medidas", valor: "26 × 32 × 12 cm" },
      { etiqueta: "Asas", valor: "Cordón trenzado" },
      { etiqueta: "Color", valor: "Rojo" },
    ],
  },
  {
    id: 102,
    slug: "bolsa-kraft-natural-mediana",
    nombre: "Bolsa kraft natural mediana",
    cat: 2,
    precio: 1.69,
    disponible: 220,
    corta: "Bolsa ecológica de papel kraft reciclado, resistente.",
    larga:
      "Bolsa de papel kraft natural 100% reciclable, perfecta para comercios que buscan una imagen sostenible. Resistencia reforzada para cargas de hasta 4 kg.",
    imgs: 3,
    atributos: [
      { etiqueta: "Material", valor: "Kraft reciclado 120 g" },
      { etiqueta: "Medidas", valor: "22 × 28 × 10 cm" },
      { etiqueta: "Color", valor: "Natural" },
    ],
  },
  {
    id: 103,
    slug: "caja-decorativa-rosada-con-tapa",
    nombre: "Caja decorativa rosada con tapa",
    cat: 3,
    precio: 5.99,
    disponible: 30,
    es_nuevo: true,
    corta: "Caja rígida forrada, ideal para regalos especiales.",
    larga:
      "Caja rígida con tapa y acabado texturizado en tono rosa empolvado. Interior espacioso para regalos delicados, joyería o reposterías. Reutilizable y elegante.",
    imgs: 4,
    atributos: [
      { etiqueta: "Material", valor: "Cartón rígido forrado" },
      { etiqueta: "Medidas", valor: "20 × 20 × 9 cm" },
      { etiqueta: "Color", valor: "Rosa empolvado" },
    ],
  },
  {
    id: 104,
    slug: "bolsa-de-tela-yute-personalizable",
    nombre: "Bolsa de tela yute personalizable",
    cat: 4,
    precio: 4.49,
    disponible: 75,
    corta: "Tote de yute natural, perfecta para personalizar.",
    larga:
      "Bolsa tipo tote de yute natural con asas largas de algodón. Superficie ideal para estampado o bordado. Resistente, reutilizable y amigable con el ambiente.",
    imgs: 3,
    atributos: [
      { etiqueta: "Material", valor: "Yute + algodón" },
      { etiqueta: "Medidas", valor: "35 × 40 cm" },
    ],
  },
  {
    id: 105,
    slug: "mono-satinado-dorado",
    nombre: "Moño satinado dorado (pack 10)",
    cat: 5,
    precio: 6.5,
    precio_anterior: 7.9,
    disponible: 60,
    corta: "Pack de 10 moños prearmados en cinta satinada.",
    larga:
      "Set de 10 moños prearmados en cinta satinada dorada con adhesivo en la base. Dan el toque final perfecto a cualquier empaque de regalo.",
    imgs: 2,
    atributos: [
      { etiqueta: "Contenido", valor: "10 unidades" },
      { etiqueta: "Color", valor: "Dorado" },
    ],
  },
  {
    id: 106,
    slug: "papel-seda-colores-surtidos",
    nombre: "Papel seda colores surtidos (50 hojas)",
    cat: 6,
    precio: 3.25,
    disponible: 140,
    corta: "Relleno decorativo en papel seda multicolor.",
    larga:
      "Paquete de 50 hojas de papel seda en colores surtidos para relleno y envoltura. Ligero, suave y perfecto para dar volumen a bolsas y cajas.",
    imgs: 2,
    atributos: [
      { etiqueta: "Contenido", valor: "50 hojas" },
      { etiqueta: "Medida hoja", valor: "50 × 66 cm" },
    ],
  },
  {
    id: 107,
    slug: "bolsa-navidena-roja-verde",
    nombre: "Bolsa navideña rojo y verde",
    cat: 7,
    precio: 3.99,
    disponible: 0,
    corta: "Diseño festivo con estampado navideño y glitter.",
    larga:
      "Bolsa de regalo con estampado navideño en rojo y verde con detalles en glitter dorado. Edición de temporada, ideal para empaques de fin de año.",
    imgs: 3,
    atributos: [
      { etiqueta: "Medidas", valor: "26 × 32 × 12 cm" },
      { etiqueta: "Temporada", valor: "Navidad" },
    ],
  },
  {
    id: 108,
    slug: "bolsa-cumpleanos-confeti",
    nombre: "Bolsa cumpleaños confeti",
    cat: 8,
    precio: 2.89,
    disponible: 95,
    es_nuevo: true,
    corta: "Colorida bolsa con estampado de confeti y globos.",
    larga:
      "Bolsa de regalo festiva con estampado de confeti y globos sobre fondo claro. Perfecta para fiestas infantiles y celebraciones de cumpleaños.",
    imgs: 3,
    atributos: [
      { etiqueta: "Medidas", valor: "23 × 30 × 10 cm" },
      { etiqueta: "Estilo", valor: "Confeti" },
    ],
  },
  {
    id: 109,
    slug: "bolsa-kraft-mini-con-ventana",
    nombre: "Bolsa kraft mini con ventana",
    cat: 2,
    precio: 1.25,
    disponible: 180,
    corta: "Mini bolsa kraft con ventana transparente.",
    larga:
      "Mini bolsa de papel kraft con ventana de PVC transparente, ideal para dulces, jabones artesanales y detalles pequeños. Cierre superior plegable.",
    imgs: 2,
    atributos: [
      { etiqueta: "Medidas", valor: "12 × 18 × 6 cm" },
      { etiqueta: "Ventana", valor: "PVC transparente" },
    ],
  },
  {
    id: 110,
    slug: "caja-kraft-para-pastel",
    nombre: "Caja kraft para pastel",
    cat: 3,
    precio: 2.15,
    disponible: 110,
    corta: "Caja resistente para repostería con base reforzada.",
    larga:
      "Caja de cartón kraft con base reforzada y armado rápido, diseñada para pasteles y repostería. Grado alimenticio, apta para contacto con alimentos.",
    imgs: 2,
    atributos: [
      { etiqueta: "Medidas", valor: "25 × 25 × 12 cm" },
      { etiqueta: "Uso", valor: "Repostería" },
    ],
  },
  {
    id: 111,
    slug: "cinta-decorativa-lino-25mm",
    nombre: "Cinta decorativa de lino 25mm (10m)",
    cat: 5,
    precio: 4.2,
    disponible: 70,
    corta: "Rollo de cinta de lino para envoltura artesanal.",
    larga:
      "Rollo de 10 metros de cinta de lino natural de 25 mm de ancho. Textura rústica y elegante para envolturas artesanales y decoración.",
    imgs: 2,
    atributos: [
      { etiqueta: "Largo", valor: "10 m" },
      { etiqueta: "Ancho", valor: "25 mm" },
    ],
  },
  {
    id: 112,
    slug: "bolsa-regalo-negra-elegante",
    nombre: "Bolsa de regalo negra elegante",
    cat: 1,
    precio: 3.75,
    disponible: 52,
    corta: "Bolsa negra mate de líneas sobrias y premium.",
    larga:
      "Bolsa de regalo en negro mate con asas de cordón a tono. Diseño sobrio y premium, ideal para marcas de lujo y empaques corporativos.",
    imgs: 4,
    atributos: [
      { etiqueta: "Material", valor: "Papel mate 210 g" },
      { etiqueta: "Medidas", valor: "26 × 32 × 12 cm" },
      { etiqueta: "Color", valor: "Negro" },
    ],
  },
  {
    id: 113,
    slug: "bolsa-de-tela-algodon-blanca",
    nombre: "Bolsa de tela algodón blanca",
    cat: 4,
    precio: 3.95,
    precio_anterior: 4.6,
    disponible: 88,
    corta: "Tote de algodón blanco, lienzo ideal para diseños.",
    larga:
      "Bolsa tote de algodón blanco 100%, asas reforzadas. Superficie lisa perfecta para serigrafía y diseños personalizados de marca.",
    imgs: 3,
    atributos: [
      { etiqueta: "Material", valor: "Algodón 100%" },
      { etiqueta: "Medidas", valor: "38 × 42 cm" },
    ],
  },
  {
    id: 114,
    slug: "papel-craft-relleno-triturado",
    nombre: "Relleno de papel triturado kraft (1kg)",
    cat: 6,
    precio: 5.5,
    disponible: 40,
    corta: "Viruta de papel kraft para relleno y protección.",
    larga:
      "Bolsa de 1 kg de viruta de papel kraft triturado, ideal como relleno decorativo y protector dentro de cajas y canastas de regalo.",
    imgs: 2,
    atributos: [
      { etiqueta: "Contenido", valor: "1 kg" },
      { etiqueta: "Color", valor: "Kraft" },
    ],
  },
  {
    id: 115,
    slug: "bolsa-navidena-dorada-premium",
    nombre: "Bolsa navideña dorada premium",
    cat: 7,
    precio: 4.5,
    disponible: 25,
    corta: "Edición premium con relieve y acabado metálico.",
    larga:
      "Bolsa de regalo navideña con acabado metálico dorado y relieve en alto. Pieza premium para empaques de temporada que destacan.",
    imgs: 3,
    atributos: [
      { etiqueta: "Medidas", valor: "26 × 32 × 12 cm" },
      { etiqueta: "Acabado", valor: "Metálico con relieve" },
    ],
  },
  {
    id: 116,
    slug: "bolsa-cumpleanos-unicornio",
    nombre: "Bolsa cumpleaños unicornio",
    cat: 8,
    precio: 3.1,
    disponible: 64,
    corta: "Diseño infantil de unicornio con detalles holográficos.",
    larga:
      "Bolsa de regalo con diseño de unicornio y detalles holográficos. Favorita para fiestas infantiles temáticas.",
    imgs: 3,
    atributos: [
      { etiqueta: "Medidas", valor: "23 × 30 × 10 cm" },
      { etiqueta: "Tema", valor: "Unicornio" },
    ],
  },
  {
    id: 117,
    slug: "caja-decorativa-kit-armable",
    nombre: "Caja decorativa kit armable (pack 6)",
    cat: 3,
    precio: 7.25,
    disponible: 18,
    es_nuevo: true,
    corta: "Set de 6 cajas armables con diseños surtidos.",
    larga:
      "Kit de 6 cajas decorativas armables con diseños surtidos en tonos pastel. Llegan planas y se arman en segundos, optimizando el almacenamiento.",
    imgs: 3,
    atributos: [
      { etiqueta: "Contenido", valor: "6 cajas" },
      { etiqueta: "Estilo", valor: "Pastel surtido" },
    ],
  },
  {
    id: 118,
    slug: "mono-organza-blanco",
    nombre: "Moño de organza blanco (pack 12)",
    cat: 5,
    precio: 5.8,
    disponible: 0,
    corta: "Moños de organza translúcida para toque delicado.",
    larga:
      "Pack de 12 moños de organza blanca translúcida con adhesivo. Aportan un acabado delicado y romántico a bodas y eventos.",
    imgs: 2,
    atributos: [
      { etiqueta: "Contenido", valor: "12 unidades" },
      { etiqueta: "Color", valor: "Blanco" },
    ],
  },
];

export const PRODUCTOS: ProductoDetalle[] = SEEDS.map((s) => ({
  id_catalogo: s.id,
  slug: s.slug,
  nombre: s.nombre,
  descripcion: s.larga,
  descripcion_corta: s.corta,
  meta_title: `${s.nombre} | Bolsa Bonita`,
  meta_description: s.corta,
  exento_iva: false,
  precio: s.precio,
  precio_sin_iva: sinIva(s.precio),
  precio_anterior: s.precio_anterior,
  es_nuevo: s.es_nuevo,
  disponible: s.disponible,
  en_stock: s.disponible > 0,
  categoria: cat(s.cat),
  imagenes: imgs(s.imgs ?? 3),
  atributos: s.atributos,
}));

// ---------------------------------------------------------------------------
// Cliente / direcciones (mock de sesión logueada)
// ---------------------------------------------------------------------------

export const CLIENTE_DEMO: Cliente = {
  id_cliente: 12,
  email: "maria@correo.com",
  email_verificado: true,
  nombre: "María López",
  telefono: "7777-7777",
  tipo_precio: "6",
  id_tipo_cliente: null,
};

export const DIRECCIONES_DEMO: Direccion[] = [
  {
    id_direccion: 4,
    tipo: "ENVIO",
    nombre_contacto: "María López",
    telefono: "7777-7777",
    id_municipio: 312,
    municipio_nombre: "San Salvador",
    direccion: "Col. Escalón, Calle 1 #23",
    referencia: "Portón negro, frente al parque",
    es_predeterminada: true,
  },
  {
    id_direccion: 5,
    tipo: "FACTURACION",
    nombre_contacto: "María López",
    telefono: "7777-7777",
    id_municipio: 312,
    municipio_nombre: "San Salvador",
    direccion: "Av. Las Magnolias #100, Local 4",
    referencia: "Oficina",
    es_predeterminada: false,
  },
];

// ---------------------------------------------------------------------------
// Pedidos (historial mock)
// ---------------------------------------------------------------------------

export const PEDIDOS_DEMO: Pedido[] = [
  {
    id_pedido: 1001,
    numero_pedido: "PED-LXR8K2-451",
    id_cliente: 12,
    email_contacto: "maria@correo.com",
    telefono_contacto: "7777-7777",
    tipo_documento: "CONSUMIDOR_FINAL",
    fiscal_nombre: "",
    fiscal_nit: "",
    fiscal_nrc: "",
    fiscal_giro: "",
    metodo_entrega: "ENVIO",
    envio_nombre: "María López",
    envio_telefono: "7777-7777",
    envio_id_municipio: 312,
    envio_direccion: "Col. Escalón, Calle 1 #23",
    envio_referencia: "Portón negro",
    metodo_pago: "TRANSFERENCIA",
    comprobante_pago_url: "",
    subtotal: 13.5,
    descuento: 0,
    costo_envio: 0,
    iva: 1.76,
    total: 15.26,
    estado: "ENVIADO",
    id_factura: null,
    nota: "Entregar por la tarde",
    expira_en: null,
    fecha_creacion: "2026-05-20T16:30:00.000Z",
    items: [
      {
        id_pedido_item: 5001,
        id_catalogo: 101,
        slug: "bolsa-regalo-roja-grande",
        nombre: "Bolsa de regalo roja grande",
        cantidad: 3,
        precio_unitario: 3.39,
        precio_con_iva: 3.39,
        exento_iva: false,
        subtotal: 10.17,
      },
      {
        id_pedido_item: 5002,
        id_catalogo: 105,
        slug: "mono-satinado-dorado",
        nombre: "Moño satinado dorado (pack 10)",
        cantidad: 1,
        precio_unitario: 6.5,
        precio_con_iva: 6.5,
        exento_iva: false,
        subtotal: 6.5,
      },
    ],
    historial: [
      { id_historial: 1, estado: "PENDIENTE_PAGO", nota: "Pedido creado", fecha: "2026-05-20T16:30:00.000Z" },
      { id_historial: 2, estado: "PAGADO", nota: "Pago confirmado", fecha: "2026-05-20T18:05:00.000Z" },
      { id_historial: 3, estado: "PREPARANDO", nota: "Preparando tu pedido", fecha: "2026-05-21T09:00:00.000Z" },
      { id_historial: 4, estado: "ENVIADO", nota: "Pedido despachado", fecha: "2026-05-22T11:20:00.000Z" },
    ],
  },
  {
    id_pedido: 1000,
    numero_pedido: "PED-KW2P9A-118",
    id_cliente: 12,
    email_contacto: "maria@correo.com",
    telefono_contacto: "7777-7777",
    tipo_documento: "CREDITO_FISCAL",
    fiscal_nombre: "Detalles María S.A. de C.V.",
    fiscal_nit: "0614-280590-101-2",
    fiscal_nrc: "123456-7",
    fiscal_giro: "Comercio al por menor",
    metodo_entrega: "RETIRO",
    envio_nombre: "",
    envio_telefono: "",
    envio_id_municipio: null,
    envio_direccion: "",
    envio_referencia: "",
    metodo_pago: "CONTRA_ENTREGA",
    comprobante_pago_url: "",
    subtotal: 22.4,
    descuento: 0,
    costo_envio: 0,
    iva: 2.91,
    total: 25.31,
    estado: "ENTREGADO",
    id_factura: 8842,
    nota: "",
    expira_en: null,
    fecha_creacion: "2026-04-30T14:00:00.000Z",
    items: [
      {
        id_pedido_item: 4001,
        id_catalogo: 102,
        slug: "bolsa-kraft-natural-mediana",
        nombre: "Bolsa kraft natural mediana",
        cantidad: 10,
        precio_unitario: 1.69,
        precio_con_iva: 1.69,
        exento_iva: false,
        subtotal: 16.9,
      },
      {
        id_pedido_item: 4002,
        id_catalogo: 106,
        slug: "papel-seda-colores-surtidos",
        nombre: "Papel seda colores surtidos (50 hojas)",
        cantidad: 2,
        precio_unitario: 3.25,
        precio_con_iva: 3.25,
        exento_iva: false,
        subtotal: 6.5,
      },
    ],
    historial: [
      { id_historial: 1, estado: "PENDIENTE_PAGO", nota: "Pedido creado", fecha: "2026-04-30T14:00:00.000Z" },
      { id_historial: 2, estado: "PAGADO", nota: "Pago confirmado", fecha: "2026-04-30T16:00:00.000Z" },
      { id_historial: 3, estado: "PREPARANDO", nota: "Preparando tu pedido", fecha: "2026-05-01T09:00:00.000Z" },
      { id_historial: 4, estado: "ENTREGADO", nota: "Retirado en tienda", fecha: "2026-05-02T15:30:00.000Z" },
    ],
  },
  {
    id_pedido: 1002,
    numero_pedido: "PED-MN5T7Q-902",
    id_cliente: 12,
    email_contacto: "maria@correo.com",
    telefono_contacto: "7777-7777",
    tipo_documento: "CONSUMIDOR_FINAL",
    fiscal_nombre: "",
    fiscal_nit: "",
    fiscal_nrc: "",
    fiscal_giro: "",
    metodo_entrega: "ENVIO",
    envio_nombre: "María López",
    envio_telefono: "7777-7777",
    envio_id_municipio: 312,
    envio_direccion: "Col. Escalón, Calle 1 #23",
    envio_referencia: "Portón negro",
    metodo_pago: "TRANSFERENCIA",
    comprobante_pago_url: "",
    subtotal: 11.97,
    descuento: 0,
    costo_envio: 0,
    iva: 1.56,
    total: 13.53,
    estado: "PENDIENTE_PAGO",
    id_factura: null,
    nota: "",
    expira_en: "2026-05-30T20:00:00.000Z",
    fecha_creacion: "2026-05-28T10:00:00.000Z",
    items: [
      {
        id_pedido_item: 6001,
        id_catalogo: 103,
        slug: "caja-decorativa-rosada-con-tapa",
        nombre: "Caja decorativa rosada con tapa",
        cantidad: 2,
        precio_unitario: 5.99,
        precio_con_iva: 5.99,
        exento_iva: false,
        subtotal: 11.98,
      },
    ],
    historial: [
      { id_historial: 1, estado: "PENDIENTE_PAGO", nota: "Pedido creado", fecha: "2026-05-28T10:00:00.000Z" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Reseñas (solo-frontend)
// ---------------------------------------------------------------------------

export const RESENAS_DEMO: Resena[] = [
  {
    id: 1,
    id_catalogo: 101,
    autor: "Carla M.",
    calificacion: 5,
    titulo: "Excelente calidad",
    comentario:
      "El papel es muy grueso y resistente, las asas no se rompen. Quedaron preciosas para los regalos de la oficina.",
    fecha: "2026-05-10T12:00:00.000Z",
    compra_verificada: true,
  },
  {
    id: 2,
    id_catalogo: 101,
    autor: "José R.",
    calificacion: 4,
    titulo: "Muy buenas",
    comentario: "Buen tamaño y color vivo. El envío llegó a tiempo.",
    fecha: "2026-05-12T09:30:00.000Z",
    compra_verificada: true,
  },
  {
    id: 3,
    id_catalogo: 103,
    autor: "Ana G.",
    calificacion: 5,
    titulo: "Hermosas cajas",
    comentario: "Se ven mucho más caras de lo que cuestan. Las volveré a pedir.",
    fecha: "2026-05-15T18:45:00.000Z",
    compra_verificada: true,
  },
];
