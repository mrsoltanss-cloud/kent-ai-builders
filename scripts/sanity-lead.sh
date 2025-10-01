#!/usr/bin/env bash
set -Eeuo pipefail
BASE="http://localhost:3001"

lsof -ti :3001 | xargs -r kill -9 || true
npm run build
export NEXTAUTH_URL="$BASE"
PORT=3001 npm run start >/tmp/brixel_lead_server.log 2>&1 &
SRV_PID=$!
trap 'kill $SRV_PID' EXIT
sleep 1

RAND=$RANDOM
RESP=$(curl -s -X POST "$BASE/api/lead" -H 'content-type: application/json' -d "{
  \"service\":\"extension\",
  \"description\":\"Single-storey rear extension approx 25 sqm.\",
  \"budgetMin\":20000,
  \"budgetMax\":45000,
  \"timeline\":\"3-6 months\",
  \"name\":\"Jane Doe\",
  \"email\":\"jane+$RAND@example.com\",
  \"postcode\":\"ME15\",
  \"rooms\":2,
  \"areaSqm\":25,
  \"urgency\":\"within_3_months\",
  \"source\":\"sanity-test\"
}")
echo "$RESP"
echo "$RESP" | grep -q '"ok": *true' && echo "PASS lead ✅" || { echo "FAIL lead ❌"; tail -n 120 /tmp/brixel_lead_server.log; exit 1; }
