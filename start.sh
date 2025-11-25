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
# We need to run database migrations before starting the application

HOST="${HOST:-0.0.0.0}"
# Railway uses PORT environment variable, default to 8080 if not set
PORT="${PORT:-8080}"

# Check if DATABASE_URL is set
if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "⚠️  WARNING: DATABASE_URL is not set. Migrations will be skipped." >&2
  echo "⚠️  The application may fail if database tables don't exist." >&2
else
  echo "🔄 Running database migrations..."
  # Use drizzle-kit push for simplicity (pushes schema directly)
  # For production, consider using migrations instead
  npm run db:push || {
    echo "⚠️  Database migration failed. Attempting to continue..." >&2
    echo "⚠️  If tables don't exist, the application may fail." >&2
  }
  
  # Optionally seed the database (only if SEED_DATABASE env var is set)
  if [[ "${SEED_DATABASE:-}" == "true" ]]; then
    echo "🌱 Seeding database..."
    npm run db:seed || {
      echo "⚠️  Database seeding failed, but continuing..." >&2
    }
  fi
fi

echo "Starting application on ${HOST}:${PORT}..."
npm run start -- --hostname "${HOST}" --port "${PORT}" || {
  echo "Application failed to start" >&2
  exit 1
}
