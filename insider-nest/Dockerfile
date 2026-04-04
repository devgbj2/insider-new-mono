FROM node:20-alpine

WORKDIR /app

COPY insider-nest/package*.json ./
RUN npm ci

COPY insider-nest .

# prisma generate
RUN npx prisma generate

# build nest
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]