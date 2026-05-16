#!/usr/bin/env bash
# Blocks writes that contain hardcoded secrets
set -euo pipefail

input=$(cat)

content=$(echo "$input" | python3 -c "
import json,sys
d=json.load(sys.stdin)
ti=d.get('tool_input',{})
print(ti.get('content','') + ti.get('new_string',''))
" 2>/dev/null || echo "")

if [ -z "$content" ]; then exit 0; fi

patterns=(
  'sk-[a-zA-Z0-9]{20,}'
  'AKIA[0-9A-Z]{16}'
  'ghp_[a-zA-Z0-9]{36}'
  'xox[baprs]-[a-zA-Z0-9-]+'
  'AIza[0-9A-Za-z\-_]{35}'
  'password\s*=\s*['"'"'"][^'"'"'"$\{]{3,}'
  'api[_-]?key\s*[=:]\s*['"'"'"][^'"'"'"$\{]{3,}'
  'secret\s*[=:]\s*['"'"'"][^'"'"'"$\{]{3,}'
  'token\s*[=:]\s*['"'"'"][^'"'"'"$\{]{3,}'
  'DATABASE_URL\s*=\s*postgres://[^$\{]'
)

for pattern in "${patterns[@]}"; do
  if echo "$content" | grep -qEi "$pattern"; then
    echo '{"decision":"block","reason":"🔐 Secret scanner: hardcoded credential detected. Move to .env file and reference via process.env / os.environ."}'
    exit 2
  fi
done

exit 0
