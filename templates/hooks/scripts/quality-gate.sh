#!/usr/bin/env bash
# Runs tsc --noEmit after TypeScript file edits (non-blocking, warns only)
set -euo pipefail

input=$(cat)

file_path=$(echo "$input" | python3 -c "
import json,sys
d=json.load(sys.stdin)
print(d.get('tool_input',{}).get('file_path',''))
" 2>/dev/null || echo "")

# Only run for TS/TSX files
if [[ "$file_path" != *.ts && "$file_path" != *.tsx ]]; then exit 0; fi

# Only run if tsconfig.json exists
if [ ! -f "tsconfig.json" ]; then exit 0; fi

output=$(npx --no-install tsc --noEmit 2>&1 || true)
error_count=$(echo "$output" | grep -c 'error TS' || true)

if [ "$error_count" -gt 0 ]; then
  echo "⚠️  TypeScript: $error_count error(s) after edit. Run 'tsc --noEmit' to see details." >&2
fi

exit 0
