# Warns when console.log/warn/error/debug appears in source files (non-blocking)
$input = $null
try { $input = [Console]::In.ReadToEnd() | ConvertFrom-Json } catch { exit 0 }

$filePath = $input.tool_input.file_path ?? ""
if ($filePath -match '\.(test|spec|config)\.' ) { exit 0 }
if ($filePath -match '\.(md|json|yaml|yml)$') { exit 0 }

$ti = $input.tool_input
$content = ($ti.content ?? "") + ($ti.new_string ?? "")
if (-not $content) { exit 0 }

if ($content -match 'console\.(log|warn|error|debug)\(') {
    [Console]::Error.WriteLine("console.log detected in source file. Remove before committing or replace with proper logger.")
}

exit 0
