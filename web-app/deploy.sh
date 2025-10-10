#!/bin/bash

echo "🚀 Deploying Work Time Tracker Web App..."

# Build the app
echo "📦 Building web app..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build completed successfully!"

# Create a simple HTTP server for testing
echo "🌐 Starting local server..."
echo "📱 App available at: http://localhost:4173"
echo "📱 Press Ctrl+C to stop the server"

# Start preview server
npm run preview