#!/usr/bin/env bash
# Warns when generic Bootstrap-style UI patterns appear in UI files (non-blocking)
set -euo pipefail

input=$(cat)

file_path=$(echo "$input" | python3 -c "
import json,sys
d=json.load(sys.stdin)
print(d.get('tool_input',{}).get('file_path',''))
" 2>/dev/null || echo "")

# Only check UI files
if [[ "$file_path" != *.tsx && "$file_path" != *.jsx && "$file_path" != *.html \
   && "$file_path" != *.svelte && "$file_path" != *.vue ]]; then exit 0; fi

content=$(echo "$input" | python3 -c "
import json,sys
d=json.load(sys.stdin)
ti=d.get('tool_input',{})
print(ti.get('content','') + ti.get('new_string',''))
" 2>/dev/null || echo "")

if [ -z "$content" ]; then exit 0; fi

patterns=(
  'col-md-[0-9]'
  'btn btn-primary'
  'card card-body'
  'navbar navbar-'
  'alert alert-'
  'jumbotron'
  'container-fluid'
)

for pattern in "${patterns[@]}"; do
  if echo "$content" | grep -q "$pattern"; then
    echo "🎨 Design guard: generic Bootstrap class '$pattern' detected. Consider custom design tokens for unique brand identity." >&2
    break
  fi
done

exit 0
