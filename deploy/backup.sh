#!/bin/sh
# Daily CMS backup on bclabum: Postgres dump + media volume, kept for 7 days.
# Cron (crontab -e as urban):  17 3 * * * ~/feri-informatika-web/backup.sh >> ~/feri-informatika-web/backups/backup.log 2>&1
set -eu

cd "$(dirname "$0")"
mkdir -p backups
stamp="$(date +%Y%m%d-%H%M%S)"

docker exec feri-informatika-web-cms-db pg_dump -U payload -d payload -Fc > "backups/db-$stamp.dump"
docker run --rm \
  --volumes-from feri-informatika-web \
  -v "$PWD/backups:/backups" \
  --user "$(id -u):$(id -g)" \
  alpine tar -czf "/backups/media-$stamp.tar.gz" -C /app media

find backups -name 'db-*.dump' -mtime +7 -delete
find backups -name 'media-*.tar.gz' -mtime +7 -delete
echo "$(date -Is) backup $stamp ok"
