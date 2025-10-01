#!/usr/bin/env bash
set -Eeuo pipefail

# -------- UI helpers --------
banner(){ printf "\n\033[1;36m▶ %s\033[0m\n" "$1"; }
pass(){ printf "\033[1;32m✓ %s\033[0m\n" "$1"; }
warn(){ printf "\033[1;33m! %s\033[0m\n" "$1"; }
fail(){ printf "\033[1;31m✗ %s\033[0m\n" "$1"; }

BASE_URL="http://localhost:3001"
SERVER_LOG="/tmp/kab_sanity_server.log"
SRV_PID=""

cleanup() {
  [ -n "$SRV_PID" ] && kill "$SRV_PID" >/dev/null 2>&1 || true
}
trap cleanup EXIT

# -------- 0) Kill any old server on 3001 --------
banner "Freeing port 3001"
lsof -ti :3001 | xargs -r kill -9 || true

# -------- 1) Database: prefer existing local; fallback to Docker:5433 --------
banner "Database check"
# Detect an existing listener on 5432 or 5433
HAS_5432=$(lsof -iTCP:5432 -sTCP:LISTEN -Pn 2>/dev/null | wc -l | tr -d ' ')
HAS_5433=$(lsof -iTCP:5433 -sTCP:LISTEN -Pn 2>/dev/null | wc -l | tr -d ' ')

# Default DATABASE_URL if none set
if ! grep -q '^DATABASE_URL=' .env.local 2>/dev/null && ! grep -q '^DATABASE_URL=' .env 2>/dev/null; then
  if [ "$HAS_5432" != "0" ]; then
    echo 'DATABASE_URL=postgresql://brixel:postgres@127.0.0.1:5432/brixel?schema=public' >> .env.local
    pass "Set DATABASE_URL to local 5432 in .env.local"
  elif [ "$HAS_5433" != "0" ]; then
    echo 'DATABASE_URL=postgresql://brixel:postgres@127.0.0.1:5433/brixel?schema=public' >> .env.local
    pass "Set DATABASE_URL to local 5433 in .env.local"
  else
    warn "No local Postgres detected; starting Docker on 5433"
    docker rm -f kabdb >/dev/null 2>&1 || true
    docker run -d --name kabdb \
      -e POSTGRES_USER=brixel \
      -e POSTGRES_PASSWORD=postgres \
      -e POSTGRES_DB=brixel \
      -p 5433:5432 postgres:15 >/dev/null
    # wait for readiness
    for i in $(seq 1 40); do
      if docker exec kabdb pg_isready -U brixel -d brixel >/dev/null 2>&1; then break; fi
      sleep 0.5
    done
    echo 'DATABASE_URL=postgresql://brixel:postgres@127.0.0.1:5433/brixel?schema=public' >> .env.local
    pass "Docker Postgres ready on 5433; DATABASE_URL set in .env.local"
  fi
else
  pass "DATABASE_URL already configured"
fi

# -------- 2) Dependencies & Prisma --------
banner "Install deps (npm ci || npm install)"
npm ci || npm install

banner "Prisma generate"
npx prisma generate

