# Reminds to update STATE.md after source file changes (non-blocking)
$input = $null
try { $input = [Console]::In.ReadToEnd() | ConvertFrom-Json } catch { exit 0 }

$filePath = $input.tool_input.file_path ?? ""
if ($filePath -match '\.(md|json|yaml|yml|env|lock|gitignore)') { exit 0 }
if ($filePath -match '(STATE|CHANGELOG|LESSONS)') { exit 0 }

$sourceExts = @('.ts', '.tsx', '.js', '.jsx', '.py', '.go', '.rs', '.java', '.swift', '.kt', '.rb')
$ext = [System.IO.Path]::GetExtension($filePath)

if ($ext -in $sourceExts) {
    [Console]::Error.WriteLine("Source file changed. If feature/API/state changed, update STATE.md and CHANGELOG.md.")
}

exit 0
