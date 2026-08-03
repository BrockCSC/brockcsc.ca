#!/usr/bin/env bash
# Tears down branch-preview stacks whose branch is gone, or hasn't had a
# commit in the last 3 days. Run on a daily schedule.
#
# Required env vars:
#   KOMODO_HOST, KOMODO_API_KEY, KOMODO_API_SECRET
#   GH_TOKEN, GITHUB_REPOSITORY
#   BROCKCSC_DEPLOY_SSH_KEY, BROCKCSC_DEPLOY_HOST, BROCKCSC_DEPLOY_USER
set -euo pipefail

STALE_SECONDS=$((3 * 24 * 60 * 60))
NOW=$(date +%s)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

install -m 600 /dev/null /tmp/deploy_key
echo "$BROCKCSC_DEPLOY_SSH_KEY" > /tmp/deploy_key

# Map every live branch to its slug, so we can find the stack's source branch
# and check its last commit date.
branches_json=$(gh api "repos/${GITHUB_REPOSITORY}/branches" --paginate)
declare -A slug_to_branch
while IFS=$'\t' read -r name; do
  [ -n "$name" ] || continue
  slug=$("${SCRIPT_DIR}/slugify.sh" "$name")
  slug_to_branch["$slug"]="$name"
done < <(echo "$branches_json" | jq -r '.[].name')

stacks_json=$(curl -sS -f -X POST "${KOMODO_HOST}/read" \
  -H "Content-Type: application/json" \
  -H "x-api-key: ${KOMODO_API_KEY}" \
  -H "x-api-secret: ${KOMODO_API_SECRET}" \
  -d '{"type": "ListStacks", "params": {}}')

echo "$stacks_json" | jq -r '.[].name' | grep '^brockcsc-pr-' | while read -r project_name; do
  slug="${project_name#brockcsc-pr-}"
  branch="${slug_to_branch[$slug]:-}"

  should_delete=false
  if [ -z "$branch" ]; then
    echo "${project_name}: source branch no longer exists"
    should_delete=true
  else
    commit_date=$(gh api "repos/${GITHUB_REPOSITORY}/commits/${branch}" --jq '.commit.committer.date')
    commit_epoch=$(date -d "$commit_date" +%s 2>/dev/null || date -j -f "%Y-%m-%dT%H:%M:%SZ" "$commit_date" +%s)
    age=$((NOW - commit_epoch))
    if [ "$age" -gt "$STALE_SECONDS" ]; then
      echo "${project_name}: branch '${branch}' last active $((age / 86400)) days ago, stale"
      should_delete=true
    fi
  fi

  if [ "$should_delete" = true ]; then
    PROJECT_NAME="$project_name" KOMODO_HOST="$KOMODO_HOST" \
      KOMODO_API_KEY="$KOMODO_API_KEY" KOMODO_API_SECRET="$KOMODO_API_SECRET" \
      "${SCRIPT_DIR}/komodo-delete.sh"

    db_name="brockcsc_preview_${slug//-/_}"
    ssh -i /tmp/deploy_key -o StrictHostKeyChecking=accept-new \
      "${BROCKCSC_DEPLOY_USER}@${BROCKCSC_DEPLOY_HOST}" "drop-db ${db_name}"
  fi
done
