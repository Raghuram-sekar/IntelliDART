#!/bin/bash

echo "🚀 Setting up IntelliDART - Online Tutor Marketplace"
echo "=================================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Create environment files
echo "📝 Creating environment files..."

# Backend environment
if [ ! -f backend/.env ]; then
    cp backend/env.example backend/.env
    echo "✅ Created backend/.env"
else
    echo "ℹ️  backend/.env already exists"
fi

# Frontend environment
if [ ! -f frontend/.env ]; then
    cat > frontend/.env << EOF
REACT_APP_API_URL=http://localhost:3001
REACT_APP_AI_SERVICE_URL=http://localhost:8000
EOF
    echo "✅ Created frontend/.env"
else
    echo "ℹ️  frontend/.env already exists"
fi

# AI service environment
if [ ! -f ai-service/.env ]; then
    cat > ai-service/.env << EOF
OPENAI_API_KEY=your-openai-api-key
DATABASE_URL=postgresql://postgres:password@localhost:5432/intellidart
EOF
    echo "✅ Created ai-service/.env"
else
    echo "ℹ️  ai-service/.env already exists"
fi

echo ""
echo "🔧 Installing dependencies..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update the environment files with your actual API keys and configuration"
echo "2. Run 'docker-compose up' to start all services"
echo "3. Access the application at http://localhost:3000"
echo ""
echo "🔗 Services:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:3001"
echo "- AI Service: http://localhost:8000"
echo "- Database: localhost:5432"
echo ""
echo "📚 Documentation:"
echo "- API Documentation: http://localhost:3001/api/docs"
echo "- AI Service Documentation: http://localhost:8000/docs" 