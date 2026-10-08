# Deployment

The site runs on bclabum at https://ii-preview.bclabum.si and deploys on every push to
`main` via `.github/workflows/deploy-bclabum.yml`.

## Base path

`astro.config.mjs` reads `SITE_URL` and `BASE_PATH` from the environment and defaults to
`https://ii-preview.bclabum.si` served from `/`.

In code, always build links from the base, never hardcode it:

```astro
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
<a href={`${base}/about`}>
```

## bclabum pipeline

1. `lint` runs `pnpm lint:ci`; `image` builds the Dockerfile. Pull requests stop here (build check only).
   On `main` the image is pushed to `ghcr.io/institut-za-informatiko/feri-informatika-web`
   as `sha-<commit>` and `latest`.
2. `deploy` job SSHes to bclabum with `BCLABUM_DEPLOY_KEY`. On the server that key may only run
   `deploy/deploy.sh` (forced command in `~urban/.ssh/authorized_keys`), which pulls the tag,
   restarts the container and waits for `/healthz`.
3. Smoke test hits the public URL.

Server layout (`/home/urban/feri-informatika-web/`): `docker-compose.yml` and `deploy.sh`,
copied from this repo. Re-copy them by hand when either changes:

```sh
scp docker-compose.yml deploy/deploy.sh urban@157.180.6.182:feri-informatika-web/
```

The container has no published ports. Nginx Proxy Manager (`nginx-manager`) reaches it as
`feri-informatika-web:80` over the `nginx-proxy-internal` network and terminates TLS.

Repository secrets: `BCLABUM_DEPLOY_KEY` (private key), `BCLABUM_KNOWN_HOSTS`
(`ssh-keyscan 157.180.6.182`).

## Local

```sh
docker build -t feri-informatika-web .
docker run --rm -p 8080:80 feri-informatika-web
```
