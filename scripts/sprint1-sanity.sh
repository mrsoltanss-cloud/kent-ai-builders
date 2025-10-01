#!/usr/bin/env bash
set -Eeuo pipefail

PORT="${PORT:-3001}"
BASE="http://localhost:$PORT"
summary=(); fails=0

say(){ printf "\n\033[1;36m▶ %s\033[0m\n" "$*"; }
pass(){ printf "  ✅ %s\n" "$*"; summary+=("PASS  $*"); }
fail(){ printf "  ❌ %s\n" "$*"; summary+=("FAIL  $*"); fails=$((fails+1)); }

# 0) Postgres (Docker)
say "Start Postgres (Docker)"
docker rm -f kabdb >/dev/null 2>&1 || true
docker run -d --name kabdb -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=kab -p 5432:5432 postgres:16 >/dev/null
pass "Postgres running on localhost:5432 (db=kab)"

# 1) .env bootstrap (non-destructive if exists)
if [[ ! -f .env ]]; then
  say "Create .env from template"
  if [[ -f .env.example ]]; then cp .env.example .env; fi
  grep -q '^DATABASE_URL=' .env 2>/dev/null && :
  if ! grep -q '^DATABASE_URL=' .env 2>/dev/null; then
    echo 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/kab?schema=public"' >> .env
  else
    # Ensure it points to local docker
    sed -i.bak 's|^DATABASE_URL=.*|DATABASE_URL="postgresql://postgres:postgres@localhost:5432/kab?schema=public"|' .env || true
  fi
  grep -q '^NEXTAUTH_URL=' .env || echo 'NEXTAUTH_URL="http://localhost:3001"' >> .env
  grep -q '^NEXTAUTH_SECRET=' .env || echo 'NEXTAUTH_SECRET="dev-secret-change-me"' >> .env
  pass ".env ready"
else
  pass ".env exists (using current values)"
fi

# 2) Install deps
say "Install dependencies"
command -v pnpm >/dev/null || npm i -g pnpm
pnpm install

# 3) Prisma migrate + seed (optional seed)
say "Prisma migrate"
pnpm prisma migrate deploy || pnpm prisma migrate dev --name init
if [[ -f prisma/seed.ts || -f prisma/seed.js ]]; then
  say "Seeding database"
  pnpm prisma db seed || true
fi
pass "DB migrated (and seeded if provided)"

# 4) Build
say "Build production"
pnpm build

# 5) Start server on :$PORT
say "Start server"
( PORT="$PORT" pnpm start > .sanity_server.log 2>&1 ) &
SERVER_PID=$!
trap 'kill $SERVER_PID 2>/dev/null || true' EXIT

say "Wait for server"
for i in {1..60}; do
  curl -fsS "$BASE" >/dev/null 2>&1 && { pass "Server up"; break; }
  sleep 1
  [[ $i -eq 60 ]] && { fail "Server did not start"; echo "Logs:"; tail -n 80 .sanity_server.log; exit 1; }
done

# Helpers
jok(){ jq -e "$1" >/dev/null 2>&1; }

# 6) Providers
say "Check NextAuth providers"
if curl -fsS "$BASE/api/auth/providers" | jok 'type=="object"'; then pass "/api/auth/providers OK"; else fail "/api/auth/providers failed"; fi

# 7) aiQuote
say "Test /api/aiQuote"
AI_REQ='{"service":"EXTENSION","postcode":"CT1 2AB","scope":"Single-storey rear extension ~20m2","propertyType":"HOUSE","rooms":2,"propertyAge":"1930s","ownership":"OWNER","permissions":"NONE","budgetMin":20000,"budgetMax":45000,"urgency":"MEDIUM","timeline":"1-3 months"}'
AI_RES=$(curl -fsS -X POST "$BASE/api/aiQuote" -H "Content-Type: application/json" -d "$AI_REQ" || true)
if echo "$AI_RES" | jok '.estimateLow and .estimateHigh'; then
  pass "/api/aiQuote returned estimateLow/high"
else
  fail "/api/aiQuote unexpected response"
  echo "  ↳ $AI_RES"
fi

# 8) lead (CRITICAL)
say "Test /api/lead"
LEAD_REQ='{"service":"EXTENSION","postcode":"CT1 2AB","scope":"Rear extension ~20m2 incl. steels","propertyType":"HOUSE","rooms":2,"propertyAge":"1930s","ownership":"OWNER","permissions":"NONE","budgetMin":20000,"budgetMax":45000,"urgency":"MEDIUM","timeline":"1-3 months","contact":{"name":"Test User","email":"lead@test.local","phone":"+44 7000 000000"}}'
LEAD_RES=$(curl -sS -w "\n%{http_code}" -X POST "$BASE/api/lead" -H "Content-Type: application/json" -d "$LEAD_REQ" || true)
LEAD_BODY=$(echo "$LEAD_RES" | head -n1); LEAD_CODE=$(echo "$LEAD_RES" | tail -n1)
if [[ "$LEAD_CODE" =~ ^2 ]]; then
  if echo "$LEAD_BODY" | jok '.ok==true and (.id|length>0)'; then
    pass "/api/lead accepted and returned id"
    echo "$LEAD_BODY" | jok 'has("delivered")' && pass "/api/lead delivered flag present" || fail "/api/lead missing delivered flag"
  else
    fail "/api/lead 2xx but unexpected body"; echo "  ↳ $LEAD_BODY"
  fi
else
  fail "/api/lead HTTP $LEAD_CODE"; echo "  ↳ $LEAD_BODY"
fi

# 9) Protected routes
say "Check protected routes"
HOME_HEAD=$(curl -sSI "$BASE/home" | tr -d '\r')
if echo "$HOME_HEAD" | grep -qi '^location: .*auth/signin'; then
  pass "/home redirects to /auth/signin when unauthenticated"
else
  fail "/home should be protected"
  echo "$HOME_HEAD"
fi

TRADE_HEAD=$(curl -sSI "$BASE/trade" | tr -d '\r')
if echo "$TRADE_HEAD" | grep -qi '^location: .*auth/signin'; then
  pass "/trade redirects to /auth/signin when unauthenticated"
else
  fail "/trade should be protected"
  echo "$TRADE_HEAD"
fi

# 10) SEO files
say "Check sitemap/robots"
curl -fsS "$BASE/sitemap.xml" >/dev/null && pass "sitemap.xml present" || fail "sitemap.xml missing"
curl -fsS "$BASE/robots.txt"  >/dev/null && pass "robots.txt present"  || fail "robots.txt missing"

# Summary
say "Summary"
printf '%s\n' "${summary[@]}"
echo
[[ $fails -eq 0 ]] && { echo "✅ Sanity PASS"; exit 0; } || { echo "❌ Sanity FAIL ($fails) — see details above and .sanity_server.log"; exit 1; }
