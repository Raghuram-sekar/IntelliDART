# IntelliDART - Windows PowerShell Start Script

Write-Host "🚀 IntelliDART - Starting Application" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

# Function to check if command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Function to check if port is in use
function Test-Port($port) {
    $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    return $connection -ne $null
}

# Check if Docker is running
Write-Host "🔍 Checking Docker status..." -ForegroundColor Yellow
if (Test-Command docker) {
    try {
        docker info | Out-Null
        Write-Host "✅ Docker is running" -ForegroundColor Green
    } catch {
        Write-Host "❌ Docker is not running. Please start Docker Desktop" -ForegroundColor Red
        Write-Host "   You can download it from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "❌ Docker is not installed. Please install Docker Desktop first" -ForegroundColor Red
    exit 1
}

# Check if ports are available
Write-Host "🔍 Checking port availability..." -ForegroundColor Yellow
$ports = @(3000, 3001, 8000, 5432)
$occupiedPorts = @()

foreach ($port in $ports) {
    if (Test-Port $port) {
        Write-Host "⚠️  Port $port is already in use" -ForegroundColor Yellow
        $occupiedPorts += $port
    } else {
        Write-Host "✅ Port $port is available" -ForegroundColor Green
    }
}

if ($occupiedPorts.Count -gt 0) {
    Write-Host ""
    Write-Host "⚠️  Some ports are occupied. You may need to stop other services:" -ForegroundColor Yellow
    foreach ($port in $occupiedPorts) {
        Write-Host "   - Port $port" -ForegroundColor White
    }
    Write-Host ""
    $continue = Read-Host "Do you want to continue anyway? (y/N)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        exit 1
    }
}

Write-Host ""
Write-Host "🔨 Building and starting services..." -ForegroundColor Yellow

# Start services using Docker Compose
try {
    docker-compose up --build -d
    Write-Host "✅ Services started successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to start services" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "⏳ Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check if services are running
Write-Host "🔍 Checking service status..." -ForegroundColor Yellow

# Check backend
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend API is running at http://localhost:3001" -ForegroundColor Green
    } else {
        Write-Host "❌ Backend API is not responding properly" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Backend API is not responding" -ForegroundColor Red
}

# Check frontend
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Frontend is running at http://localhost:3000" -ForegroundColor Green
    } else {
        Write-Host "❌ Frontend is not responding properly" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Frontend is not responding" -ForegroundColor Red
}

# Check AI service
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ AI Service is running at http://localhost:8000" -ForegroundColor Green
    } else {
        Write-Host "❌ AI Service is not responding properly" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ AI Service is not responding" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 IntelliDART is now running!" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 Access your application:" -ForegroundColor Cyan
Write-Host "- Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "- Backend API: http://localhost:3001" -ForegroundColor White
Write-Host "- AI Service: http://localhost:8000" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "- API Documentation: http://localhost:3001/api/docs" -ForegroundColor White
Write-Host "- AI Service Documentation: http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "🛑 To stop the application, run: docker-compose down" -ForegroundColor Yellow
Write-Host "📊 To view logs, run: docker-compose logs" -ForegroundColor Yellow
Write-Host "🔄 To restart, run: docker-compose restart" -ForegroundColor Yellow 