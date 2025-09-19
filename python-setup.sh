#!/bin/bash

echo "🏈 Football Data Analysis - Python Backend Setup"
echo "==============================================="
echo ""

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check Python version
PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
MAJOR_VERSION=$(echo $PYTHON_VERSION | cut -d'.' -f1)
MINOR_VERSION=$(echo $PYTHON_VERSION | cut -d'.' -f2)

if [ "$MAJOR_VERSION" -lt 3 ] || ([ "$MAJOR_VERSION" -eq 3 ] && [ "$MINOR_VERSION" -lt 8 ]); then
    echo "❌ Python version $PYTHON_VERSION is not supported. Please install Python 3.8 or higher."
    exit 1
fi

echo "✅ Python $PYTHON_VERSION detected"
echo ""

# Create virtual environment
echo "📦 Setting up Python virtual environment..."
cd python-backend

if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "✅ Virtual environment created"
else
    echo "✅ Virtual environment already exists"
fi

# Activate virtual environment and install dependencies
echo "📦 Installing Python dependencies..."
source venv/bin/activate
pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "❌ Failed to install Python dependencies."
    exit 1
fi

echo ""
echo "🎉 Python backend setup complete!"
echo ""
echo "🚀 To start the Python backend:"
echo "   cd python-backend"
echo "   source venv/bin/activate"
echo "   python server.py"
echo ""
echo "📱 The backend API will be available at:"
echo "   http://localhost:3001"
echo ""
echo "🔗 Test the API:"
echo "   curl http://localhost:3001/api/health"
echo ""
echo "📝 To use with the frontend, make sure the frontend is configured to use localhost:3001"