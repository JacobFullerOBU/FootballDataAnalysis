#!/bin/bash

echo "🏈 Football Data Analysis - Yarn Setup (NPM Alternative)"
echo "========================================================"
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

# Check if Yarn is installed
if ! command -v yarn &> /dev/null; then
    echo "📦 Yarn is not installed. Installing Yarn..."
    
    # Install Yarn using npm (this is a one-time setup)
    npm install -g yarn
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Yarn. Please install Yarn manually:"
        echo "   Visit: https://yarnpkg.com/getting-started/install"
        exit 1
    fi
    
    echo "✅ Yarn installed successfully"
else
    echo "✅ Yarn $(yarn --version) detected"
fi

echo ""

# Install dependencies and set up the project using Yarn
echo "📦 Installing dependencies and setting up the project with Yarn..."
yarn install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies. Please check the error messages above."
    exit 1
fi

echo ""
echo "🎉 Setup complete! You can now use Yarn instead of npm:"
echo ""
echo "   Start development server:"
echo "   yarn dev"
echo ""
echo "   Build for production:"
echo "   yarn build"
echo ""
echo "   Start production server:"
echo "   yarn start"
echo ""
echo "   Install client dependencies:"
echo "   yarn install:client"
echo ""
echo "📖 For more commands, see the README.md file"
echo ""
echo "🚀 To get started now, run: yarn dev"