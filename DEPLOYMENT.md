# Deployment

The site runs on bclabum at https://ii-preview.bclabum.si and deploys via
`.github/workflows/deploy-bclabum.yml` on every push to `main`.

## Architecture

```
Cloudflare → Nginx Proxy Manager (TLS) → feri-informatika-web:80 (Next.js: site + CMS)
                                                   │
                                                   └─► feri-informatika-web-cms-db (Postgres 17)
uploads: volume cms-media (served by the app at /api/media/file/*)
```

| Container | Image | Notes |
|---|---|---|
| `feri-informatika-web` | `ghcr.io/institut-za-informatiko/feri-informatika-web` | On `nginx-proxy-internal`; listens on port 80; runs pending DB migrations on start |
| `feri-informatika-web-cms-db` | `postgres:17-alpine` | Volume `cms-db`; only on the internal network |

Publishing content needs no deploy: the app purges its page cache on every CMS change.

## Pipeline

| Trigger | What runs |
|---|---|
| Push to `main` | lint + typecheck, build and push the image, deploy, smoke test |
| Pull request | lint + typecheck, build the image (nothing pushed or deployed) |
| Manual | *Run workflow* on the Actions tab |

1. `deploy` SSHes to bclabum with `BCLABUM_DEPLOY_KEY`. On the server that key may only run
   `deploy/deploy.sh` (forced command in `~urban/.ssh/authorized_keys`). It receives the image
   tag and the job's `GITHUB_TOKEN` on stdin for the GHCR pull, so the package stays private.
2. `deploy.sh` pulls, restarts and waits until the container is healthy (`/healthz`).
3. The smoke test hits the public site, `/admin/login` and the API.

Repository secrets: `BCLABUM_DEPLOY_KEY`, `BCLABUM_KNOWN_HOSTS`.

## Server layout

`/home/urban/feri-informatika-web/`:

| File | Source |
|---|---|
| `docker-compose.yml`, `deploy.sh`, `backup.sh` | this repo (`docker-compose.yml`, `deploy/`) |
| `.env` | decrypted `.env.enc` (`just decrypt`) |
| `backups/` | written by `backup.sh` |

Deploys never touch these files. After changing any of them in the repo, copy them over:

```sh
scp docker-compose.yml deploy/deploy.sh deploy/backup.sh .env urban@157.180.6.182:/home/urban/feri-informatika-web/
```

## Secrets

`.env.enc` (sops + age, see `.sops.yaml`):

| Key | Purpose |
|---|---|
| `SERVER_URL` | Public origin of the site |
| `PAYLOAD_SECRET` | Payload's own signing secret (preview tokens, internal) |
| `POSTGRES_PASSWORD` | Database |
| `PREVIEW_SECRET` | Required by `/next/preview` to enable draft mode |
| `BETTER_AUTH_SECRET` | Signs CMS sessions (Better Auth); changing it logs everyone out |
| `RESEND_API_KEY`, `MAIL_FROM` | Sends sign-in links via Resend from `noreply@cms.bclabum.si` (domain verified in Resend) |
| `ADMIN_EMAIL` | First administrator (`pnpm create:admin`) |

## Backups

`deploy/backup.sh` dumps Postgres and tars the media volume into `backups/`, keeping 7 days.
Cron on bclabum (`crontab -e` as `urban`):

```
17 3 * * * /home/urban/feri-informatika-web/backup.sh >> /home/urban/feri-informatika-web/backups/backup.log 2>&1
```

Restore:

```sh
docker exec -i feri-informatika-web-cms-db pg_restore -U payload -d payload --clean --if-exists < backups/db-<stamp>.dump
docker run --rm --volumes-from feri-informatika-web -v "$PWD/backups:/backups" alpine \
  sh -c 'rm -rf /app/media/* && tar -xzf /backups/media-<stamp>.tar.gz -C /app'
```

## Admin accounts

Sign-in is passwordless (magic link). To add or re-activate an administrator when nobody can
sign in, run from a checkout with access to the database:

```sh
ADMIN_EMAIL=… [ADMIN_NAME=…] pnpm create:admin
```

## Local image

```sh
docker build -t feri-informatika-web .
```