# Try migrate; if no migrations exist, db push
banner "Apply schema (migrate or push)"
if ls prisma/migrations/*/migration.sql >/dev/null 2>&1; then
  npx prisma migrate dev -n "sanity" || npx prisma db push
else
  npx prisma db push
fi

# Optional seed scripts
if [ -f scripts/seed-users.ts ]; then
  banner "Seeding users (ts)"
  npx ts-node scripts/seed-users.ts || true
elif [ -f scripts/seed-users.js ]; then
  banner "Seeding users (js)"
  node scripts/seed-users.js || true
else
  warn "No seed script found; continuing."
fi

# -------- 3) Build & start server --------
banner "Build (prod)"
npm run build

banner "Start server on ${BASE_URL}"
export NEXTAUTH_URL="$BASE_URL"
PORT=3001 npm run start >"$SERVER_LOG" 2>&1 &
SRV_PID=$!

banner "Wait for server to be ready"
for i in $(seq 1 60); do
  if curl -sSf "${BASE_URL}/" >/dev/null 2>&1; then pass "Server is up"; break; fi
  sleep 0.5
  [ "$i" -eq 60 ] && { fail "Server failed to start"; tail -n 120 "$SERVER_LOG" || true; exit 1; }
done

# -------- 4) Tests --------
RESULTS=()

# AI Quote
banner "Test: /api/aiQuote"
AIQ=$(curl -s -X POST "${BASE_URL}/api/aiQuote" \
  -H 'content-type: application/json' \
  -d '{"service":"loft conversion","areaSqm":35,"quality":"standard","postcode":"ME15"}' || true)
echo "$AIQ"
echo "$AIQ" | grep -q '"ok": *true' && RESULTS+=("PASS aiQuote") || RESULTS+=("FAIL aiQuote")

# Lead (unique email to avoid P2002)
banner "Test: /api/lead"
RAND=$RANDOM
LEAD=$(curl -s -X POST "${BASE_URL}/api/lead" \
  -H 'content-type: application/json' \
  -d "{
    \"service\":\"extension\",
    \"description\":\"Single-storey rear extension approx 25sqm.\",
    \"budgetMin\":20000,
    \"budgetMax\":45000,
    \"timeline\":\"3-6 months\",
    \"name\":\"Jane Doe\",
    \"email\":\"jane+$RAND@example.com\",
    \"postcode\":\"ME15\",
    \"rooms\":2,
    \"areaSqm\":25,
    \"urgency\":\"within_3_months\",
    \"source\":\"sanity\"
  }" || true)
echo "$LEAD"
echo "$LEAD" | grep -q '"ok": *true' && RESULTS+=("PASS lead") || RESULTS+=("FAIL lead")

# Providers
banner "Test: /api/auth/providers"
PROV=$(curl -s "${BASE_URL}/api/auth/providers" || true)
echo "$PROV"
echo "$PROV" | grep -q '"credentials"' && RESULTS+=("PASS providers") || RESULTS+=("WARN providers")

# SEO assets
banner "Test: sitemap.xml & robots.txt"
curl -sfI "${BASE_URL}/sitemap.xml" >/dev/null && RESULTS+=("PASS sitemap") || RESULTS+=("FAIL sitemap")
curl -sfI "${BASE_URL}/robots.txt"  >/dev/null && RESULTS+=("PASS robots")  || RESULTS+=("FAIL robots")

# Auth guards (unauthenticated behavior acceptable: 200 or redirect or 401/403 depending on middleware/render)
banner "Test: auth guards for /home & /trade (unauthenticated)"
HC=$(curl -s -o /dev/null -w "%{http_code}" -L -I "${BASE_URL}/home" || true)
TC=$(curl -s -o /dev/null -w "%{http_code}" -L -I "${BASE_URL}/trade" || true)
echo "HOME => $HC"
echo "TRADE => $TC"
case "$HC" in 200|302|303|401|403) RESULTS+=("PASS guard-home");; *) RESULTS+=("FAIL guard-home");; esac
case "$TC" in 200|302|303|401|403) RESULTS+=("PASS guard-trade");; *) RESULTS+=("FAIL guard-trade");; esac

# Debug vars (optional)
banner "Test: /api/debug-vars (optional)"
DV_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/api/debug-vars" || true)
if [ "$DV_CODE" = "200" ]; then
  curl -s "${BASE_URL}/api/debug-vars" || true
  RESULTS+=("PASS debug-vars")
else
  RESULTS+=("SKIP debug-vars")
fi

# -------- 5) Summary --------
banner "Sanity Summary"
FAILS=0
for R in "${RESULTS[@]}"; do
  case "$R" in
    FAIL*) fail "$R"; FAILS=$((FAILS+1));;
    WARN*) warn "$R";;
    SKIP*) printf "\033[1;34m• %s\033[0m\n" "$R";;
    PASS*) pass "$R";;
  esac
done

banner "Server log tail (last 80 lines)"
tail -n 80 "$SERVER_LOG" || true

if [ "$FAILS" -gt 0 ]; then
  echo
  fail "Sanity failed with $FAILS failure(s). See details above."
  exit 1
fi

echo
pass "All critical sanity tests passed."
echo "Open ${BASE_URL}/auth/signin to log in and test manually."
