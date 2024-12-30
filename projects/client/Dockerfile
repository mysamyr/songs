FROM node:22-alpine AS base
WORKDIR /opt/app

FROM base AS dev

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev \

USER node

COPY . .

EXPOSE 3000

CMD npm run start:dev & npm run build:dev

FROM base AS build

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm ci --omit=dev

COPY public/ public
COPY src/ src
COPY webpack.prod.js webpack.prod.js
COPY default.conf default.conf

RUN npm run build

FROM nginx:alpine AS prod

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=build /opt/app/public .
COPY --from=build /opt/app/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]