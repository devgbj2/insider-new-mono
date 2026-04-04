# =========================
# STAGE 1: Build Frontend
# =========================
FROM node:20-alpine AS fe-builder

WORKDIR /fe
COPY insider-fe/package*.json ./
RUN npm ci

COPY insider-fe/ ./
RUN npm run build

# =========================
# STAGE 2: Build Backend
# =========================
FROM node:20-alpine AS be-builder

WORKDIR /app
COPY insider-nest/package*.json ./
RUN npm ci

COPY insider-nest/ ./
COPY --from=fe-builder /fe/dist ./public

RUN npm run build

# =========================
# STAGE 3: Production
# =========================
FROM node:20-alpine

WORKDIR /app

COPY insider-nest/package*.json ./
RUN npm ci --omit=dev

COPY insider-nest/prisma ./prisma
RUN npx prisma generate

COPY --from=be-builder /app/dist ./dist
COPY --from=be-builder /app/public ./public

RUN chgrp -R 0 /app && chmod -R g+rwX /app

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

USER 1001
CMD ["node", "dist/main.js"]