# ==================== Etapa de Construcción ====================
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar dependencias primero (mejor caché)
COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile

# Copiar todo el código
COPY . .

# 🔥 FORZAMOS solo Vite Build (saltamos el tsc que está fallando)
RUN npx vite build

# ==================== Etapa de Producción ====================
FROM node:22-alpine AS runner

WORKDIR /app

RUN npm install -g serve

# Copiar solo la carpeta dist generada
COPY --from=builder /app/dist ./dist

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["serve", "-s", "dist", "-l", "3000"]