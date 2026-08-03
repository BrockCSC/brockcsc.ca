#!/usr/bin/env bash
# Create-or-update + deploy a Komodo Stack for one environment. Identical
# across prod/dev/preview; only the env vars the caller sets differ.
set -euo pipefail

for v in KOMODO_HOST KOMODO_API_KEY KOMODO_API_SECRET PROJECT_NAME IMAGE_TAG \
  SUBDOMAIN GIT_BRANCH DATABASE_URL KEYCLOAK_ISSUER KEYCLOAK_CLIENT_ID \
  KEYCLOAK_CLIENT_SECRET ADMIN_ROLE SESSION_JWT_SECRET; do
  [ -n "${!v:-}" ] || { echo "missing required env var: $v" >&2; exit 1; }
done

komodo_call() {
  local endpoint="$1" type="$2" params="$3"
  curl -sS -f -X POST "${KOMODO_HOST}/${endpoint}" \
    -H "Content-Type: application/json" \
    -H "x-api-key: ${KOMODO_API_KEY}" \
    -H "x-api-secret: ${KOMODO_API_SECRET}" \
    -d "$(jq -n --arg type "$type" --argjson params "$params" '{type: $type, params: $params}')"
}

ENVIRONMENT=$(jq -n \
  --arg image_tag "$IMAGE_TAG" \
  --arg project_name "$PROJECT_NAME" \
  --arg subdomain "$SUBDOMAIN" \
  --arg database_url "$DATABASE_URL" \
  --arg keycloak_issuer "$KEYCLOAK_ISSUER" \
  --arg keycloak_client_id "$KEYCLOAK_CLIENT_ID" \
  --arg keycloak_client_secret "$KEYCLOAK_CLIENT_SECRET" \
  --arg admin_role "$ADMIN_ROLE" \
  --arg session_jwt_secret "$SESSION_JWT_SECRET" \
  -r '[
    "IMAGE_TAG=\($image_tag)",
    "PROJECT_NAME=\($project_name)",
    "SUBDOMAIN=\($subdomain)",
    "DATABASE_URL=\($database_url)",
    "KEYCLOAK_ISSUER=\($keycloak_issuer)",
    "KEYCLOAK_CLIENT_ID=\($keycloak_client_id)",
    "KEYCLOAK_CLIENT_SECRET=\($keycloak_client_secret)",
    "ADMIN_ROLE=\($admin_role)",
    "SESSION_JWT_SECRET=\($session_jwt_secret)"
  ] | join("\n")')

CONFIG=$(jq -n \
  --arg server "wayfarerbx-vps" \
  --arg repo "BrockCSC/website" \
  --arg branch "$GIT_BRANCH" \
  --arg environment "$ENVIRONMENT" \
  '{
    server: $server,
    repo: $repo,
    branch: $branch,
    git_provider: "github.com",
    file_paths: ["deploy/docker-compose.yml"],
    auto_pull: true,
    destroy_before_deploy: false,
    webhook_enabled: false,
    environment: $environment
  }')

echo "Checking whether stack '${PROJECT_NAME}' already exists..."
if komodo_call "read" "GetStack" "$(jq -n --arg stack "$PROJECT_NAME" '{stack: $stack}')" >/tmp/stack.json 2>/dev/null; then
  echo "Stack exists, updating config..."
  komodo_call "write" "UpdateStack" "$(jq -n --arg id "$PROJECT_NAME" --argjson config "$CONFIG" '{id: $id, config: $config}')" >/dev/null
else
  echo "Stack does not exist, creating it..."
  komodo_call "write" "CreateStack" "$(jq -n --arg name "$PROJECT_NAME" --argjson config "$CONFIG" '{name: $name, config: $config}')" >/dev/null
fi

echo "Deploying stack '${PROJECT_NAME}'..."
komodo_call "execute" "DeployStack" "$(jq -n --arg stack "$PROJECT_NAME" '{stack: $stack}')" >/tmp/deploy.json

echo "Deploy triggered for ${PROJECT_NAME} -> https://${SUBDOMAIN}"
