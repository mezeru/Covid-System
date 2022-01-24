FROM node:16.13.2
RUN mkdir /app
WORKDIR /app
COPY package.json package.json
RUN npm install
COPY . .
RUN npm run build

EXPOSE 8000