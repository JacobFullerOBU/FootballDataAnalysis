#!/bin/bash

# Football Data Analysis Demo Setup Script
# This script builds the application and sets up the demo with sample data

echo "🏈 Football Data Analysis Demo Setup"
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "📦 Installing client dependencies..."
cd client && npm install && cd ..

echo "🔧 Setting up environment..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Environment file created from .env.example"
else
    echo "✅ Environment file already exists"
fi

echo "🏗️  Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "🎉 Demo setup complete!"
echo ""
echo "📝 What this demo includes:"
echo "  • 20 NFL teams from different divisions"
echo "  • 14 college football teams from major conferences"
echo "  • Sample games (upcoming and completed)"
echo "  • Betting lines from multiple bookmakers"
echo "  • Team statistics and analysis"
echo ""
echo "🚀 To start the demo:"
echo "  npm start"
echo ""
echo "📱 The application will be available at:"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:3001"
echo ""
echo "🔗 API endpoints to explore:"
echo "  • GET /api/teams - View all teams"
echo "  • GET /api/games/upcoming/10 - View upcoming games"
echo "  • GET /api/games/recent/10 - View recent games"
echo "  • GET /api/betting/upcoming/all - View betting lines"
echo "  • GET /api/health - Check server status"
echo ""