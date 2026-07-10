#!/bin/bash

echo "🚀 Starting IntelliDART - Online Tutor Marketplace"
echo "=================================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up --build -d

echo ""
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
echo "🔍 Checking service status..."

# Check backend
if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ Backend API is running at http://localhost:3001"
else
    echo "❌ Backend API is not responding"
fi

# Check frontend
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend is running at http://localhost:3000"
else
    echo "❌ Frontend is not responding"
fi

# Check AI service
if curl -s http://localhost:8000/health > /dev/null; then
    echo "✅ AI Service is running at http://localhost:8000"
else
    echo "❌ AI Service is not responding"
fi

echo ""
echo "🎉 IntelliDART is now running!"
echo ""
echo "🔗 Access your application:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:3001"
echo "- AI Service: http://localhost:8000"
echo ""
echo "📚 Documentation:"
echo "- API Documentation: http://localhost:3001/api/docs"
echo "- AI Service Documentation: http://localhost:8000/docs"
echo ""
echo "🛑 To stop the application, run: docker-compose down" 