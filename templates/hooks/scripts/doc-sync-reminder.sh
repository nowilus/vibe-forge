#!/usr/bin/env bash
# Reminds to update STATE.md after source file changes (non-blocking)
set -euo pipefail

input=$(cat)

file_path=$(echo "$input" | python3 -c "
import json,sys
d=json.load(sys.stdin)
print(d.get('tool_input',{}).get('file_path',''))
" 2>/dev/null || echo "")

# Skip docs, config, and meta files
if [[ "$file_path" == *.md || "$file_path" == *.json || "$file_path" == *.yaml || "$file_path" == *.yml ]]; then exit 0; fi
if [[ "$file_path" == *.env* || "$file_path" == *.gitignore || "$file_path" == *.lock ]]; then exit 0; fi
if [[ "$file_path" == *STATE* || "$file_path" == *CHANGELOG* || "$file_path" == *LESSONS* ]]; then exit 0; fi

# Only trigger for source files
if [[ "$file_path" == *.ts || "$file_path" == *.tsx || "$file_path" == *.js || "$file_path" == *.jsx \
   || "$file_path" == *.py || "$file_path" == *.go || "$file_path" == *.rs || "$file_path" == *.java \
   || "$file_path" == *.swift || "$file_path" == *.kt || "$file_path" == *.rb ]]; then
  echo "📄 Source file changed. If feature/API/state changed, update STATE.md and CHANGELOG.md." >&2
fi

exit 0
