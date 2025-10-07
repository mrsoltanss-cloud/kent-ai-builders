#!/usr/bin/env bash
set -euo pipefail

PROJECT_NAME="kent-ai-builders"
RELEASE_TAG="v1.0.0-sprint1-microq-$(date +%Y%m%d-%H%M)"
LIVE_URL_DEFAULT="https://brixel.uk"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR=".backups/release-$STAMP"
mkdir -p "$BACKUP_DIR"

# Ensure vercel CLI
command -v vercel >/dev/null 2>&1 || npm i -g vercel

# Tag & push
git add -A || true
git diff --cached --quiet || git commit -m "Release: $RELEASE_TAG"
git tag -a "$RELEASE_TAG" -m "Release $RELEASE_TAG" || true
git push origin HEAD --follow-tags || git push --tags || true

# Link project (no-op if already linked)
vercel link --yes || true

# Pull production env
[ -f .env.production.local ] && cp .env.production.local "$BACKUP_DIR/.env.production.local.bak"
vercel env pull .env.production.local --environment=production --yes

# Ensure required env keys exist
require_env () {
  KEY="$1"; DEFAULT="$2"
  grep -q "^$KEY=" .env.production.local 2>/dev/null || {
    echo "$DEFAULT" | vercel env add "$KEY" production || true
    vercel env pull .env.production.local --environment=production --yes
  }
}
require_env "NEXTAUTH_URL" "$LIVE_URL_DEFAULT"
require_env "NEXTAUTH_SECRET" ""
require_env "OPENAI_API_KEY" ""
require_env "DATABASE_URL" ""

# Load env and migrate prod DB
set -a; source .env.production.local; set +a
[ -z "${DATABASE_URL:-}" ] && { echo "ERROR: DATABASE_URL missing in Production env."; exit 1; }
cp prisma/schema.prisma "$BACKUP_DIR/schema.prisma.bak"
npx prisma generate
npx prisma migrate deploy

# Deploy to Vercel Production
npx vercel --prod --yes

echo "== DONE =="
echo "Tag: $RELEASE_TAG"
echo "Env: .env.production.local (backup: $BACKUP_DIR)"
echo "Live URL: ${NEXTAUTH_URL:-$LIVE_URL_DEFAULT}"
