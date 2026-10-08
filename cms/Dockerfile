# Build context is the repository root (pnpm workspace + lockfile live there).
FROM node:22-alpine AS build
RUN apk add --no-cache libc6-compat && corepack enable
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY cms/package.json cms/
RUN pnpm install --frozen-lockfile --filter cms...

COPY cms cms
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter cms build

FROM node:22-alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0 MEDIA_DIR=/app/media

RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs \
  && mkdir -p /app/media && chown nextjs:nodejs /app/media

# Standalone output is traced from the workspace root, so the server lives under cms/.
COPY --from=build --chown=nextjs:nodejs /app/cms/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/cms/.next/static ./cms/.next/static

USER nextjs
EXPOSE 3000
# Pending migrations (prodMigrations in payload.config.ts) run when Payload initializes.
CMD ["node", "cms/server.js"]
