# Deployment

The site runs on bclabum at https://ii-preview.bclabum.si and deploys via
`.github/workflows/deploy-bclabum.yml` on every push to `main`.

## Architecture

```
Traefik (TLS) → web (Next.js site + Payload CMS) → cms-db (Postgres 17)
                        └─► media PVC (served at /api/media/file/*)
```

| Workload | Image | Notes |
|---|---|---|
| `web` Deployment | `ghcr.io/institut-za-informatiko/feri-informatika-web` | Digest-pinned in Git, listens on port 3000, runs pending DB migrations on start |
| `cms-db` StatefulSet | Postgres 17 | Cluster-internal PostgreSQL with persistent storage |

Publishing content needs no deploy: the app purges its page cache on every CMS change.

## Pipeline

| Trigger | What runs |
|---|---|
| Push to `main` | lint + typecheck, build and push the image, publish the digest for Argo CD to deploy |
| Pull request | lint + typecheck, build the image (nothing pushed or deployed) |
| Manual deploy | **Actions → Deploy to bclabum → Run workflow**, select `main` |

1. After lint, typecheck and image publishing succeed, the deploy job updates the image
   digest in `apps/base/feri-informatika-web/kustomization.yaml` in `bclabum-deployments`.
   It skips an already-pinned digest and only deploys the current head of `main`.
2. Argo CD watches `main` of the deployments repo and rolls out the image using the
   cluster's existing registry credentials.
3. The deploy job confirms the Git push. For rollout verification, have a BCLab operator
   check that Argo CD synced the expected revision and reports **Healthy**, then check
   `/healthz`, `/admin/login` and `/api/news?limit=1` on the public site.

### Configure CI access

A BCLab operator registers an app-specific write deploy key in the deployments repo.
Before merging the workflow PR, an administrator of this repo saves the private key as
`CLUSTER_REPO_DEPLOY_KEY` under **Settings → Secrets and variables → Actions →
New repository secret**. Copy the full private key, including its header, footer and
line breaks.

### Roll back

Disable the deploy workflow and cancel any running deploy. Ask a BCLab operator to
revert the digest commit or pin the previous digest in the deployments repo, then
confirm Argo CD is healthy. Check migration compatibility before rolling back an
image that ran database migrations. Enable the workflow again when a fixed build is ready.

## Secrets

The BCLab operator manages production secrets. For local settings, see
[Development](DEVELOPMENT.md#secrets-sops--age).

| Key | Purpose |
|---|---|
| `SERVER_URL` | Public origin of the site |
| `PAYLOAD_SECRET` | Payload's own signing secret (preview tokens, internal) |
| `POSTGRES_PASSWORD` | Database |
| `PREVIEW_SECRET` | Required by `/next/preview` to enable draft mode |
| `BETTER_AUTH_SECRET` | Signs CMS sessions (Better Auth); changing it logs everyone out |
| `RESEND_API_KEY`, `MAIL_FROM` | Sends sign-in codes via Resend from `noreply@cms.bclabum.si` (domain verified in Resend) |
| `ADMIN_EMAIL` | First administrator (`pnpm create:admin`) |

## Backups

The BCLab operator manages PostgreSQL and media backups. Request a database dump and media
archive from the operator if you need to restore a copy locally.

## Admin accounts

Sign-in is passwordless (emailed code or passkey). To add or re-activate an administrator when nobody can
sign in, run from a checkout with access to the database:

```sh
ADMIN_EMAIL=… [ADMIN_NAME=…] pnpm create:admin
```

## Local image

```sh
docker build -t feri-informatika-web .
```
