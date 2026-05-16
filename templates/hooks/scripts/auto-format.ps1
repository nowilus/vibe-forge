# Runs formatter and TS check at session end (Stop event, non-blocking)
$formatted = $false

try {
    & npx --no-install biome format --write . | Out-Null 2>&1
    if ($LASTEXITCODE -eq 0) {
        [Console]::Error.WriteLine("Biome formatted.")
        $formatted = $true
    }
} catch {}

if (-not $formatted) {
    try {
        & npx --no-install prettier --write . --log-level silent | Out-Null 2>&1
        if ($LASTEXITCODE -eq 0) {
            [Console]::Error.WriteLine("Prettier formatted.")
        }
    } catch {}
}

if (Test-Path "tsconfig.json") {
    $output = & npx --no-install tsc --noEmit 2>&1
    $errorCount = ($output | Select-String 'error TS').Count
    if ($errorCount -gt 0) {
        [Console]::Error.WriteLine("$errorCount TypeScript error(s) remain. Run 'tsc --noEmit' to see details.")
    } else {
        [Console]::Error.WriteLine("TypeScript OK.")
    }
}

exit 0
