#!/bin/bash

set -e

echo "Starting IZZZI deployment..."

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

if [ ! -f "docker-compose.yml" ]; then
    echo "Error: docker-compose.yml not found. Are you in the project root?"
    exit 1
fi

mkdir -p env

if [ ! -f "env/.env" ]; then
    echo "env/.env not found. Creating from template..."
    echo "Please update the .env file with your production values!"
fi

echo "Stopping existing containers..."
docker compose down || true

if [ -d ".git" ]; then
    echo "Pulling latest changes..."
    git pull origin fixprod || true
fi

echo "Building and starting containers..."
docker compose up -d --build

echo "Waiting for services to start..."
sleep 10

echo "Container status:"
docker compose ps

echo ""
echo "Recent logs (last 20 lines):"
docker compose logs --tail=20

echo ""
echo "${GREEN}Deployment complete!${NC}"
echo ""
echo "Your application should be available at:"
echo "   Frontend: http://167.99.135.132"
echo "   Backend API: http://167.99.135.132/api"
echo "   API Docs: http://167.99.135.132/api/docs"
echo ""
echo "Useful commands:"
echo "   View logs: docker compose logs -f"
echo "   Stop: docker compose down"
echo "   Restart: docker compose restart"
echo "   Status: docker compose ps"
