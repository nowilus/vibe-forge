#!/usr/bin/env bash
# Runs formatter and TS check at session end (Stop event, non-blocking)
set -euo pipefail

# Try biome first, fall back to prettier
if npx --no-install biome format --write . >/dev/null 2>&1; then
  echo "✅ Biome formatted." >&2
elif npx --no-install prettier --write . --log-level silent >/dev/null 2>&1; then
  echo "✅ Prettier formatted." >&2
fi

# TS check if tsconfig present
if [ -f "tsconfig.json" ]; then
  error_count=$(npx --no-install tsc --noEmit 2>&1 | grep -c 'error TS' || true)
  if [ "$error_count" -gt 0 ]; then
    echo "⚠️  $error_count TypeScript error(s) remain. Run 'tsc --noEmit' to see details." >&2
  else
    echo "✅ TypeScript OK." >&2
  fi
fi

exit 0
