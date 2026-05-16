# Blocks writes that contain hardcoded secrets
$input = $null
try { $input = [Console]::In.ReadToEnd() | ConvertFrom-Json } catch { exit 0 }

$ti = $input.tool_input
$content = ($ti.content ?? "") + ($ti.new_string ?? "")
if (-not $content) { exit 0 }

$patterns = @(
    'sk-[a-zA-Z0-9]{20,}',
    'AKIA[0-9A-Z]{16}',
    'ghp_[a-zA-Z0-9]{36}',
    'xox[baprs]-[a-zA-Z0-9-]+',
    'AIza[0-9A-Za-z\-_]{35}',
    "password\s*=\s*['""][^'""$\{]{3,}",
    "api[_-]?key\s*[=:]\s*['""][^'""$\{]{3,}",
    "secret\s*[=:]\s*['""][^'""$\{]{3,}",
    "token\s*[=:]\s*['""][^'""$\{]{3,}",
    'DATABASE_URL\s*=\s*postgres://[^$\{]'
)

foreach ($pattern in $patterns) {
    if ($content -match $pattern) {
        $result = @{ decision = "block"; reason = "Secret scanner: hardcoded credential detected. Move to .env file and reference via process.env / os.environ." } | ConvertTo-Json -Compress
        Write-Output $result
        exit 2
    }
}

exit 0
