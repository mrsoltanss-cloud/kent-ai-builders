#!/usr/bin/env bash
set -euo pipefail
npx prisma generate
npx prisma migrate dev -n "roles-and-leads"
