#!/bin/sh
# Forced-command entrypoint for the brockcsc CI deploy key (see authorized_keys
# on the VPS: command="/opt/wayfarer/brockcsc/ssh-dispatch.sh"). Whatever the
# SSH client actually asked for lands in SSH_ORIGINAL_COMMAND; only these two
# exact, fixed scripts can ever run, regardless of what's requested.
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
