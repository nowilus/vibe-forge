#!/usr/bin/env bash
# Warns when modifying shared config files (non-blocking)
set -euo pipefail

input=$(cat)

file_path=$(echo "$input" | python3 -c "
import json,sys
d=json.load(sys.stdin)
print(d.get('tool_input',{}).get('file_path',''))
" 2>/dev/null || echo "")

if [ -z "$file_path" ]; then exit 0; fi

basename=$(basename "$file_path")

config_patterns=(
  '.eslintrc'
  'eslint.config'
  '.prettierrc'
  'prettier.config'
  'biome.json'
  'tsconfig.json'
  '.stylelintrc'
  'stylelint.config'
  '.editorconfig'
)

for pattern in "${config_patterns[@]}"; do
  if [[ "$basename" == *"$pattern"* ]]; then
    echo "⚙️  Config protection: editing $basename affects all contributors. Ensure change is intentional." >&2
    exit 0
  fi
done

exit 0
