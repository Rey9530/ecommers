# syntax=docker/dockerfile:1.7
#
# Multi-stage Dockerfile para Next.js ecommerce
# - Stage deps:    instala deps con pnpm (requerido por pnpm-workspace.yaml
#                  que usa sintaxis de pnpm 10: `allowBuilds`)
# - Stage builder: compila Next con output: 'standalone'
# - Stage runner:  imagen final mínima, usuario no-root, ~150 MB
#
# Build-arg:
#   NEXT_PUBLIC_API_URL  -> URL del backend ERP (se embebe en el bundle del cliente)
# ==============================================================================

# ----------------------------------------------------------------------------
# 1) deps — instalar dependencias (incluye devDependencies para el build)
# ----------------------------------------------------------------------------
FROM node:22-alpine AS deps

WORKDIR /app

# pnpm v10: requerido por pnpm-workspace.yaml del proyecto (campo `allowBuilds`
# es sintaxis nueva de pnpm 10; pnpm 9 falla con "packages field missing or empty")
RUN npm install -g pnpm@10

# Copiamos solo manifests para aprovechar cache de capas
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Cache mount del store de pnpm para acelerar builds incrementales
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# ----------------------------------------------------------------------------
# 2) builder — compilar Next.js en modo standalone
# ----------------------------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production

RUN npm install -g pnpm@10

# Reutilizar node_modules del stage anterior (más rápido que re-instalar)
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-arg para URL del backend. NEXT_PUBLIC_* se embebe en el bundle JS,
# por eso debe estar disponible durante `next build`.
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Cache mount + pnpm fetch por si la lockfile cambió
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm build

# ----------------------------------------------------------------------------
# 3) runner — imagen final, mínima, no-root
# ----------------------------------------------------------------------------
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    TZ=America/El_Salvador \
    NEXT_TELEMETRY_DISABLED=1

# Zona horaria (consistente con sys-facturacion-bk)
RUN apk add --no-cache tzdata && \
    ln -sf /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone

# Usuario no-root (UID 1001, convención oficial imagen node)
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs nextjs

# Artefactos de producción:
#  - standalone/ trae server.js, package.json mínimo y node_modules tree-shakeado
#  - static/ son los assets del cliente que NO entran en el tree-shaking
#  - public/ es la carpeta /public servida estáticamente
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

# Entry point estándar que Next 16 genera dentro de .next/standalone/
CMD ["node", "server.js"]
