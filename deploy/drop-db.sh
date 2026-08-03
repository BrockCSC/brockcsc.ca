#!/bin/sh
# Restricted to brockcsc_preview_* so this can never touch prod/dev.
set -eu
DB_NAME="${1:?usage: drop-db.sh <db_name>}"

case "$DB_NAME" in
  brockcsc_preview_*) ;;
  *)
    echo "refusing: can only drop brockcsc_preview_* databases" >&2
    exit 1
    ;;
esac

echo "$DB_NAME" | grep -Eq '^[a-z0-9_]+$' || {
  echo "refusing: invalid db name '$DB_NAME'" >&2
  exit 1
}

sudo docker exec postgres psql -U postgres -c "DROP DATABASE IF EXISTS $DB_NAME"
