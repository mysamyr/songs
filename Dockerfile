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

FROM base AS prod

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm pkg delete scripts.prepare && \
    npm ci --omit=dev \

USER node

COPY . .

EXPOSE 3000

CMD npm run build && npm run start
