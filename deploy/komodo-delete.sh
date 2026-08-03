#!/usr/bin/env bash
# Deletes a Komodo Stack. Only for branch-preview cleanup; never call this for prod/dev.
set -euo pipefail

for v in KOMODO_HOST KOMODO_API_KEY KOMODO_API_SECRET PROJECT_NAME; do
  [ -n "${!v:-}" ] || { echo "missing required env var: $v" >&2; exit 1; }
done

case "$PROJECT_NAME" in
  brockcsc-pr-*) ;;
  *)
    echo "refusing: this script only deletes brockcsc-pr-* preview stacks" >&2
    exit 1
    ;;
esac

echo "Checking whether stack '${PROJECT_NAME}' exists..."
if ! curl -sS -f -X POST "${KOMODO_HOST}/read" \
  -H "Content-Type: application/json" \
  -H "x-api-key: ${KOMODO_API_KEY}" \
  -H "x-api-secret: ${KOMODO_API_SECRET}" \
  -d "$(jq -n --arg stack "$PROJECT_NAME" '{type: "GetStack", params: {stack: $stack}}')" >/dev/null 2>&1; then
  echo "Stack '${PROJECT_NAME}' does not exist, nothing to do."
  exit 0
fi

echo "Deleting stack '${PROJECT_NAME}'..."
curl -sS -f -X POST "${KOMODO_HOST}/write" \
  -H "Content-Type: application/json" \
  -H "x-api-key: ${KOMODO_API_KEY}" \
  -H "x-api-secret: ${KOMODO_API_SECRET}" \
  -d "$(jq -n --arg id "$PROJECT_NAME" '{type: "DeleteStack", params: {id: $id}}')" >/dev/null

echo "Deleted stack '${PROJECT_NAME}'."
