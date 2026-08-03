#!/bin/sh
# Forced-command entrypoint for the brockcsc deploy key - only these two fixed scripts can run.
set -eu
cmd="${SSH_ORIGINAL_COMMAND:-}"
action=$(printf '%s' "$cmd" | awk '{print $1}')
arg=$(printf '%s' "$cmd" | awk '{print $2}')

case "$action" in
  ensure-db)
    exec /opt/wayfarer/brockcsc/ensure-db.sh "$arg"
    ;;
  drop-db)
    exec /opt/wayfarer/brockcsc/drop-db.sh "$arg"
    ;;
  *)
    echo "unknown command" >&2
    exit 1
    ;;
esac
