#!/usr/bin/env bash
set -Eeuo pipefail

banner(){ printf "\n\033[1;36m▶ %s\033[0m\n" "$1"; }
pass(){ printf "\033[1;32m✓ %s\033[0m\n" "$1"; }
fail(){ printf "\033[1;31m✗ %s\033[0m\n" "$1"; }

BASE_URL="http://localhost:3001"

banner "Prisma generate (using existing DB)"
npx prisma generate

banner "Build"
npm run build

banner "Start server on ${BASE_URL}"
lsof -ti :3001 | xargs -r kill -9 || true
export NEXTAUTH_URL="http://localhost:3001"
PORT=3001 npm run start >/tmp/brixel_sanity_server.log 2>&1 &
SRV_PID=$!
trap 'kill $SRV_PID >/dev/null 2>&1 || true' EXIT

banner "Wait for server..."
for i in $(seq 1 60); do
  curl -sSf "${BASE_URL}/" >/dev/null 2>&1 && { pass "Server up"; break; }
  sleep 0.5
  [ "$i" -eq 60 ] && { fail "Server did not start"; tail -n 120 /tmp/brixel_sanity_server.log || true; exit 1; }
done

# Minimal tests (same as main sanity script)
RESULTS=()

banner "Test: /api/aiQuote"
AIQ=$(curl -s -X POST "${BASE_URL}/api/aiQuote" -H 'content-type: application/json' -d '{"service":"loft conversion","areaSqm":35,"quality":"standard","postcode":"ME15"}' || true)
echo "$AIQ"
echo "$AIQ" | grep -q '"ok": *true' && RESULTS+=("PASS aiQuote") || RESULTS+=("FAIL aiQuote")

banner "Test: /api/lead"
RAND=$RANDOM
LEAD=$(curl -s -X POST "${BASE_URL}/api/lead" -H 'content-type: application/json' -d '{"service":"extension","description":"Single-storey rear extension ~25sqm.","budgetMin":20000,"budgetMax":45000,"timeline":"3-6 months","name":"Jane Doe","email":"jane+'$RAND'@example.com","source":"sanity"}' || true)
echo "$LEAD"
echo "$LEAD" | grep -q '"ok": *true' && RESULTS+=("PASS lead") || RESULTS+=("FAIL lead")

banner "Test: providers"
PROV=$(curl -s "${BASE_URL}/api/auth/providers" || true)
echo "$PROV"
echo "$PROV" | grep -q '"credentials"' && RESULTS+=("PASS providers") || RESULTS+=("WARN providers")

banner "Test: sitemap & robots"
curl -sfI "${BASE_URL}/sitemap.xml" >/dev/null && RESULTS+=("PASS sitemap") || RESULTS+=("FAIL sitemap")
curl -sfI "${BASE_URL}/robots.txt"  >/dev/null && RESULTS+=("PASS robots")  || RESULTS+=("FAIL robots")

banner "Auth guards"
HC=$(curl -s -o /dev/null -w "%{http_code}" -L -I "${BASE_URL}/home" || true)
TC=$(curl -s -o /dev/null -w "%{http_code}" -L -I "${BASE_URL}/trade" || true)
case "$HC" in 200|302|303|401|403) RESULTS+=("PASS guard-home");; *) RESULTS+=("FAIL guard-home");; esac
case "$TC" in 200|302|303|401|403) RESULTS+=("PASS guard-trade");; *) RESULTS+=("FAIL guard-trade");; esac

banner "Summary"
FAILS=0
for R in "${RESULTS[@]}"; do
  case "$R" in
    FAIL*) echo -e "\033[1;31m✗ $R\033[0m"; FAILS=$((FAILS+1));;
    WARN*) echo -e "\033[1;33m! $R\033[0m";;
    *)     echo -e "\033[1;32m✓ $R\033[0m";;
  esac
done

banner "Server log tail"
tail -n 60 /tmp/brixel_sanity_server.log || true

[ "$FAILS" -gt 0 ] && { echo; echo -e "\033[1;31mSanity failed.\033[0m"; exit 1; }
echo; echo -e "\033[1;32mAll critical sanity tests passed.\033[0m"
