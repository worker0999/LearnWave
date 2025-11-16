Write-Host "This will create a .env.local file in the current directory (project root)."
Write-Host "Input will be hidden while you type the API key."
$keySecure = Read-Host -AsSecureString "Enter GEMINI_API_KEY"
if (-not $keySecure) {
  Write-Host "No key provided. Exiting."; exit 1
}
# Convert SecureString to plain text in-memory (temporary)
$ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($keySecure)
try {
  $key = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
} finally {
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
}
$model = "gemini-2.0-flash"
$content = "GEMINI_API_KEY=$key`nGEMINI_MODEL=$model`n"
Set-Content -Path .env.local -Value $content -Encoding UTF8
Write-Host ".env.local created in $(Get-Location)."
Write-Host "Reminder: do NOT commit .env.local to your git repository."
