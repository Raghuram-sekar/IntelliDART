# IntelliDART - Windows PowerShell Installation Guide

## 🚀 Quick Start (Recommended)

### 1. **Run as Administrator**
Open PowerShell as Administrator and navigate to your project directory:

```powershell
# Navigate to your project directory
cd C:\path\to\IntelliDART

# Run the installation script
.\install-dependencies.ps1
```

### 2. **Setup the Project**
```powershell
# Setup the project
.\setup.ps1
```

### 3. **Start the Application**
```powershell
# Start all services
.\start.ps1
```

### 4. **Access the Application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **AI Service**: http://localhost:8000

## 📋 Manual Installation Steps

### Prerequisites

#### 1. **Enable PowerShell Script Execution**
```powershell
# Run as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### 2. **Install Chocolatey (Package Manager)**
```powershell
# Run as Administrator
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

### Installing Dependencies

#### 1. **Node.js & npm**
```powershell
# Using Chocolatey (recommended)
choco install nodejs -y

# Verify installation
node --version
npm --version
```

#### 2. **Python**
```powershell
# Using Chocolatey
choco install python -y

# Verify installation
python --version
pip --version
```

#### 3. **PostgreSQL**
```powershell
# Using Chocolatey
choco install postgresql -y

# Verify installation
psql --version
```

#### 4. **Docker Desktop**
```powershell
# Using Chocolatey
choco install docker-desktop -y

# Or download manually from: https://www.docker.com/products/docker-desktop
```

#### 5. **Git**
```powershell
# Using Chocolatey
choco install git -y

# Verify installation
git --version
```

## 🔧 Verification Commands

Run these commands to verify all installations:

```powershell
# Check Node.js
node --version    # Should be 18.x or higher
npm --version     # Should be 9.x or higher

# Check Python
python --version  # Should be 3.9 or higher
pip --version     # Should be available

# Check PostgreSQL
psql --version    # Should be 14.x or higher

# Check Docker
docker --version
docker-compose --version

# Check Git
git --version
```

## 📦 Project Setup Commands

### 1. **Clone Repository** (if not already done)
```powershell
git clone <your-repository-url>
cd IntelliDART
```

### 2. **Install Dependencies**
```powershell
# Backend dependencies
cd backend
npm install
cd ..

# Frontend dependencies
cd frontend
npm install
cd ..

# AI service dependencies
cd ai-service
pip install -r requirements.txt
cd ..
```

### 3. **Create Environment Files**
```powershell
# Backend environment
Copy-Item "backend\env.example" "backend\.env"

# Frontend environment
@"
REACT_APP_API_URL=http://localhost:3001
REACT_APP_AI_SERVICE_URL=http://localhost:8000
"@ | Out-File -FilePath "frontend\.env" -Encoding UTF8

# AI service environment
@"
OPENAI_API_KEY=your-openai-api-key
DATABASE_URL=postgresql://postgres:password@localhost:5432/intellidart
"@ | Out-File -FilePath "ai-service\.env" -Encoding UTF8
```

### 4. **Database Setup**
```powershell
# Start PostgreSQL container
docker-compose up postgres -d

# Wait a few seconds
Start-Sleep -Seconds 5

# Run database migrations
cd backend
npx prisma migrate dev
npx prisma generate
cd ..
```

## 🚀 Running the Application

### Option 1: Using Docker (Recommended)
```powershell
# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs

# Stop services
docker-compose down
```

### Option 2: Manual Start
```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start

# Terminal 3 - AI Service
cd ai-service
uvicorn main:app --reload

# Terminal 4 - Database (if not using Docker)
# PostgreSQL should be running as a service
```

## 🔍 Troubleshooting

### Common Issues

#### 1. **PowerShell Execution Policy**
```powershell
# Run as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### 2. **Port Already in Use**
```powershell
# Find process using port
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :8000

# Kill process by PID
taskkill /PID <PID> /F
```

#### 3. **Docker Not Running**
```powershell
# Start Docker Desktop manually or via command line
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
```

#### 4. **Database Connection Issues**
```powershell
# Check if PostgreSQL is running
Get-Service postgresql*

# Start PostgreSQL if stopped
Start-Service postgresql*
```

#### 5. **Node Modules Issues**
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

#### 6. **Python Virtual Environment**
```powershell
# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
```

### PowerShell-Specific Commands

#### Check if Command Exists
```powershell
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Usage
if (Test-Command node) {
    Write-Host "Node.js is installed"
}
```

#### Check if Port is in Use
```powershell
function Test-Port($port) {
    $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    return $connection -ne $null
}

# Usage
if (Test-Port 3000) {
    Write-Host "Port 3000 is in use"
}
```

#### Create Environment Files
```powershell
# Create .env file with content
@"
DATABASE_URL=postgresql://postgres:password@localhost:5432/intellidart
JWT_SECRET=your-secret-key
"@ | Out-File -FilePath ".env" -Encoding UTF8
```

## 📚 Useful PowerShell Commands

### File Operations
```powershell
# Copy file
Copy-Item "source.txt" "destination.txt"

# Create directory
New-Item -ItemType Directory -Name "newfolder"

# Check if file exists
Test-Path "file.txt"
```

### Process Management
```powershell
# Get running processes
Get-Process

# Kill process by name
Stop-Process -Name "processname" -Force

# Kill process by PID
Stop-Process -Id <PID> -Force
```

### Network Operations
```powershell
# Test network connectivity
Test-NetConnection -ComputerName localhost -Port 3000

# Get network connections
Get-NetTCPConnection
```

### Docker Commands
```powershell
# Build and start services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes (careful!)
docker-compose down -v
```

## ✅ Verification Checklist

- [ ] PowerShell execution policy set to RemoteSigned
- [ ] Chocolatey installed
- [ ] Node.js 18+ installed
- [ ] Python 3.9+ installed
- [ ] PostgreSQL 14+ installed
- [ ] Docker Desktop installed and running
- [ ] Git installed
- [ ] Repository cloned
- [ ] Dependencies installed
- [ ] Environment files created
- [ ] Database setup complete
- [ ] Application running successfully

## 🎯 Quick Commands Summary

```powershell
# Install everything
.\install-dependencies.ps1

# Setup project
.\setup.ps1

# Start application
.\start.ps1

# Stop application
docker-compose down

# View logs
docker-compose logs

# Restart services
docker-compose restart
```

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Check service logs: `docker-compose logs`
4. Ensure Docker Desktop is running
5. Verify ports are not occupied by other services

## 🔗 Useful Links

- **Node.js**: https://nodejs.org/
- **Python**: https://www.python.org/downloads/
- **PostgreSQL**: https://www.postgresql.org/download/windows/
- **Docker Desktop**: https://www.docker.com/products/docker-desktop
- **Chocolatey**: https://chocolatey.org/
- **Git**: https://git-scm.com/download/win

---

**IntelliDART** - Your intelligent online tutor marketplace for STEM students! 