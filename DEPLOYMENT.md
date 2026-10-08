# Deployment

The site runs on bclabum at https://ii-preview.bclabum.si and deploys via
`.github/workflows/deploy-bclabum.yml`.

## Architecture

```
Cloudflare → Nginx Proxy Manager (TLS) → web (nginx, static Astro build)
                                           ├─ /admin, /api, /_next → cms (Payload, :3000)
                                           └─ everything else      → static files
cms ↔ cms-db (Postgres 17)     uploads: volume cms-media (served by cms at /api/media/file/*)
```

| Container | Image | Notes |
|---|---|---|
| `feri-informatika-web` | `ghcr.io/institut-za-informatiko/feri-informatika-web` | Only container on `nginx-proxy-internal`; NPM proxies `ii-preview.bclabum.si` to it on port 80 |
| `feri-informatika-web-cms` | `ghcr.io/institut-za-informatiko/feri-informatika-web-cms` | Runs pending DB migrations on start |
| `feri-informatika-web-cms-db` | `postgres:17-alpine` | Volume `cms-db` |

## When it deploys

| Trigger | What runs |
|---|---|
| Push to `main` | lint + typecheck, build both images, deploy both |
| Content published in the CMS | `repository_dispatch: cms-publish` → rebuild only the site image, deploy it; the CMS keeps its current image |
| Pull request | lint + build both images (nothing pushed or deployed) |
| Manual | *Run workflow* on the Actions tab |

The site image is built from the **live** CMS (`CMS_URL=https://ii-preview.bclabum.si`),
so it always reflects published content. A PR that adds CMS fields builds against the
old schema until it is merged and the new CMS image is deployed.

## Base path

`astro.config.mjs` reads `SITE_URL` and `BASE_PATH` from the environment and defaults to
`https://ii-preview.bclabum.si` served from `/`. In code, build links from the base:

```astro
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
<a href={`${base}/about`}>
```

## Pipeline details

1. `deploy` SSHes to bclabum with `BCLABUM_DEPLOY_KEY`. On the server that key may only
   run `deploy/deploy.sh` (forced command in `~urban/.ssh/authorized_keys`). It receives
   `"<web tag> <cms tag|current>"` and pipes the job's `GITHUB_TOKEN` on stdin for the
   GHCR pull, so the packages stay private.
2. `deploy.sh` pulls, restarts, waits until both containers are healthy.
3. The smoke test hits the public URL, `/admin/login` and the API.

Repository secrets: `BCLABUM_DEPLOY_KEY`, `BCLABUM_KNOWN_HOSTS`.

## Server layout

`/home/urban/feri-informatika-web/`:

| File | Source |
|---|---|
| `docker-compose.yml`, `deploy.sh`, `backup.sh` | this repo (`docker-compose.yml`, `deploy/`) |
| `.env` | decrypted `.env.enc` (`just decrypt`) |
| `.cms-tag` | written by `deploy.sh`: the CMS image tag currently running |
| `backups/` | written by `backup.sh` |

Deploys never touch these files. After changing any of them in the repo, copy them over:

```sh
scp docker-compose.yml deploy/deploy.sh deploy/backup.sh .env urban@157.180.6.182:feri-informatika-web/
```

## Secrets

`.env.enc` (sops + age, see `.sops.yaml`) holds:

| Key | Purpose |
|---|---|
| `SERVER_URL` | Public origin of the CMS |
| `PAYLOAD_SECRET` | Signs CMS sessions; changing it logs everyone out |
| `POSTGRES_PASSWORD` | CMS database |
| `GITHUB_DISPATCH_TOKEN` | Fine-grained PAT for this repo, *Contents: write*; lets the CMS trigger rebuilds. Without it, published content only appears on the next push to `main`. |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | First administrator (`cms/scripts/create-admin.ts`) |

## Backups

`deploy/backup.sh` dumps Postgres and tars the media volume into `backups/`, keeping 7 days.
Cron on bclabum (`crontab -e` as `urban`):

```
17 3 * * * ~/feri-informatika-web/backup.sh >> ~/feri-informatika-web/backups/backup.log 2>&1
```

Restore:

```sh
docker exec -i feri-informatika-web-cms-db pg_restore -U payload -d payload --clean --if-exists < backups/db-<stamp>.dump
docker run --rm --volumes-from feri-informatika-web-cms -v "$PWD/backups:/backups" alpine \
  sh -c 'rm -rf /app/media/* && tar -xzf /backups/media-<stamp>.tar.gz -C /app'
```

## Admin accounts

Create or reset an administrator from a checkout with access to the database:

```sh
ADMIN_EMAIL=… ADMIN_PASSWORD=… pnpm --filter cms create:admin
```

## Local

```sh
docker build -f cms/Dockerfile -t feri-informatika-web-cms .
docker build --build-arg CMS_URL=http://host.docker.internal:3000 -t feri-informatika-web .
```
