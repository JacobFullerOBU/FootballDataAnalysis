#!/bin/bash

echo "🏈 Football Data Analysis - Quick Start"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) and try again."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1)

if [ "$MAJOR_VERSION" -lt 16 ]; then
    echo "❌ Node.js version $NODE_VERSION is not supported. Please install Node.js v16 or higher."
    echo "   Current version: $NODE_VERSION"
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $NODE_VERSION detected"
echo ""

# Install dependencies and set up the project
echo "📦 Installing dependencies and setting up the project..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies. Please check the error messages above."
    exit 1
fi

echo ""
echo "🎉 Setup complete! You can now:"
echo ""
echo "   Start development server:"
echo "   npm run dev"
echo ""
echo "   Build for production:"
echo "   npm run build"
echo ""
echo "   Start production server:"
echo "   npm start"
echo ""
echo "📖 For more commands, see the README.md file"
echo ""
echo "🚀 To get started now, run: npm run dev"