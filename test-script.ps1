# Simple test script
Write-Host "Testing PowerShell script execution..." -ForegroundColor Green

# Test if we can run basic commands
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
Write-Host "PowerShell version: $($PSVersionTable.PSVersion)" -ForegroundColor Yellow

# Test if Node.js is installed
if (Get-Command node -ErrorAction SilentlyContinue) {
    Write-Host "✅ Node.js is installed: $(node --version)" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js is NOT installed" -ForegroundColor Red
}

# Test if Python is installed
if (Get-Command python -ErrorAction SilentlyContinue) {
    Write-Host "✅ Python is installed: $(python --version)" -ForegroundColor Green
} else {
    Write-Host "❌ Python is NOT installed" -ForegroundColor Red
}

Write-Host "Test completed!" -ForegroundColor Green 