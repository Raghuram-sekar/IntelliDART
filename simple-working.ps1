# Simple Working Setup Script
Write-Host "🚀 IntelliDART - Simple Working Setup" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

# Check tools
Write-Host "🔍 Checking tools..." -ForegroundColor Yellow

if (Get-Command node -ErrorAction SilentlyContinue) {
    Write-Host "✅ Node.js is installed" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js is missing" -ForegroundColor Red
}

if (Get-Command npm -ErrorAction SilentlyContinue) {
    Write-Host "✅ npm is installed" -ForegroundColor Green
} else {
    Write-Host "❌ npm is missing" -ForegroundColor Red
}

if (Get-Command python -ErrorAction SilentlyContinue) {
    Write-Host "✅ Python is installed" -ForegroundColor Green
} else {
    Write-Host "❌ Python is missing" -ForegroundColor Red
}

if (Get-Command git -ErrorAction SilentlyContinue) {
    Write-Host "✅ Git is installed" -ForegroundColor Green
} else {
    Write-Host "❌ Git is missing" -ForegroundColor Red
}

Write-Host ""
Write-Host "📝 Creating environment files..." -ForegroundColor Yellow

# Create backend .env
if (!(Test-Path "backend\.env")) {
    if (Test-Path "backend\env.example") {
        Copy-Item "backend\env.example" "backend\.env"
        Write-Host "✅ Created backend\.env" -ForegroundColor Green
    } else {
        Write-Host "⚠️  backend\env.example not found" -ForegroundColor Yellow
    }
} else {
    Write-Host "ℹ️  backend\.env already exists" -ForegroundColor Yellow
}

# Create frontend .env
if (!(Test-Path "frontend\.env")) {
    $content = "REACT_APP_API_URL=http://localhost:3001`nREACT_APP_AI_SERVICE_URL=http://localhost:8000"
    $content | Out-File -FilePath "frontend\.env" -Encoding UTF8
    Write-Host "✅ Created frontend\.env" -ForegroundColor Green
} else {
    Write-Host "ℹ️  frontend\.env already exists" -ForegroundColor Yellow
}

# Create AI service .env
if (!(Test-Path "ai-service\.env")) {
    $content = "OPENAI_API_KEY=your-openai-api-key`nDATABASE_URL=postgresql://postgres:password@localhost:5432/intellidart"
    $content | Out-File -FilePath "ai-service\.env" -Encoding UTF8
    Write-Host "✅ Created ai-service\.env" -ForegroundColor Green
} else {
    Write-Host "ℹ️  ai-service\.env already exists" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔧 Installing dependencies..." -ForegroundColor Yellow

# Install backend dependencies
if (Test-Path "backend\package.json") {
    Write-Host "📦 Installing backend dependencies..." -ForegroundColor Cyan
    Set-Location backend
    npm install
    Set-Location ..
} else {
    Write-Host "⚠️  backend\package.json not found" -ForegroundColor Yellow
}

# Install frontend dependencies
if (Test-Path "frontend\package.json") {
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Cyan
    Set-Location frontend
    npm install
    Set-Location ..
} else {
    Write-Host "⚠️  frontend\package.json not found" -ForegroundColor Yellow
}

# Install AI service dependencies
if (Test-Path "ai-service\requirements.txt") {
    Write-Host "📦 Installing AI service dependencies..." -ForegroundColor Cyan
    Set-Location ai-service
    pip install -r requirements.txt
    Set-Location ..
} else {
    Write-Host "⚠️  ai-service\requirements.txt not found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Install PostgreSQL and Docker" -ForegroundColor White
Write-Host "2. Update environment files with API keys" -ForegroundColor White
Write-Host "3. Run docker-compose up" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Services:" -ForegroundColor Cyan
Write-Host "- Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "- Backend: http://localhost:3001" -ForegroundColor White
Write-Host "- AI Service: http://localhost:8000" -ForegroundColor White 