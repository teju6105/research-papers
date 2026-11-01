$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$examplePath = Join-Path $projectRoot ".env.example"
$environmentPath = Join-Path $projectRoot ".env"

if (-not (Test-Path -LiteralPath $examplePath)) {
    throw "Could not find .env.example in the project root."
}

if (Test-Path -LiteralPath $environmentPath) {
    throw ".env already exists. It was left unchanged; ask for help if you need to update it."
}

$securePassword = Read-Host "Enter the MySQL password you just created (input is hidden)" -AsSecureString
if ($securePassword.Length -eq 0) {
    throw "The MySQL password cannot be empty."
}

$passwordPointer = [IntPtr]::Zero
try {
    $passwordPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
    $plainPassword = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($passwordPointer)
    $encodedPassword = [Uri]::EscapeDataString($plainPassword)
} finally {
    if ($passwordPointer -ne [IntPtr]::Zero) {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($passwordPointer)
    }
    $securePassword.Dispose()
}

$secretBytes = New-Object byte[] 32
$randomGenerator = [Security.Cryptography.RandomNumberGenerator]::Create()
try {
    $randomGenerator.GetBytes($secretBytes)
} finally {
    $randomGenerator.Dispose()
}
$authSecret = [BitConverter]::ToString($secretBytes).Replace("-", "").ToLowerInvariant()

$databaseUrl = "DATABASE_URL=`"mysql://research_app:$encodedPassword@localhost:3306/research_papers`""
$shadowDatabaseUrl = "SHADOW_DATABASE_URL=`"mysql://research_app:$encodedPassword@localhost:3306/research_papers_shadow`""
$updatedLines = foreach ($line in Get-Content -LiteralPath $examplePath) {
    if ($line.StartsWith("DATABASE_URL=")) {
        $databaseUrl
    } elseif ($line.StartsWith("SHADOW_DATABASE_URL=")) {
        $shadowDatabaseUrl
    } elseif ($line.StartsWith("AUTH_SECRET=")) {
        "AUTH_SECRET=`"$authSecret`""
    } else {
        $line
    }
}

$content = ($updatedLines -join [Environment]::NewLine) + [Environment]::NewLine
[System.IO.File]::WriteAllText(
    $environmentPath,
    $content,
    [System.Text.UTF8Encoding]::new($false)
)

Remove-Variable plainPassword, encodedPassword, databaseUrl, shadowDatabaseUrl, authSecret, secretBytes -ErrorAction SilentlyContinue
Write-Output "Created the private .env file. Your password and session secret were not displayed."
Write-Output "Next, return to the project terminal and run: npm run db:migrate"
