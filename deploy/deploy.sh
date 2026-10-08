#!/bin/sh
# Forced command for the CI deploy key on bclabum (see DEPLOYMENT.md).
# Arguments (via SSH_ORIGINAL_COMMAND): "<web tag> <cms tag>", where the cms tag may be
# "current" to keep the running CMS image (content-only rebuilds).
# CI pipes its short-lived GITHUB_TOKEN on stdin so the GHCR packages can stay private.
set -eu

cd "$(dirname "$0")"

valid() {
  case "$1" in
    latest | sha-[0-9a-f]*) return 0 ;;
    *) return 1 ;;
  esac
}

# shellcheck disable=SC2086
set -- ${SSH_ORIGINAL_COMMAND:-latest current}
web_tag="$1"
cms_tag="${2:-current}"

valid "$web_tag" || { echo "refusing web tag: $web_tag" >&2; exit 1; }
if [ "$cms_tag" = current ]; then
  cms_tag="$(cat .cms-tag 2>/dev/null || echo latest)"
fi
valid "$cms_tag" || { echo "refusing cms tag: $cms_tag" >&2; exit 1; }

export IMAGE_TAG="$web_tag" CMS_IMAGE_TAG="$cms_tag"
export DOCKER_CONFIG="$(mktemp -d)"
trap 'rm -rf "$DOCKER_CONFIG"' EXIT
docker login ghcr.io -u github-actions --password-stdin >/dev/null
docker compose pull --quiet web cms
docker compose up -d --remove-orphans
echo "$cms_tag" > .cms-tag

wait_healthy() {
  i=0
  until [ "$(docker inspect -f '{{.State.Health.Status}}' "$1")" = healthy ]; do
    i=$((i + 1))
    if [ "$i" -gt 60 ]; then
      echo "$1 not healthy after 120s" >&2
      docker compose logs --tail 50 >&2
      exit 1
    fi
    sleep 2
  done
}
wait_healthy feri-informatika-web-cms
wait_healthy feri-informatika-web

docker image prune -f --filter label=org.opencontainers.image.source=https://github.com/Institut-za-informatiko/feri-informatika-web
echo "deployed web=$web_tag cms=$cms_tag"
