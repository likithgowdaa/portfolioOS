#!/usr/bin/env bash
# Run the frontend and backend development servers together.
#
#   scripts/dev.sh          start both servers
#   scripts/dev.sh --backend|--frontend   start only one
#
# Requires: Node.js + npm, Python 3.12+ with a backend/.venv (see README).

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUN_BACKEND=1
RUN_FRONTEND=1

case "${1:-}" in
  --backend) RUN_FRONTEND=0 ;;
  --frontend) RUN_BACKEND=0 ;;
  "") ;;
  *) echo "usage: dev.sh [--backend | --frontend]" >&2; exit 1 ;;
esac

cleanup() {
  jobs -p | xargs -r kill 2>/dev/null || true
}
trap cleanup EXIT INT TERM

if [[ "$RUN_BACKEND" == 1 ]]; then
  echo "→ backend  http://localhost:8000  (uvicorn)"
  (cd "$ROOT/backend" && .venv/Scripts/python.exe -m uvicorn app.main:app --reload --port 8000) &
fi

if [[ "$RUN_FRONTEND" == 1 ]]; then
  echo "→ frontend http://localhost:3000  (next dev)"
  (cd "$ROOT/frontend" && npm run dev) &
fi

wait
