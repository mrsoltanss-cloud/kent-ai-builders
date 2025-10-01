#!/usr/bin/env bash
set -Eeuo pipefail

PORT="${PORT:-3001}"
DB_CONT="kabdb_manual"
DB_IMAGE="postgres:16"

echo "▶ Starting Postgres ($DB_IMAGE)…"
docker rm -f "$DB_CONT" >/dev/null 2>&1 || true
docker run -d --name "$DB_CONT" -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=kab -p 0.0.0.0::5432 "$DB_IMAGE" >/dev/null
sleep 1
DB_HOST_PORT=$(docker port "$DB_CONT" 5432/tcp | sed 's/.*://')
echo "  → Postgres on host port $DB_HOST_PORT"

echo "▶ Wiring .env"
DB_URL="postgresql://postgres:postgres@localhost:${DB_HOST_PORT}/kab?schema=public"
[[ -f .env ]] || touch .env
awk -v url="$DB_URL" '
BEGIN{set=0}
$0 ~ /^DATABASE_URL=/ {print "DATABASE_URL=\"" url "\""; set=1; next}
{print}
END{if(!set) print "DATABASE_URL=\"" url "\""}' .env > .env.tmp && mv .env.tmp .env
grep -q '^NEXTAUTH_URL=' .env || echo 'NEXTAUTH_URL="http://localhost:'"$PORT"'"' >> .env
grep -q '^NEXTAUTH_SECRET=' .env || echo 'NEXTAUTH_SECRET="dev-secret-change-me"' >> .env
echo "  → DATABASE_URL=$DB_URL"

echo "▶ Prisma migrate"
pnpm prisma migrate deploy

echo "▶ Build (skip if already built)"
pnpm build >/dev/null || true

echo "▶ Start Next on :$PORT"
PORT="$PORT" pnpm start
