#!/usr/bin/env bash
set -Eeuo pipefail

# ========= Config =========
PORT="${PORT:-3001}"
BASE="http://localhost:$PORT"
DB_CONT="kabdb"
DB_IMAGE="postgres:16"
WEBHOOK_PORT="${WEBHOOK_PORT:-4009}"
WEBHOOK_URL="http://localhost:$WEBHOOK_PORT/hook"
SUMMARY=(); FAILS=0

say(){ printf "\n\033[1;36m▶ %s\033[0m\n" "$*"; }
pass(){ printf "  ✅ %s\n" "$*"; SUMMARY+=("PASS  $*"); }
fail(){ printf "  ❌ %s\n" "$*"; SUMMARY+=("FAIL  $*"); FAILS=$((FAILS+1)); }
need(){ command -v "$1" >/dev/null || { fail "Missing dependency: $1"; echo "Install $1 and re-run."; exit 1; }; }

# ========= Preflight =========
say "Preflight checks"
need docker; need node; need jq; need curl
if ! command -v pnpm >/dev/null; then npm i -g pnpm >/dev/null 2>&1 || true; fi
command -v pnpm >/dev/null && pass "pnpm present" || { fail "pnpm missing"; exit 1; }

# ========= Docker Postgres (random host port) =========
say "Start clean Postgres ($DB_IMAGE)"
docker rm -f "$DB_CONT" >/dev/null 2>&1 || true
docker run -d --name "$DB_CONT" -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=kab -p 0.0.0.0::5432 "$DB_IMAGE" >/dev/null
sleep 1
DB_HOST_PORT=$(docker port "$DB_CONT" 5432/tcp | sed 's/.*://')
if [[ -z "${DB_HOST_PORT:-}" ]]; then fail "Could not determine Postgres host port"; exit 1; fi
pass "Postgres running as kabdb on host port $DB_HOST_PORT"

# ========= .env wiring =========
say "Ensure .env is set for local sanity"
DB_URL="postgresql://postgres:postgres@localhost:${DB_HOST_PORT}/kab?schema=public"
if [[ ! -f .env ]]; then [[ -f .env.example ]] && cp .env.example .env || touch .env; fi
awk -v url="$DB_URL" '
BEGIN{set=0}
$0 ~ /^DATABASE_URL=/ {print "DATABASE_URL=\"" url "\""; set=1; next}
{print}
END{if(!set) print "DATABASE_URL=\"" url "\""}' .env > .env.tmp && mv .env.tmp .env
grep -q '^NEXTAUTH_URL=' .env || echo 'NEXTAUTH_URL="http://localhost:'"$PORT"'"' >> .env
grep -q '^NEXTAUTH_SECRET=' .env || echo 'NEXTAUTH_SECRET="dev-secret-change-me"' >> .env
if grep -q '^WEBHOOK_URL=' .env; then
  sed -i.bak 's|^WEBHOOK_URL=.*|WEBHOOK_URL="'"$WEBHOOK_URL"'"|' .env
else
  echo 'WEBHOOK_URL="'"$WEBHOOK_URL"'"' >> .env
fi
pass ".env wired (DB_URL -> $DB_URL)"

# ========= Webhook mock =========
say "Boot webhook mock on :$WEBHOOK_PORT"
cat > .webhook_mock.js <<'JS'
const http = require('http'), fs = require('fs');
const PORT = process.env.PORT || 4009;
const LOG = '.webhook_hits.jsonl';
const server = http.createServer((req, res) => {
  if (req.method !== 'POST') { res.writeHead(405); return res.end('Only POST'); }
  let body=''; req.on('data', c => body += c);
  req.on('end', () => {
    try {
      const entry = { t: new Date().toISOString(), url: req.url, headers: req.headers, json: JSON.parse(body||'{}') };
      fs.appendFileSync(LOG, JSON.stringify(entry) + "\n");
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
    } catch(e) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, note: 'non-json body accepted'}));
    }
  });
});
server.listen(PORT, () => console.log('webhook-mock: listening on', PORT));
JS
(node .webhook_mock.js > .webhook_mock.log 2>&1 & echo $! > .webhook_mock.pid)
sleep 0.3
curl -fsS -X POST "http://localhost:$WEBHOOK_PORT/hook" -d '{}' -H "content-type: application/json" >/dev/null && pass "Webhook mock responding" || fail "Webhook mock failed"

# ========= Install + Prisma =========
say "Install dependencies"
pnpm install >/dev/null && pass "Dependencies installed"

