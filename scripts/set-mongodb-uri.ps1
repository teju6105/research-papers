$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$environmentPath = Join-Path $projectRoot ".env"

if (-not (Test-Path -LiteralPath $environmentPath)) {
    throw ".env was not found. Run .\scripts\setup-local-env.ps1 first."
}

$secureUri = Read-Host "Paste the MongoDB Atlas connection URI (input is hidden)" -AsSecureString
if ($secureUri.Length -eq 0) {
    throw "The MongoDB URI cannot be empty."
}

$uriPointer = [IntPtr]::Zero
try {
    $uriPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureUri)
    $uri = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($uriPointer)
} finally {
    if ($uriPointer -ne [IntPtr]::Zero) {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($uriPointer)
    }
    $secureUri.Dispose()
}

if ($uri -notmatch '^mongodb(\+srv)?://[^"\r\n]+$') {
    Remove-Variable uri -ErrorAction SilentlyContinue
    throw "The value must be a mongodb:// or mongodb+srv:// URI with no quotes or line breaks."
}

$lines = [System.Collections.Generic.List[string]]::new()
$lines.AddRange([string[]](Get-Content -LiteralPath $environmentPath))
$uriLineIndex = -1
for ($index = 0; $index -lt $lines.Count; $index++) {
    if ($lines[$index].StartsWith("MONGODB_URI=")) {
        $uriLineIndex = $index
        break
    }
}

$uriLine = "MONGODB_URI=`"$uri`""
if ($uriLineIndex -ge 0) {
    $lines[$uriLineIndex] = $uriLine
} else {
    $lines.Add($uriLine)
}

$databaseLineIndex = -1
for ($index = 0; $index -lt $lines.Count; $index++) {
    if ($lines[$index].StartsWith("MONGODB_DATABASE=")) {
        $databaseLineIndex = $index
        break
    }
}
if ($databaseLineIndex -ge 0) {
    $lines[$databaseLineIndex] = 'MONGODB_DATABASE="research_papers"'
} else {
    $lines.Add('MONGODB_DATABASE="research_papers"')
}

$content = ($lines -join [Environment]::NewLine) + [Environment]::NewLine
[System.IO.File]::WriteAllText(
    $environmentPath,
    $content,
    [System.Text.UTF8Encoding]::new($false)
)

Remove-Variable uri, uriLine, content -ErrorAction SilentlyContinue
Write-Output "Saved the MongoDB URI in .env without displaying it. The database name is research_papers."
