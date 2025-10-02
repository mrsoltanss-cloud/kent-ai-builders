#!/usr/bin/env bash
set -euo pipefail
ts(){ date "+%Y%m%d-%H%M%S"; }

LABEL="${1:-generic}"
BR="checkpoint/${LABEL}-$(ts)"
TAG="checkpoint-$(ts)"

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || { echo "❌ Not a git repo"; exit 1; }

git add -A
git commit -m "chore: checkpoint ${LABEL} [${TAG}]" || true

# Create/force branch at current HEAD and switch to it (classic Git)
git checkout -B "$BR"

# Annotated tag at same commit
git tag -a "$TAG" -m "Checkpoint ${LABEL} @ $(date -Iseconds)"

# Push both
git push -u origin "$BR"
git push origin "$TAG"

echo
echo "✅ Checkpoint created."
echo "   Branch: $BR"
echo "   Tag:    $TAG"
echo
echo "Rollback current branch to this tag (HARD RESET!):"
echo "  git fetch --all --tags"
echo "  git reset --hard ${TAG}"
echo
echo "Or inspect without resetting:"
echo "  git checkout ${BR}"
