FROM node:22-alpine AS build
RUN apk add --no-cache libc6-compat && corepack enable
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Pages render on first request (no database needed at build time).
RUN pnpm build

FROM node:22-alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=80 HOSTNAME=0.0.0.0 MEDIA_DIR=/app/media

RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs \
  && mkdir -p /app/media && chown nextjs:nodejs /app/media

COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public ./public

USER nextjs
# Port 80 (unprivileged via the compose sysctl), so the reverse proxy target stays the same.
EXPOSE 80
# Pending migrations (prodMigrations in payload.config.ts) run when Payload initializes.
CMD ["node", "server.js"]
