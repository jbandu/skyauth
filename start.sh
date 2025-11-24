#!/usr/bin/env bash

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="${REPO_ROOT}/skyauth"

if [[ ! -d "${APP_DIR}" ]]; then
  echo "start.sh: expected application directory at ${APP_DIR}, but it was not found." >&2
  exit 1
fi

cd "${APP_DIR}"

# Initialize NVM if available (for non-interactive shells)
# Try multiple common NVM locations
NVM_PATHS=(
  "${HOME}/.nvm"
  "/home/ubuntu/.nvm"
  "/root/.nvm"
  "${NVM_DIR:-}"
)

NVM_FOUND=false
for NVM_PATH in "${NVM_PATHS[@]}"; do
  if [[ -n "${NVM_PATH}" && -s "${NVM_PATH}/nvm.sh" ]]; then
    export NVM_DIR="${NVM_PATH}"
    # shellcheck source=/dev/null
    source "${NVM_DIR}/nvm.sh"
    NVM_FOUND=true
    break
  fi
done

# If NVM was found, ensure a Node version is loaded
if [[ "${NVM_FOUND}" == "true" ]]; then
  # Use default Node version if available, or try to use the latest installed version
  if command -v nvm >/dev/null 2>&1; then
    # Try to use default version, or fall back to any installed version
    nvm use default 2>/dev/null || {
      # If no default, try to use the latest installed version
      INSTALLED_VERSION=$(nvm list --no-colors 2>/dev/null | grep -E '^[[:space:]]*\*?[[:space:]]*v[0-9]' | head -1 | sed 's/^[[:space:]]*\*?[[:space:]]*//' | awk '{print $1}')
      if [[ -n "${INSTALLED_VERSION}" ]]; then
        nvm use "${INSTALLED_VERSION}" 2>/dev/null || true
      fi
    }
    # Ensure PATH includes Node binaries even if nvm use didn't work
    if [[ -d "${NVM_DIR}/versions/node" ]]; then
      # Find the latest installed Node version and add it to PATH
      LATEST_NODE=$(find "${NVM_DIR}/versions/node" -maxdepth 1 -type d -name "v*" 2>/dev/null | sort -V | tail -1)
      if [[ -n "${LATEST_NODE}" && -d "${LATEST_NODE}/bin" ]]; then
        export PATH="${LATEST_NODE}/bin:${PATH}"
      fi
    fi
  fi
fi

# Check if npm is available
if ! command -v npm >/dev/null 2>&1; then
  echo "start.sh: npm is required but was not found in PATH." >&2
  echo "start.sh: PATH=${PATH}" >&2
  echo "start.sh: NVM_DIR=${NVM_DIR:-not set}" >&2
  echo "start.sh: HOME=${HOME:-not set}" >&2
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
