FROM node:22-alpine AS build

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY cms/package.json cms/
RUN pnpm install --frozen-lockfile --filter feri-informatika-web

COPY . .

# Content is fetched from the CMS REST API at build time (published documents only).
ARG SITE_URL=https://ii-preview.bclabum.si
ARG CMS_URL=https://ii-preview.bclabum.si
# Changes on every CI run so a cached layer never serves stale CMS content.
ARG CONTENT_REVISION=dev
ENV SITE_URL=$SITE_URL CMS_URL=$CMS_URL CONTENT_REVISION=$CONTENT_REVISION
RUN pnpm build

FROM nginx:1.29-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
