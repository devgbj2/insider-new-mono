FROM node:20-alpine

WORKDIR /app

COPY insider-nest/package*.json ./
RUN npm ci

COPY insider-nest .

# 👉 TAMBAH INI (fix permission)
RUN mkdir -p /app/logs && chmod -R 777 /app/logs

# prisma generate
RUN npx prisma generate

# build nest
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]