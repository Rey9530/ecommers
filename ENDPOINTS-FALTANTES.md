# Endpoints / capacidades del backend — estado

El frontend (`ecommerce/`) consume la API real `/tienda` (backend en `:3010`).

> **✅ Frontend cableado:** el storefront ya consume TODOS los endpoints nuevos: filtros de
> precio/stock, badges Nuevo/Oferta + rating, sugerencias, relacionados, reseñas (`lib/api/resenas.ts`),
> favoritos backend cuando hay sesión (`lib/hooks/use-wishlist.ts`), selector de departamento/municipio
> (`components/common/municipio-select.tsx`), editar perfil, newsletter, y pedido
> cancelación/comprobante/factura. El cupón se aplica en el checkout (carrito local hasta el checkout).
>
> **⚠️ BLOQUEO — migración pendiente en el backend:** al probar en vivo, `GET /tienda/catalogo`,
> `/sugerencias`, `/:slug`, `/:slug/relacionados`, `/:slug/resenas` y `POST /tienda/newsletter`
> responden **500/400** porque falta aplicar la migración (`precio_oferta/oferta_inicio/oferta_fin`
> en `Catalogo` + tablas `Favorito`, `Resena`, `NewsletterSuscriptor`, `Cupon`). `categorias` y
> `geo` (departamentos/municipios) sí responden. **Acción:** en `sys-facturacion-bk`,
> `npx prisma migrate dev` (ojo con el puerto de la BD en `.env`). El frontend degrada sin romperse
> (catálogo vacío) hasta entonces.

**Leyenda:** ✅ implementado y cableado · 🟡 diferido/pendiente.

---

## 1. Catálogo y filtros

- ✅ **Filtros por precio (rango) y disponibilidad.** `GET /tienda/catalogo?precio_min=&precio_max=&en_stock=true`.
  El precio filtra sobre el precio **base** con IVA. El frontend puede reactivar el slider de precio y "solo en stock".
- 🟡 **Facetas de marca / color / atributos.** Diferido: el `Catalogo` no tiene atributos estructurados
  (color/medida/material). Mantener ocultas estas facetas.
- ✅ **`es_nuevo` y precio de oferta (`precio_anterior`).** El listado y la PDP ahora devuelven
  `es_nuevo`, `en_oferta` y `precio_anterior` (precio tachado). Reactivar badges "Nuevo"/"Oferta".
- ✅ **Productos relacionados.** `GET /tienda/catalogo/:slug/relacionados` (misma categoría).
- ✅ **Autocompletado de búsqueda.** `GET /tienda/catalogo/sugerencias?q=` → `[{ slug, nombre, precio, imagen }]`.
- ✅ **Selector de municipios.** `GET /tienda/departamentos` y `GET /tienda/municipios?departamento=<id>`.
  Ahora se puede enviar `id_municipio` real en direcciones/checkout.

## 2. Carrito

- ✅ **Merge de carrito invitado → cuenta.** `POST /tienda/carrito/merge` con `{ items: [{ id_catalogo, cantidad }] }`.
  Al iniciar sesión, enviar el carrito local a este endpoint (en vez de borrar + re-agregar uno por uno).
- ✅ **Cupones / códigos de descuento.** `POST /tienda/carrito/coupon` `{ codigo }` y `DELETE /tienda/carrito/coupon`.
  La respuesta del carrito ahora trae `cupon`, `descuento` y `total` ya con descuento. El checkout aplica el
  descuento al pedido automáticamente. Activar el input de cupón.

## 3. Envío / checkout

- 🟡 **Cálculo de costo de envío y métodos por zona.** Pendiente: `costo_envio` sigue en `0`.
- 🟡 **Impuestos por región.** No aplica (IVA único 13%).

## 4. Pedidos

- ✅ **Cancelación por el cliente.** `POST /tienda/pedidos/:numero/cancelacion` (dueño; invitado con `?email=`).
  Solo permite cancelar pedidos en `PENDIENTE_PAGO`. Conectar el botón "Solicitar cancelación".
- 🟡 **Descarga de factura / comprobante (DTE).** `GET /tienda/pedidos/:numero/factura` ya existe, pero
  responde `409` hasta que se emita el DTE (integración pendiente). Cuando exista `id_factura` devuelve `{ pdf_base64 }`.
- ✅ **Subida de comprobante de pago (transferencia).** `POST /tienda/pedidos/:numero/comprobante`
  (`multipart/form-data`, campo `file`) → `{ comprobante_pago_url }`. Conectar el botón de adjuntar comprobante.

## 5. Cuenta de cliente

- ✅ **Edición de perfil.** `PATCH /tienda/auth/me` con `{ nombre?, telefono?, razon_social?, nit?, registro_nrc?, giro? }`.
  El formulario de "Perfil" ya puede persistir.
- 🟡 **Envío real de correos** (verificación y reset). Los endpoints `verificar-email`, `solicitar-reset` y
  `reset-password` funcionan (generan/validan tokens), pero el **envío del correo** aún no está conectado.

## 6. Funciones antes solo-cliente

- ✅ **Wishlist / favoritos.** `GET/POST /tienda/favoritos` y `DELETE /tienda/favoritos/:id_catalogo` (Bearer).
  Migrar la wishlist de `localStorage` a estos endpoints para sincronizar con la cuenta.
- ✅ **Reseñas y calificaciones.** `GET /tienda/catalogo/:slug/resenas` (aprobadas + promedio) y
  `POST /tienda/catalogo/:slug/resenas` (Bearer, requiere compra verificada; queda pendiente de moderación).
  El promedio (`calificacion_promedio`, `total_resenas`) ya viene en listado y PDP.
- 🟡 **Suscripción a newsletter.** ✅ Backend listo: `POST /tienda/newsletter` `{ email, nombre? }`.
  Conectar el formulario del footer (antes solo mostraba confirmación local).

---

## Resumen de endpoints nuevos para el frontend

```
GET    /tienda/catalogo?precio_min=&precio_max=&en_stock=
GET    /tienda/catalogo/sugerencias?q=
GET    /tienda/catalogo/:slug/relacionados
GET    /tienda/catalogo/:slug/resenas
POST   /tienda/catalogo/:slug/resenas            (Bearer, compra verificada)
GET    /tienda/departamentos
GET    /tienda/municipios?departamento=
POST   /tienda/carrito/merge
POST   /tienda/carrito/coupon
DELETE /tienda/carrito/coupon
PATCH  /tienda/auth/me                           (Bearer)
GET    /tienda/favoritos                          (Bearer)
POST   /tienda/favoritos                          (Bearer)
DELETE /tienda/favoritos/:id_catalogo             (Bearer)
POST   /tienda/newsletter
POST   /tienda/pedidos/:numero/cancelacion
POST   /tienda/pedidos/:numero/comprobante        (multipart, campo "file")
GET    /tienda/pedidos/:numero/factura            (409 hasta que haya DTE)
```
