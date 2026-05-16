# Warns when generic Bootstrap-style UI patterns appear in UI files (non-blocking)
$input = $null
try { $input = [Console]::In.ReadToEnd() | ConvertFrom-Json } catch { exit 0 }

$filePath = $input.tool_input.file_path ?? ""
if ($filePath -notmatch '\.(tsx|jsx|html|svelte|vue)$') { exit 0 }

$ti = $input.tool_input
$content = ($ti.content ?? "") + ($ti.new_string ?? "")
if (-not $content) { exit 0 }

$patterns = @('col-md-\d', 'btn btn-primary', 'card card-body', 'navbar navbar-', 'alert alert-', 'jumbotron', 'container-fluid')

foreach ($pattern in $patterns) {
    if ($content -match $pattern) {
        [Console]::Error.WriteLine("Design guard: generic Bootstrap class detected. Consider custom design tokens for unique brand identity.")
        break
    }
}

exit 0
