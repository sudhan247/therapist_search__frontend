#!/bin/bash

# Local development startup script
echo "🚀 Starting Therapist Search Frontend..."
echo "📁 Working directory: $(pwd)"

# Activate virtual environment
if [ -d "venv" ]; then
    echo "✅ Activating virtual environment..."
    source venv/bin/activate
else
    echo "❌ Virtual environment not found. Please run: python3 -m venv venv"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt

# Start the server
echo "🌐 Starting server on http://localhost:8000"
echo "🔗 Backend API: https://therapistsearch-production.up.railway.app"
uvicorn main:app --host 0.0.0.0 --port 8000 --reload