FROM node:16.13.2 as build-stage
RUN mkdir /app
WORKDIR /app
COPY package.json package.json
RUN npm install --save --legacy-peer-deps
COPY . .
RUN npm run build

FROM nginx
COPY --from=build-stage /app/dist/ /usr/share/nginx/html
