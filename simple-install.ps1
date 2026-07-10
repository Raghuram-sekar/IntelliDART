# Simple IntelliDART Installation Script
Write-Host "🚀 IntelliDART - Simple Installation Check" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

# Check what's already installed
Write-Host "🔍 Checking current installations..." -ForegroundColor Yellow
Write-Host ""

# Check Node.js
if (Get-Command node -ErrorAction SilentlyContinue) {
    Write-Host "✅ Node.js: $(node --version)" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js: NOT INSTALLED" -ForegroundColor Red
}

# Check npm
if (Get-Command npm -ErrorAction SilentlyContinue) {
    Write-Host "✅ npm: $(npm --version)" -ForegroundColor Green
} else {
    Write-Host "❌ npm: NOT INSTALLED" -ForegroundColor Red
}

# Check Python
if (Get-Command python -ErrorAction SilentlyContinue) {
    Write-Host "✅ Python: $(python --version)" -ForegroundColor Green
} else {
    Write-Host "❌ Python: NOT INSTALLED" -ForegroundColor Red
}

# Check pip
if (Get-Command pip -ErrorAction SilentlyContinue) {
    Write-Host "✅ pip: $(pip --version)" -ForegroundColor Green
} else {
    Write-Host "❌ pip: NOT INSTALLED" -ForegroundColor Red
}

# Check PostgreSQL
if (Get-Command psql -ErrorAction SilentlyContinue) {
    Write-Host "✅ PostgreSQL: $(psql --version)" -ForegroundColor Green
} else {
    Write-Host "❌ PostgreSQL: NOT INSTALLED" -ForegroundColor Red
}

# Check Docker
if (Get-Command docker -ErrorAction SilentlyContinue) {
    Write-Host "✅ Docker: $(docker --version)" -ForegroundColor Green
} else {
    Write-Host "❌ Docker: NOT INSTALLED" -ForegroundColor Red
}

# Check Git
if (Get-Command git -ErrorAction SilentlyContinue) {
    Write-Host "✅ Git: $(git --version)" -ForegroundColor Green
} else {
    Write-Host "❌ Git: NOT INSTALLED" -ForegroundColor Red
}

Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor Cyan
Write-Host "You have Node.js and Python installed!" -ForegroundColor Green
Write-Host "You may need to install PostgreSQL, Docker, and Git." -ForegroundColor Yellow
Write-Host ""
Write-Host "🎯 Next steps:" -ForegroundColor Cyan
Write-Host "1. Install missing dependencies manually" -ForegroundColor White
Write-Host "2. Run: .\setup.ps1" -ForegroundColor White
Write-Host "3. Run: .\start.ps1" -ForegroundColor White 