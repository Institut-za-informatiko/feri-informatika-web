FROM node:22-alpine AS build

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Served from the domain root; the GitHub Pages build keeps the /feri-informatika-web default.
ARG SITE_URL=https://ii-preview.bclabum.si
ARG BASE_PATH=/
ENV SITE_URL=$SITE_URL BASE_PATH=$BASE_PATH
RUN pnpm build

FROM nginx:1.29-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
