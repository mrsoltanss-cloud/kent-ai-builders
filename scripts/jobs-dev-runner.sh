#!/usr/bin/env bash
set -euo pipefail

# Config
: "${JOBS_MIN_VISIBLE:=50}"
: "${JOBS_MAX_VISIBLE:=100}"
: "${INTERVAL_SECS:=300}"   # 5 minutes by default

echo "[jobs-dev-runner] keeping ${JOBS_MIN_VISIBLE}-${JOBS_MAX_VISIBLE} jobs visible every ${INTERVAL_SECS}s"

while true; do
  echo "[jobs-dev-runner] running generator at $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
  pnpm tsx scripts/generate-jobs.ts || echo "[jobs-dev-runner] generator failed (will retry next tick)"
  sleep "${INTERVAL_SECS}"
done
