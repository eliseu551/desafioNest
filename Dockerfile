# ─────────────────────────────────────────
# Stage 1: Dependencies
# ─────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml .npmrc ./
RUN corepack enable && pnpm install --frozen-lockfile

# ─────────────────────────────────────────
# Stage 2: Builder
# ─────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Gera Prisma Client e build do Nest
RUN corepack enable \
  && pnpm prisma generate \
  && pnpm build \
  && ls -la dist

# ─────────────────────────────────────────
# Stage 3: Production Runner
# ─────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copia dist, prisma e node_modules do builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma        
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./                            

EXPOSE 3000

CMD ["node", "dist/main.js"]