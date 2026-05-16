# Runs tsc --noEmit after TypeScript file edits (non-blocking, warns only)
$input = $null
try { $input = [Console]::In.ReadToEnd() | ConvertFrom-Json } catch { exit 0 }

$filePath = $input.tool_input.file_path ?? ""
if ($filePath -notmatch '\.(ts|tsx)$') { exit 0 }
if (-not (Test-Path "tsconfig.json")) { exit 0 }

$output = & npx --no-install tsc --noEmit 2>&1
$errorCount = ($output | Select-String 'error TS').Count

if ($errorCount -gt 0) {
    [Console]::Error.WriteLine("TypeScript: $errorCount error(s) after edit. Run 'tsc --noEmit' to see details.")
}

exit 0
