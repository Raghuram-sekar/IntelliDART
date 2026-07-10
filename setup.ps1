# IntelliDART - Windows PowerShell Setup Script

Write-Host "🚀 IntelliDART - Windows Setup" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green
Write-Host ""

# Function to check if command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Check if required tools are installed
Write-Host "🔍 Checking required tools..." -ForegroundColor Yellow

$requiredTools = @("node", "npm", "python", "pip", "git")
$missingTools = @()

foreach ($tool in $requiredTools) {
    if (Test-Command $tool) {
        Write-Host "✅ $tool is installed" -ForegroundColor Green
    } else {
        Write-Host "❌ $tool is missing" -ForegroundColor Red
        $missingTools += $tool
    }
}

if ($missingTools.Count -gt 0) {
    Write-Host ""
    Write-Host "❌ Missing required tools: $($missingTools -join ', ')" -ForegroundColor Red
    Write-Host "Please run .\install-dependencies.ps1 first" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "✅ All required tools are installed" -ForegroundColor Green
Write-Host ""

# Create environment files
Write-Host "📝 Creating environment files..." -ForegroundColor Yellow

# Backend environment
if (!(Test-Path "backend\.env")) {
    Copy-Item "backend\env.example" "backend\.env"
    Write-Host "✅ Created backend\.env" -ForegroundColor Green
} else {
    Write-Host "ℹ️  backend\.env already exists" -ForegroundColor Yellow
}

# Frontend environment
if (!(Test-Path "frontend\.env")) {
    @"
REACT_APP_API_URL=http://localhost:3001
REACT_APP_AI_SERVICE_URL=http://localhost:8000
"@ | Out-File -FilePath "frontend\.env" -Encoding UTF8
    Write-Host "✅ Created frontend\.env" -ForegroundColor Green
} else {
    Write-Host "ℹ️  frontend\.env already exists" -ForegroundColor Yellow
}

# AI service environment
if (!(Test-Path "ai-service\.env")) {
    @"
OPENAI_API_KEY=your-openai-api-key
DATABASE_URL=postgresql://postgres:password@localhost:5432/intellidart
"@ | Out-File -FilePath "ai-service\.env" -Encoding UTF8
    Write-Host "✅ Created ai-service\.env" -ForegroundColor Green
} else {
    Write-Host "ℹ️  ai-service\.env already exists" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔧 Installing dependencies..." -ForegroundColor Yellow

# Install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Cyan
Set-Location backend
npm install
Set-Location ..

# Install frontend dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Cyan
Set-Location frontend
npm install
Set-Location ..

# Install AI service dependencies
Write-Host "📦 Installing AI service dependencies..." -ForegroundColor Cyan
Set-Location ai-service
pip install -r requirements.txt
Set-Location ..

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Update the environment files with your actual API keys and configuration" -ForegroundColor White
Write-Host "2. Run '.\start.ps1' to start all services" -ForegroundColor White
Write-Host "3. Access the application at http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Services:" -ForegroundColor Cyan
Write-Host "- Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "- Backend API: http://localhost:3001" -ForegroundColor White
Write-Host "- AI Service: http://localhost:8000" -ForegroundColor White
Write-Host "- Database: localhost:5432" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "- API Documentation: http://localhost:3001/api/docs" -ForegroundColor White
Write-Host "- AI Service Documentation: http://localhost:8000/docs" -ForegroundColor White 