FROM node:22 as deps
WORKDIR /opt/shop
COPY package.json package-lock.json ./
COPY .env.docker .env
RUN npm install

FROM node:22 AS builder
WORKDIR /opt/shop
COPY . .
COPY --from=deps /opt/shop/node_modules ./node_modules
RUN npm run build

FROM node:22 AS runner
WORKDIR /opt/shop
ENV NODE_ENV=production
COPY --from=builder /opt/shop/.env.docker ./.env
COPY --from=builder /opt/shop/public ./public
COPY --from=builder /opt/shop/.next ./.next
COPY --from=builder /opt/shop/node_modules ./node_modules
COPY --from=builder /opt/shop/package.json ./package.json
ENTRYPOINT node_modules/.bin/next start -p 3000
