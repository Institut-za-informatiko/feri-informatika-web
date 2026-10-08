#!/bin/sh
# Forced command for the CI deploy key on bclabum (see DEPLOYMENT.md).
# Pulls the image tag passed by CI and restarts the container.
set -eu

cd "$(dirname "$0")"

tag="${SSH_ORIGINAL_COMMAND:-latest}"
case "$tag" in
  latest | sha-[0-9a-f]*) ;;
  *) echo "refusing tag: $tag" >&2; exit 1 ;;
esac

export IMAGE_TAG="$tag"
docker compose pull --quiet
docker compose up -d --remove-orphans

i=0
until [ "$(docker inspect -f '{{.State.Health.Status}}' feri-informatika-web)" = healthy ]; do
  i=$((i + 1))
  if [ "$i" -gt 30 ]; then
    echo "container not healthy after 60s" >&2
    docker compose logs --tail 50 >&2
    exit 1
  fi
  sleep 2
done

docker image prune -f --filter label=org.opencontainers.image.source=https://github.com/Institut-za-informatiko/feri-informatika-web
echo "deployed $tag"
