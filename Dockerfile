# syntax = docker/dockerfile:1

ARG NODE_VERSION=18.19.0
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="NodeJS"

WORKDIR /app

ENV NODE_ENV=production

FROM base as build

RUN apt-get update -qq && \
    apt-get install -y python-is-python3 pkg-config build-essential

COPY --link package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

COPY --link . .

RUN yarn run build

FROM nginx:alpine as final

# Copia los archivos construidos a la ubicación de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia el archivo de configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
