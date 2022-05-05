FROM node:16.13.2 as builder
RUN mkdir /app
WORKDIR /app
COPY package.json package.json
RUN npm install --save --legacy-peer-deps
COPY . . 
RUN npm run build

FROM caddy:2
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /app/dist /usr/share/caddy
EXPOSE 8000
