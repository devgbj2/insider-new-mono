# =========================
# PRODUCTION ONLY
# =========================
FROM node:20-alpine

WORKDIR /app

# Install production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Prisma (tetap penting)
COPY prisma ./prisma
RUN npx prisma generate

# Copy hasil build dari CI
COPY dist ./dist
COPY public ./public

# Permission for OKD (lu udah bener)
RUN chgrp -R 0 /app && chmod -R g+rwX /app

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

USER 1001

CMD ["node", "dist/main.js"]