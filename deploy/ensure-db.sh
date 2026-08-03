#!/bin/sh
# Idempotently create + migrate a brockcsc Postgres database. Restricted to
# names under our own prefix so a bad CI input can't touch other apps' DBs.
set -eu
DB_NAME="${1:?usage: ensure-db.sh <db_name>}"

case "$DB_NAME" in
  brockcsc_*) ;;
  *)
    echo "refusing: db name must start with brockcsc_" >&2
    exit 1
    ;;
esac

echo "$DB_NAME" | grep -Eq '^[a-z0-9_]+$' || {
  echo "refusing: invalid db name '$DB_NAME'" >&2
  exit 1
}

EXISTS=$(sudo docker exec postgres psql -U postgres -tAc \
  "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")

if [ "$EXISTS" != "1" ]; then
  sudo docker exec postgres psql -U postgres -c "CREATE DATABASE $DB_NAME OWNER brockcsc"
  sudo docker exec -i postgres psql -U postgres -d "$DB_NAME" < /opt/wayfarer/brockcsc/001_init.sql
fi
