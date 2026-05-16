#!/usr/bin/env bash
# Warns when console.log/warn/error/debug appears in source files (non-blocking)
set -euo pipefail

input=$(cat)

file_path=$(echo "$input" | python3 -c "
import json,sys
d=json.load(sys.stdin)
print(d.get('tool_input',{}).get('file_path',''))
" 2>/dev/null || echo "")

# Skip test/spec/config/log files
if [[ "$file_path" == *.test.* || "$file_path" == *.spec.* || "$file_path" == *.config.* ]]; then exit 0; fi
if [[ "$file_path" == *.md || "$file_path" == *.json || "$file_path" == *.yaml || "$file_path" == *.yml ]]; then exit 0; fi

content=$(echo "$input" | python3 -c "
import json,sys
d=json.load(sys.stdin)
ti=d.get('tool_input',{})
print(ti.get('content','') + ti.get('new_string',''))
" 2>/dev/null || echo "")

if [ -z "$content" ]; then exit 0; fi

if echo "$content" | grep -qE 'console\.(log|warn|error|debug)\('; then
  echo "📋 console.log detected in source file. Remove before committing or replace with proper logger." >&2
fi

exit 0
