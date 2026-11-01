$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$environmentPath = Join-Path $projectRoot ".env"

if (-not (Test-Path -LiteralPath $environmentPath)) {
    throw ".env was not found. Run .\scripts\setup-local-env.ps1 first."
}

$lines = Get-Content -LiteralPath $environmentPath
$databaseLineIndex = -1
$shadowDatabaseLineIndex = -1
for ($index = 0; $index -lt $lines.Count; $index++) {
    if ($lines[$index].StartsWith("DATABASE_URL=")) {
        $databaseLineIndex = $index
    } elseif ($lines[$index].StartsWith("SHADOW_DATABASE_URL=")) {
        $shadowDatabaseLineIndex = $index
    }
}

if ($databaseLineIndex -lt 0) {
    throw "DATABASE_URL was not found in .env. The file was left unchanged."
}

$databaseLine = $lines[$databaseLineIndex]
if ($databaseLine -notmatch '(?<=/research_papers)(?=["?]|$)') {
    throw "DATABASE_URL must point to the research_papers database. The file was left unchanged."
}

# Keep the encoded credentials identical while changing only the database name.
$databaseNamePattern = [regex]::new('(?<=/research_papers)(?=["?]|$)')
$shadowDatabaseLine = $databaseNamePattern.Replace($databaseLine, '_shadow', 1)
$shadowDatabaseLine = $shadowDatabaseLine.Replace("DATABASE_URL=", "SHADOW_DATABASE_URL=")

if ($shadowDatabaseLineIndex -ge 0) {
    $lines[$shadowDatabaseLineIndex] = $shadowDatabaseLine
} else {
    $lines += $shadowDatabaseLine
}

$content = ($lines -join [Environment]::NewLine) + [Environment]::NewLine
[System.IO.File]::WriteAllText(
    $environmentPath,
    $content,
    [System.Text.UTF8Encoding]::new($false)
)

Write-Output "Configured SHADOW_DATABASE_URL using the existing local database credentials. No password was displayed."
