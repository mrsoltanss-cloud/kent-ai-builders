#!/usr/bin/env bash
set -euo pipefail

STAMP=$(date +%Y%m%d-%H%M%S)
cp prisma/schema.prisma ".backups/schema.prisma.$STAMP.bak"

# 1) Ensure prisma/schema.prisma has a password field (nullable for OAuth/legacy rows)
if ! grep -qE '^\s*password\s+String\??' prisma/schema.prisma; then
  awk '
  /model User \{/ { inUser=1 }
  inUser && /email\s+String/ && !printed {
    print
    print "  password  String?  // bcrypt-hashed (nullable for OAuth)"
    printed=1
    next
  }
  /}/ && inUser { inUser=0 }
  { print }
  ' prisma/schema.prisma > prisma/schema.__tmp && mv prisma/schema.__tmp prisma/schema.prisma
  echo "✓ Added password field to User model in prisma/schema.prisma"
else
  echo "• Schema already has a password field — leaving as-is."
fi

# 2) Generate client and migrate LOCAL database
echo "→ Generating Prisma Client..."
npx prisma generate

echo "→ Migrating LOCAL database (adds User.password if missing)..."
npx prisma migrate dev --name add-user-password-column

echo
echo "LOCAL DB fixed ✅"
echo
echo "To migrate PRODUCTION (Vercel Postgres), run:"
echo "  vercel env pull .env.production.local --environment=production --yes"
echo "  set -a; source .env.production.local; set +a"
echo "  npx prisma migrate deploy"
