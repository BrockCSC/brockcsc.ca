#!/usr/bin/env bash
# Shared slug rule so every workflow/script derives the same project/db names
# from a branch name. Usage: slugify.sh "feature/some Branch"
set -euo pipefail
echo "$1" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g' | sed -E 's/^-+|-+$//g' | cut -c1-40
