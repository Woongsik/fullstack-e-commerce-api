FROM node:alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:alpine
WORKDIR /app
COPY --from=builder app/dist ./dist
COPY --from=builder app/node_modules ./node_modules
EXPOSE 8080
CMD ["node", "dist/src/server.js"]