# Warns when modifying shared config files (non-blocking)
$input = $null
try { $input = [Console]::In.ReadToEnd() | ConvertFrom-Json } catch { exit 0 }

$filePath = $input.tool_input.file_path ?? ""
if (-not $filePath) { exit 0 }

$basename = Split-Path $filePath -Leaf

$configPatterns = @('.eslintrc', 'eslint.config', '.prettierrc', 'prettier.config', 'biome.json', 'tsconfig.json', '.stylelintrc', 'stylelint.config', '.editorconfig')

foreach ($pattern in $configPatterns) {
    if ($basename -like "*$pattern*") {
        [Console]::Error.WriteLine("Config protection: editing $basename affects all contributors. Ensure change is intentional.")
        exit 0
    }
}

exit 0