say "Prisma migrate"
pnpm prisma migrate deploy >/dev/null || pnpm prisma migrate dev --name init >/dev/null
pass "Migrations applied"
if [[ -f prisma/seed.ts || -f prisma/seed.js ]]; then
  say "Seeding database"
  pnpm prisma db seed >/dev/null && pass "Seed OK" || fail "Seed failed"
else
  pass "No seed script (skipped)"
fi

# ========= Build & Start =========
say "Build production"
pnpm build >/dev/null && pass "Build OK" || { fail "Build failed"; exit 1; }

say "Start server on :$PORT"
(PORT="$PORT" pnpm start > .sanity_server.log 2>&1 ) &
SERVER_PID=$!
cleanup(){
  kill $SERVER_PID 2>/dev/null || true
  kill $(cat .webhook_mock.pid 2>/dev/null) 2>/dev/null || true
  rm -f .webhook_mock.pid
}
trap cleanup EXIT

say "Wait for server to respond"
for i in {1..90}; do
  if curl -fsS "$BASE" >/dev/null 2>&1; then pass "Server up"; break; fi
  sleep 1
  [[ $i -eq 90 ]] && { fail "Server did not start"; tail -n 120 .sanity_server.log || true; exit 1; }
done

# ========= Helpers =========
okjson(){ jq -e "$1" >/dev/null 2>&1; }
http(){ curl -sS -w "\n%{http_code}" "$@"; }

# ========= Auth Providers =========
say "Check NextAuth providers"
if curl -fsS "$BASE/api/auth/providers" | okjson 'type=="object"'; then
  pass "/api/auth/providers returns providers object"
else
  fail "/api/auth/providers failed"
fi

# ========= aiQuote =========
say "Test /api/aiQuote returns estimateLow/high"
AI_REQ='{"service":"EXTENSION","postcode":"CT1 2AB","scope":"Single-storey rear extension ~20m2","propertyType":"HOUSE","rooms":2,"propertyAge":"1930s","ownership":"OWNER","permissions":"NONE","budgetMin":20000,"budgetMax":45000,"urgency":"MEDIUM","timeline":"1-3 months"}'
AI_RES=$(curl -fsS -X POST "$BASE/api/aiQuote" -H "Content-Type: application/json" -d "$AI_REQ" || true)
if echo "$AI_RES" | okjson '.estimateLow and .estimateHigh'; then
  pass "/api/aiQuote has estimateLow/high"
else
  fail "/api/aiQuote missing estimate fields"; echo "  ↳ $AI_RES"
fi

# ========= Inspect (GET) =========
say "Inspect Lead schema (GET)"
curl -fsS "$BASE/api/lead" || true

# ========= lead (happy path) =========
say "POST /api/lead (happy path)"
LEAD_REQ='{"service":"EXTENSION","postcode":"CT1 2AB","scope":"Rear extension ~20m2 incl. steels","propertyType":"HOUSE","rooms":2,"budgetMin":20000,"budgetMax":45000,"urgency":"MEDIUM","timeline":"1-3 months","contact":{"name":"Test User","email":"lead@test.local","phone":"+44 7000 000000"}}'
LEAD_RES=$(http -X POST "$BASE/api/lead" -H "Content-Type: application/json" -d "$LEAD_REQ")
LEAD_BODY=$(echo "$LEAD_RES" | head -n1); LEAD_CODE=$(echo "$LEAD_RES" | tail -n1)
if [[ "$LEAD_CODE" =~ ^2 ]]; then
  if echo "$LEAD_BODY" | okjson '.ok==true and (.id|length>0)'; then
    pass "/api/lead accepted and returned id"
    echo "$LEAD_BODY" | okjson 'has("delivered")' && pass "delivered flag present" || fail "missing delivered flag (check webhook logic)"
    LEAD_ID=$(echo "$LEAD_BODY" | jq -r '.id // empty')
  else
    fail "/api/lead 2xx but unexpected body"; echo "  ↳ $LEAD_BODY"
  fi
else
  fail "/api/lead HTTP $LEAD_CODE"; echo "  ↳ $LEAD_BODY"
fi

# ========= lead enum validation & variants =========
say "Enum/validation tests for /api/lead"
for U in LOW MEDIUM HIGH; do
  RES=$(http -X POST "$BASE/api/lead" -H "Content-Type: application/json" -d "$(echo "$LEAD_REQ" | jq --arg u "$U" '.urgency=$u')")
  CODE=$(echo "$RES" | tail -n1)
  [[ "$CODE" =~ ^2 ]] && pass "urgency=$U accepted" || fail "urgency=$U rejected ($CODE)"
