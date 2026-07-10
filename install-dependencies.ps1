# IntelliDART - Windows PowerShell Installation Script
# Run this script as Administrator

param(
    [switch]$SkipChocolatey,
    [switch]$SkipDocker
)

Write-Host "🚀 IntelliDART - Windows Dependency Installation" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
Write-Host ""

# Function to check if command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Function to install Chocolatey
function Install-Chocolatey {
    Write-Host "📦 Installing Chocolatey package manager..." -ForegroundColor Yellow
    
    if (!(Test-Command choco)) {
        Set-ExecutionPolicy Bypass -Scope Process -Force
        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
        iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
        Write-Host "✅ Chocolatey installed successfully" -ForegroundColor Green
    } else {
        Write-Host "✅ Chocolatey already installed" -ForegroundColor Green
    }
}

# Function to install Node.js
function Install-NodeJS {
    Write-Host "📦 Installing Node.js..." -ForegroundColor Yellow
    
    if (!(Test-Command node)) {
        if (Test-Command choco) {
            choco install nodejs -y
        } else {
            Write-Host "❌ Chocolatey not found. Please install Chocolatey first or download Node.js manually from https://nodejs.org/" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "✅ Node.js already installed: $(node --version)" -ForegroundColor Green
    }
}

# Function to install Python
function Install-Python {
    Write-Host "🐍 Installing Python..." -ForegroundColor Yellow
    
    if (!(Test-Command python)) {
        if (Test-Command choco) {
            choco install python -y
        } else {
            Write-Host "❌ Chocolatey not found. Please install Chocolatey first or download Python manually from https://www.python.org/" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "✅ Python already installed: $(python --version)" -ForegroundColor Green
    }
}

# Function to install PostgreSQL
function Install-PostgreSQL {
    Write-Host "🗄️ Installing PostgreSQL..." -ForegroundColor Yellow
    
    if (!(Test-Command psql)) {
        if (Test-Command choco) {
            choco install postgresql -y
        } else {
            Write-Host "❌ Chocolatey not found. Please install Chocolatey first or download PostgreSQL manually from https://www.postgresql.org/" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "✅ PostgreSQL already installed: $(psql --version)" -ForegroundColor Green
    }
}

# Function to install Docker Desktop
function Install-Docker {
    Write-Host "🐳 Installing Docker Desktop..." -ForegroundColor Yellow
    
    if (!(Test-Command docker)) {
        if (Test-Command choco) {
            choco install docker-desktop -y
        } else {
            Write-Host "❌ Chocolatey not found. Please install Chocolatey first or download Docker Desktop manually from https://www.docker.com/" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "✅ Docker already installed: $(docker --version)" -ForegroundColor Green
    }
}

# Function to install Git
function Install-Git {
    Write-Host "📝 Installing Git..." -ForegroundColor Yellow
    
    if (!(Test-Command git)) {
        if (Test-Command choco) {
            choco install git -y
        } else {
            Write-Host "❌ Chocolatey not found. Please install Git manually from https://git-scm.com/" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "✅ Git already installed: $(git --version)" -ForegroundColor Green
    }
}

# Function to verify installations
function Test-Installations {
    Write-Host ""
    Write-Host "🔍 Verifying installations..." -ForegroundColor Cyan
    Write-Host ""
    
    # Check Node.js
    if (Test-Command node) {
        Write-Host "✅ Node.js: $(node --version)" -ForegroundColor Green
    } else {
        Write-Host "❌ Node.js not found" -ForegroundColor Red
    }
    
    # Check npm
    if (Test-Command npm) {
        Write-Host "✅ npm: $(npm --version)" -ForegroundColor Green
    } else {
        Write-Host "❌ npm not found" -ForegroundColor Red
    }
    
    # Check Python
    if (Test-Command python) {
        Write-Host "✅ Python: $(python --version)" -ForegroundColor Green
    } else {
        Write-Host "❌ Python not found" -ForegroundColor Red
    }
    
    # Check pip
    if (Test-Command pip) {
        Write-Host "✅ pip: $(pip --version)" -ForegroundColor Green
    } else {
        Write-Host "❌ pip not found" -ForegroundColor Red
    }
    
    # Check PostgreSQL
    if (Test-Command psql) {
        Write-Host "✅ PostgreSQL: $(psql --version)" -ForegroundColor Green
    } else {
        Write-Host "❌ PostgreSQL not found" -ForegroundColor Red
    }
    
    # Check Docker
    if (Test-Command docker) {
        Write-Host "✅ Docker: $(docker --version)" -ForegroundColor Green
    } else {
        Write-Host "❌ Docker not found" -ForegroundColor Red
    }
    
    # Check Docker Compose
    if (Test-Command docker-compose) {
        Write-Host "✅ Docker Compose: $(docker-compose --version)" -ForegroundColor Green
    } else {
        Write-Host "❌ Docker Compose not found" -ForegroundColor Red
    }
    
    # Check Git
    if (Test-Command git) {
        Write-Host "✅ Git: $(git --version)" -ForegroundColor Green
    } else {
        Write-Host "❌ Git not found" -ForegroundColor Red
    }
}

# Main installation process
Write-Host "🔧 Starting dependency installation..." -ForegroundColor Yellow
Write-Host ""

# Install Chocolatey if not skipped
if (!$SkipChocolatey) {
    Install-Chocolatey
} else {
    Write-Host "⏭️ Skipping Chocolatey installation" -ForegroundColor Yellow
}

# Install Node.js
Install-NodeJS

# Install Python
Install-Python

# Install PostgreSQL
Install-PostgreSQL

# Install Docker if not skipped
if (!$SkipDocker) {
    Install-Docker
} else {
    Write-Host "⏭️ Skipping Docker installation" -ForegroundColor Yellow
}

# Install Git
Install-Git

# Verify all installations
Test-Installations

Write-Host ""
Write-Host "🎉 Installation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. If Docker was installed, restart your computer" -ForegroundColor White
Write-Host "2. Run the setup script: .\setup.ps1" -ForegroundColor White
Write-Host "3. Start the application: .\start.ps1" -ForegroundColor White
Write-Host ""
Write-Host "📚 For manual installation instructions, see WINDOWS_INSTALLATION_GUIDE.md" -ForegroundColor Cyan
} 