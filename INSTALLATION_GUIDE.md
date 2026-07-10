# IntelliDART - Complete Installation Guide

## 🛠️ Prerequisites Installation

This guide will help you install all necessary software to run IntelliDART on your laptop.

### 1. **Node.js & npm** (Required for Backend & Frontend)

#### Windows:
1. Download Node.js from: https://nodejs.org/
2. Choose the LTS version (recommended)
3. Run the installer and follow the setup wizard
4. Verify installation:
```bash
node --version
npm --version
```

#### macOS:
```bash
# Using Homebrew (recommended)
brew install node

# Or download from https://nodejs.org/
```

#### Linux (Ubuntu/Debian):
```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 2. **Python** (Required for AI Service)

#### Windows:
1. Download Python from: https://www.python.org/downloads/
2. Choose Python 3.9 or higher
3. **Important**: Check "Add Python to PATH" during installation
4. Verify installation:
```bash
python --version
pip --version
```

#### macOS:
```bash
# Using Homebrew
brew install python

# Or download from https://www.python.org/downloads/
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv

# Verify installation
python3 --version
pip3 --version
```

### 3. **PostgreSQL** (Database)

#### Windows:
1. Download from: https://www.postgresql.org/download/windows/
2. Run the installer
3. Remember the password you set for the postgres user
4. Add PostgreSQL to PATH if not done automatically

#### macOS:
```bash
# Using Homebrew
brew install postgresql
brew services start postgresql

# Or download from https://www.postgresql.org/download/macosx/
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 4. **Docker & Docker Compose** (Recommended for easy setup)

#### Windows:
1. Download Docker Desktop from: https://www.docker.com/products/docker-desktop
2. Install and restart your computer
3. Start Docker Desktop
4. Verify installation:
```bash
docker --version
docker-compose --version
```

#### macOS:
```bash
# Using Homebrew
brew install --cask docker

# Or download from https://www.docker.com/products/docker-desktop
```

#### Linux (Ubuntu/Debian):
```bash
# Install Docker
sudo apt update
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER

# Verify installation
docker --version
docker-compose --version
```

### 5. **Git** (Version Control)

#### Windows:
1. Download from: https://git-scm.com/download/win
2. Install with default settings

#### macOS:
```bash
# Using Homebrew
brew install git

# Or download from https://git-scm.com/download/mac
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install git
```

## 🔧 **Installation Verification**

Run these commands to verify all installations:

```bash
# Check Node.js
node --version  # Should be 18.x or higher
npm --version   # Should be 9.x or higher

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

## 📦 **Project Setup**

### 1. **Clone the Repository**
```bash
git clone <your-repository-url>
cd IntelliDART
```

### 2. **Install Dependencies**

#### Backend Dependencies:
```bash
cd backend
npm install
cd ..
```

#### Frontend Dependencies:
```bash
cd frontend
npm install
cd ..
```

#### AI Service Dependencies:
```bash
cd ai-service
pip install -r requirements.txt
cd ..
```

### 3. **Environment Setup**

#### Create Environment Files:
```bash
# Backend environment
cp backend/env.example backend/.env

# Frontend environment
cat > frontend/.env << EOF
REACT_APP_API_URL=http://localhost:3001
REACT_APP_AI_SERVICE_URL=http://localhost:8000
EOF

# AI service environment
cat > ai-service/.env << EOF
OPENAI_API_KEY=your-openai-api-key
DATABASE_URL=postgresql://postgres:password@localhost:5432/intellidart
EOF
```

### 4. **Database Setup**

#### Using Docker (Recommended):
```bash
# Start PostgreSQL container
docker-compose up postgres -d

# Wait a few seconds for the database to start
sleep 5

# Run database migrations
cd backend
npx prisma migrate dev
npx prisma generate
cd ..
```

#### Using Local PostgreSQL:
```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE intellidart;
CREATE USER intellidart_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE intellidart TO intellidart_user;
\q

# Update backend/.env with your database credentials
# DATABASE_URL="postgresql://intellidart_user:your_password@localhost:5432/intellidart"

# Run migrations
cd backend
npx prisma migrate dev
npx prisma generate
cd ..
```

## 🚀 **Running the Application**

### Option 1: Using Docker (Recommended)
```bash
# Start all services
docker-compose up -d

# Check if services are running
docker-compose ps
```

### Option 2: Manual Start
```bash
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

## 🌐 **Access the Application**

Once everything is running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **AI Service**: http://localhost:8000
- **API Documentation**: http://localhost:3001/api/docs
- **AI Service Documentation**: http://localhost:8000/docs

## 🔍 **Troubleshooting**

### Common Issues:

1. **Port already in use**:
```bash
# Find process using port
lsof -i :3000  # or :3001, :8000
# Kill the process
kill -9 <PID>
```

2. **Database connection issues**:
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL if stopped
sudo systemctl start postgresql
```

3. **Node modules issues**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

4. **Python virtual environment**:
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## 📚 **Additional Resources**

- **Node.js Documentation**: https://nodejs.org/docs/
- **Python Documentation**: https://docs.python.org/
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/
- **Docker Documentation**: https://docs.docker.com/
- **React Documentation**: https://reactjs.org/docs/
- **FastAPI Documentation**: https://fastapi.tiangolo.com/

## ✅ **Verification Checklist**

- [ ] Node.js 18+ installed
- [ ] Python 3.9+ installed
- [ ] PostgreSQL 14+ installed
- [ ] Docker & Docker Compose installed
- [ ] Git installed
- [ ] Repository cloned
- [ ] Dependencies installed
- [ ] Environment files created
- [ ] Database setup complete
- [ ] Application running successfully

Once you've completed all these steps, you'll have a fully functional IntelliDART application running on your laptop! 