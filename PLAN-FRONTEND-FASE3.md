# Plan Frontend — §3 "Funcionalidades del Frontend" (solo diseño)

Tienda **Bolsa Bonita** (bolsas decorativas, B2C + B2B). Frontend Next.js 16 (App Router) +
Tailwind v4 + shadcn/ui + lucide. **Solo diseño con datos mock**, sin conexión real al backend.

> Las formas de datos replican el contrato real del backend (`sys-facturacion-bk/src/modules/ecommerce/README.md`,
> prefijo `/tienda`). La capa `lib/api/*` es mock; al integrar solo se cambia el `fetch`.
> Puntos de integración marcados con `// TODO: API`.

## Diferencias clave frente al spec genérico (adoptadas del backend real)
- **Sin variantes** de producto (un producto = un `id_catalogo`). PDP sin selector de variantes.
- **Precios** con IVA incluido (13%), por grupo de cliente (`tipo_precio`). `precio_anterior` es solo-frontend.
- **Filtros del backend:** `categoria`, `q`, `orden`. Facetas extra (precio, disponibilidad) se resuelven en cliente.
- **Sin cupones / sin costo de envío calculado** hoy (UI presente, marcada "próximamente").
- **Pagos offline:** `TRANSFERENCIA` / `CONTRA_ENTREGA` (+ subir comprobante). Sin pasarela/tarjeta.
- **Entrega:** `ENVIO` | `RETIRO`. **Documento:** `CONSUMIDOR_FINAL` | `CREDITO_FISCAL` (datos fiscales SV).
- **Wishlist y reseñas:** solo-frontend (localStorage / mock).
- **Auth:** Bearer cliente (mock) + invitado por `x-session-id`. **Tracking:** vía `historial[]` de estados.

---

## Bloques

### B0 — Fundamentos ✅
- shadcn/ui (manual) + lucide + zustand + sonner. Tokens de diseño en `app/globals.css` (paleta terracota/marfil).
- `types/index.ts` (contrato backend). `lib/mock/data.ts` (catálogo, pedidos, direcciones, reseñas).
- `lib/api/catalogo.ts` (mock). `lib/categorias.ts` (árbol/slug). Stores: `cart`, `wishlist`, `auth`.
- Layout: `site-header` (nav + buscador + carrito + favoritos + cuenta), `mobile-nav`, `site-footer`, mini-carrito.
- Componentes compartidos: `product-card`, `product-grid`, `product-thumb`, `price-display`, `rating-stars`,
  `quantity-stepper`, `stock-badge`, `wishlist-button`, `add-to-cart-button`, `empty-state`, `category-tile`.
- Home (`app/page.tsx`).

### B1 — §3.1 Catálogo y navegación
- Rutas: `app/productos/page.tsx`, `app/categoria/[slug]/page.tsx`.
- `components/catalog/`: `filter-sidebar`, `sort-select`, `active-filters`, `catalog-pagination`, `mobile-filters`.
- Filtros reflejados en URL (searchParams). Breadcrumbs. Paginación. `loading.tsx`.
- Criterios: filtros en URL (compartibles/SEO), render en servidor, badge de stock por tarjeta.

### B2 — §3.2 Búsqueda
- Ruta `app/buscar/page.tsx` (reusa grid + filtros). Autocompletado ya en `search-bar` (B0).
- Estado "sin resultados" con sugerencias. Búsqueda por nombre/categoría.

### B3 — §3.3 Página de producto (PDP)
- Ruta `app/producto/[slug]/page.tsx` con `generateMetadata` (SEO) + JSON-LD `Product`.
- `components/product/`: `product-gallery` (zoom + miniaturas), `product-info` (precio/stock/cantidad/add),
  `product-tabs` (descripción/especificaciones), `related-products`, `reviews` (`rating-summary`, `review-list`, `review-form`).
- Criterios: botón de compra deshabilitado sin stock; metadatos presentes. (Sin variantes.)

### B4 — §3.4 Carrito
- Ruta `app/carrito/page.tsx`. `components/cart/`: `cart-line-item`, `cart-summary`, `coupon-form` (deshabilitado),
  `shipping-estimator`. Aviso de `excede_stock`. Mini-carrito ya en header (B0).

### B5 — §3.5 Checkout
- Ruta `app/checkout/page.tsx` (flujo por pasos) + `app/checkout/confirmacion/[numero]/page.tsx`.
- `components/checkout/`: `checkout-steps`, `contacto-form`, `documento-fiscal-form` (CF/CCF),
  `entrega-form` (ENVIO/RETIRO + direcciones guardadas), `pago-selector`, `revision`, `order-summary`.
- Invitado + logueado. T&C. Sin perder datos ante error.

### B6 — §3.6 Pagos
- Integrado en checkout: instrucciones de `TRANSFERENCIA` (banco + subir comprobante) y `CONTRA_ENTREGA`.
- Estados de pago: pantallas/indicadores `PENDIENTE_PAGO`/`PAGADO`/rechazado. **Sin** campos PAN/CVV.

### B7 — §3.7 Cuentas
- Rutas `(auth)`: `login`, `registro`, `recuperar`, `verificar-email`.
- Rutas `(cuenta)`: `cuenta` (panel), `cuenta/perfil`, `cuenta/direcciones`.
- `components/account/`: `account-nav`, `auth-card`, `profile-form`, `address-book`, `address-card`, `address-form`.

### B8 — §3.8 Pedidos y seguimiento
- Rutas: `cuenta/pedidos` (historial), `cuenta/pedidos/[numero]` (detalle + tracking por `historial[]`).
- `components/account/`: `order-history`, `order-detail`, `order-status-timeline`, `order-status-badge`,
  acciones: descargar factura, reordenar, solicitar cancelación/devolución.

### B9 — §3.9 Wishlist
- Ruta `cuenta/favoritos`. Lista enlazada al `wishlist-store`. Mover al carrito / quitar.

---

## Transversal (§7)
Mobile-first · accesible (focus visible, labels, teclado) · SEO (`generateMetadata`, JSON-LD, `sitemap.ts`, `robots.ts`)
· Server Components + `loading.tsx` + `next/image` (placeholder de marca por ahora).

## Verificación
`pnpm dev` → recorrer home → catálogo (filtros en URL) → PDP (agregar) → carrito → checkout → confirmación;
cuenta (login mock, direcciones, pedidos + tracking, favoritos). `pnpm build` y `npx tsc --noEmit` sin errores.
