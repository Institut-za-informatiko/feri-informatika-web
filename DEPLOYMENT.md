# Deployment

| Target | URL | Workflow |
|---|---|---|
| bclabum (Docker) | https://ii-preview.bclabum.si | `.github/workflows/deploy-bclabum.yml` |
| GitHub Pages | https://institut-za-informatiko.github.io/feri-informatika-web | `.github/workflows/deploy.yml` |

Both deploy on every push to `main`.

## Base path

`astro.config.mjs` reads `SITE_URL` and `BASE_PATH` from the environment. Without them the
build targets GitHub Pages (`/feri-informatika-web`). The Dockerfile sets `BASE_PATH=/`, so the
image serves the site from the domain root.

In code, always build links from the base, never hardcode it:

```astro
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
<a href={`${base}/about`}>
```

## bclabum pipeline

1. `image` job builds the Dockerfile. Pull requests stop here (build check only).
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
