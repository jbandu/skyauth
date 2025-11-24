#!/usr/bin/env bash

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="${REPO_ROOT}/skyauth"

if [[ ! -d "${APP_DIR}" ]]; then
  echo "start.sh: expected application directory at ${APP_DIR}, but it was not found." >&2
  exit 1
fi

cd "${APP_DIR}"

# Nixpacks already handles npm installation and build during the build phase
# We just need to start the application here

HOST="${HOST:-0.0.0.0}"
# Railway uses PORT environment variable, default to 8080 if not set
PORT="${PORT:-8080}"

echo "Starting application on ${HOST}:${PORT}..."
npm run start -- --hostname "${HOST}" --port "${PORT}" || {
  echo "Application failed to start" >&2
  exit 1
}
