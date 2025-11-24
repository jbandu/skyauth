#!/usr/bin/env bash

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="${REPO_ROOT}/skyauth"

if [[ ! -d "${APP_DIR}" ]]; then
  echo "start.sh: expected application directory at ${APP_DIR}, but it was not found." >&2
  exit 1
fi

cd "${APP_DIR}"

if ! command -v npm >/dev/null 2>&1; then
  echo "start.sh: npm is required but was not found in PATH." >&2
  exit 1
fi

if [[ -f package-lock.json ]]; then
  npm ci --include=dev
else
  npm install
fi

npm run build

HOST="${HOST:-0.0.0.0}"
PORT="${PORT:-3000}"

npm run start -- --hostname "${HOST}" --port "${PORT}"
