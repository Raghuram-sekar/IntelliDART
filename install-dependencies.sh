#!/bin/bash

echo "🚀 IntelliDART - Dependency Installation Script"
echo "=============================================="
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install Node.js
install_nodejs() {
    echo "📦 Installing Node.js..."
    
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command_exists brew; then
            brew install node
        else
            echo "❌ Homebrew not found. Please install Homebrew first:"
            echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
            exit 1
        fi
    else
        echo "❌ Unsupported OS. Please install Node.js manually from https://nodejs.org/"
        exit 1
    fi
    
    echo "✅ Node.js installed successfully"
}

# Function to install Python
install_python() {
    echo "🐍 Installing Python..."
    
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        sudo apt update
        sudo apt install -y python3 python3-pip python3-venv
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command_exists brew; then
            brew install python
        else
            echo "❌ Homebrew not found. Please install Homebrew first."
            exit 1
        fi
    else
        echo "❌ Unsupported OS. Please install Python manually from https://www.python.org/"
        exit 1
    fi
    
    echo "✅ Python installed successfully"
}

# Function to install PostgreSQL
install_postgresql() {
    echo "🗄️ Installing PostgreSQL..."
    
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        sudo apt update
        sudo apt install -y postgresql postgresql-contrib
        sudo systemctl start postgresql
        sudo systemctl enable postgresql
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command_exists brew; then
            brew install postgresql
            brew services start postgresql
        else
            echo "❌ Homebrew not found. Please install Homebrew first."
            exit 1
        fi
    else
        echo "❌ Unsupported OS. Please install PostgreSQL manually from https://www.postgresql.org/"
        exit 1
    fi
    
    echo "✅ PostgreSQL installed successfully"
}

# Function to install Docker
install_docker() {
    echo "🐳 Installing Docker..."
    
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        sudo apt update
        sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
        sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
        sudo apt update
        sudo apt install -y docker-ce docker-ce-cli containerd.io
        
        # Install Docker Compose
        sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
        
        # Add user to docker group
        sudo usermod -aG docker $USER
        echo "⚠️  Please log out and log back in for Docker group changes to take effect"
        
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command_exists brew; then
            brew install --cask docker
        else
            echo "❌ Homebrew not found. Please install Homebrew first."
            exit 1
        fi
    else
        echo "❌ Unsupported OS. Please install Docker manually from https://www.docker.com/"
        exit 1
    fi
    
    echo "✅ Docker installed successfully"
}

# Function to install Git
install_git() {
    echo "📝 Installing Git..."
    
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        sudo apt update
        sudo apt install -y git
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command_exists brew; then
            brew install git
        else
            echo "❌ Homebrew not found. Please install Homebrew first."
            exit 1
        fi
    else
        echo "❌ Unsupported OS. Please install Git manually from https://git-scm.com/"
        exit 1
    fi
    
    echo "✅ Git installed successfully"
}

# Function to verify installations
verify_installations() {
    echo ""
    echo "🔍 Verifying installations..."
    echo ""
    
    # Check Node.js
    if command_exists node; then
        echo "✅ Node.js: $(node --version)"
    else
        echo "❌ Node.js not found"
    fi
    
    # Check npm
    if command_exists npm; then
        echo "✅ npm: $(npm --version)"
    else
        echo "❌ npm not found"
    fi
    
    # Check Python
    if command_exists python3; then
        echo "✅ Python: $(python3 --version)"
    elif command_exists python; then
        echo "✅ Python: $(python --version)"
    else
        echo "❌ Python not found"
    fi
    
    # Check pip
    if command_exists pip3; then
        echo "✅ pip: $(pip3 --version)"
    elif command_exists pip; then
        echo "✅ pip: $(pip --version)"
    else
        echo "❌ pip not found"
    fi
    
    # Check PostgreSQL
    if command_exists psql; then
        echo "✅ PostgreSQL: $(psql --version)"
    else
        echo "❌ PostgreSQL not found"
    fi
    
    # Check Docker
    if command_exists docker; then
        echo "✅ Docker: $(docker --version)"
    else
        echo "❌ Docker not found"
    fi
    
    # Check Docker Compose
    if command_exists docker-compose; then
        echo "✅ Docker Compose: $(docker-compose --version)"
    else
        echo "❌ Docker Compose not found"
    fi
    
    # Check Git
    if command_exists git; then
        echo "✅ Git: $(git --version)"
    else
        echo "❌ Git not found"
    fi
}

# Main installation process
echo "🔧 Starting dependency installation..."
echo ""

# Install Node.js if not present
if ! command_exists node; then
    install_nodejs
else
    echo "✅ Node.js already installed: $(node --version)"
fi

# Install Python if not present
if ! command_exists python3 && ! command_exists python; then
    install_python
else
    echo "✅ Python already installed"
fi

# Install PostgreSQL if not present
if ! command_exists psql; then
    install_postgresql
else
    echo "✅ PostgreSQL already installed: $(psql --version)"
fi

# Install Docker if not present
if ! command_exists docker; then
    install_docker
else
    echo "✅ Docker already installed: $(docker --version)"
fi

# Install Git if not present
if ! command_exists git; then
    install_git
else
    echo "✅ Git already installed: $(git --version)"
fi

# Verify all installations
verify_installations

echo ""
echo "🎉 Installation complete!"
echo ""
echo "📋 Next steps:"
echo "1. If you're on Linux and Docker was installed, log out and log back in"
echo "2. Run the setup script: ./setup.sh"
echo "3. Start the application: ./start.sh"
echo ""
echo "📚 For manual installation instructions, see INSTALLATION_GUIDE.md" 