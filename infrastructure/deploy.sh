#!/bin/bash
# Deployment script for IZZZI on DigitalOcean
# Run this script on your server after cloning the repository

set -e

echo "🚀 Starting IZZZI deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: docker-compose.yml not found. Are you in the project root?"
    exit 1
fi

# Create env directory if it doesn't exist
mkdir -p env

# Check if .env file exists
if [ ! -f "env/.env" ]; then
    echo "⚠️  env/.env not found. Creating from template..."
    echo "Please update the .env file with your production values!"
    # You can copy from a template or create manually
fi

# Stop any running containers
echo "🛑 Stopping existing containers..."
docker compose down || true

# Pull latest changes (if git repo)
if [ -d ".git" ]; then
    echo "📥 Pulling latest changes..."
    git pull origin fixprod || true
fi

# Build and start containers
echo "🔨 Building and starting containers..."
docker compose up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check container status
echo "📊 Container status:"
docker compose ps

# Show logs
echo ""
echo "📋 Recent logs (last 20 lines):"
docker compose logs --tail=20

echo ""
echo "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "🌐 Your application should be available at:"
echo "   Frontend: http://167.99.135.132:3000"
echo "   Backend API: http://167.99.135.132:4000/api"
echo "   API Docs: http://167.99.135.132:4000/api/docs"
echo ""
echo "📝 Useful commands:"
echo "   View logs: docker compose logs -f"
echo "   Stop: docker compose down"
echo "   Restart: docker compose restart"
echo "   Status: docker compose ps"
