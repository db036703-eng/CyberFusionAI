#!/bin/bash
# CyberFusion AI Setup Script

echo "Initializing CyberFusion AI Monorepo..."

# Copy environment example
if [ ! -f .env ]; then
    echo "Copying .env.example to .env..."
    cp .env.example .env
fi

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install --legacy-peer-deps
cd ..

# Verify Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "WARNING: Docker does not seem to be running. Make sure Docker Desktop is active."
else
    echo "Docker detected."
fi

echo "Setup complete! You can run the stack with: docker compose up --build"