done

# ========= Webhook delivery observed =========
say "Verify webhook received at least 1 call"
if [[ -f .webhook_hits.jsonl ]] && [[ $(wc -l < .webhook_hits.jsonl) -ge 1 ]]; then
  pass "Webhook received $(wc -l < .webhook_hits.jsonl) call(s)"
else
  fail "No webhook calls captured"
fi

# ========= API count (authoritative) =========
say "API lead count (source of truth)"
API_COUNT=$(curl -fsS "$BASE/api/lead" | jq -r ".count // 0")
if [[ -n "$API_COUNT" && "$API_COUNT" -ge 1 ]]; then
  pass "Lead count via API: $API_COUNT"
  SKIP_DB_CHECK=1
else
  SKIP_DB_CHECK=0
fi

# ========= DB row actually created (skip if API already confirmed) =========
if [[ "$SKIP_DB_CHECK" = "1" ]]; then
  say "Check DB for lead row presence (skipped; API already confirmed rows)"
else
  say "Check DB for lead row presence"
  COUNT=$(docker exec -i "$DB_CONT" psql -U postgres -d kab -tAc 'SELECT COUNT(*) FROM "Lead";' 2>/dev/null || echo "0")
  if [[ "$COUNT" =~ ^[0-9]+$ ]]; then
    if [[ "$COUNT" -ge 1 ]]; then pass "Lead table has $COUNT row(s)"; else fail "Lead table empty"; fi
  else
    fail "Could not query DB"
  fi
fi

# ========= Protected routes =========
say "Protected routes redirect without auth"
HOME_HEAD=$(curl -sSI "$BASE/home" | tr -d '\r')
echo "$HOME_HEAD" | grep -qi '^location: .*/auth/signin' && pass "/home protected" || { fail "/home not protected"; echo "$HOME_HEAD"; }
TRADE_HEAD=$(curl -sSI "$BASE/trade" | tr -d '\r')
echo "$TRADE_HEAD" | grep -qi '^location: .*/auth/signin' && pass "/trade protected" || { fail "/trade not protected"; echo "$TRADE_HEAD"; }

# ========= SEO presence =========
say "sitemap.xml & robots.txt"
curl -fsS "$BASE/sitemap.xml" >/dev/null && pass "sitemap.xml present" || fail "sitemap.xml missing"
curl -fsS "$BASE/robots.txt"  >/dev/null && pass "robots.txt present"  || fail "robots.txt missing"

# ========= Security headers (basic) =========
say "Security headers"
HEAD=$(curl -sSI "$BASE" | tr -d '\r')
echo "$HEAD" | grep -qi '^x-content-type-options: nosniff' && pass "X-Content-Type-Options" || fail "Missing X-Content-Type-Options"
echo "$HEAD" | grep -qi '^referrer-policy:' && pass "Referrer-Policy" || fail "Missing Referrer-Policy"
echo "$HEAD" | grep -qi '^content-security-policy:' && pass "Content-Security-Policy" || fail "Missing CSP (recommend adding)"

# ========= CORS preflight smoke (optional) =========
say "CORS preflight smoke"
CORS=$(curl -sSI -X OPTIONS "$BASE/api/lead" -H "Origin: http://example.com" -H "Access-Control-Request-Method: POST" | tr -d '\r' || true)
echo "$CORS" | grep -qi '^access-control-allow-origin:' && pass "CORS header present" || pass "CORS not exposed (ok if same-origin)"

# ========= Simple burst =========
say "Burst 5x /api/aiQuote"
BURST_FAIL=0
for i in {1..5}; do
  curl -fsS -X POST "$BASE/api/aiQuote" -H "content-type: application/json" -d "$AI_REQ" >/dev/null || BURST_FAIL=$((BURST_FAIL+1))
done
[[ $BURST_FAIL -eq 0 ]] && pass "Burst OK" || fail "Burst errors: $BURST_FAIL/5"

# ========= Summary =========
say "Summary"; printf '%s\n' "${SUMMARY[@]}"; echo
if [[ $FAILS -eq 0 ]]; then
  echo "✅ FULL SANITY PASS"; exit 0
else
  echo "❌ FULL SANITY FAIL ($FAILS) — see details above. Logs: .sanity_server.log, .webhook_mock.log"; exit 1
fi
