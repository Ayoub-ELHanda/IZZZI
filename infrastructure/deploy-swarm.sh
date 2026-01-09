#!/bin/bash

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

STACK_NAME="izzzi"

echo "=========================================="
echo "   IZZZI Docker Swarm Deployment"
echo "=========================================="

check_swarm() {
    if ! docker info 2>/dev/null | grep -q "Swarm: active"; then
        echo -e "${YELLOW}Swarm not initialized. Initializing...${NC}"
        docker swarm init --advertise-addr $(hostname -I | awk '{print $1}')
        echo -e "${GREEN}Swarm initialized!${NC}"
    else
        echo -e "${GREEN}Swarm already active${NC}"
    fi
}

build_images() {
    echo ""
    echo "Building Docker images..."
    
    docker build -t izzzi/backend:latest -f apps/backend/Dockerfile .
    docker build -t izzzi/frontend:latest -f apps/frontend/Dockerfile .
    
    echo -e "${GREEN}Images built successfully${NC}"
}

deploy_stack() {
    echo ""
    echo "Deploying stack..."
    
    docker stack deploy -c docker-stack.yml $STACK_NAME
    
    echo -e "${GREEN}Stack deployed!${NC}"
}

show_status() {
    echo ""
    echo "=========================================="
    echo "   Stack Status"
    echo "=========================================="
    
    echo ""
    echo "Services:"
    docker stack services $STACK_NAME
    
    echo ""
    echo "Tasks:"
    docker stack ps $STACK_NAME --no-trunc
}

show_urls() {
    echo ""
    echo "=========================================="
    echo "   Access URLs"
    echo "=========================================="
    echo ""
    echo "Frontend:   http://167.99.135.132"
    echo "Backend:    http://167.99.135.132/api"
    echo "API Docs:   http://167.99.135.132/api/docs"
    echo "Visualizer: http://167.99.135.132:8080"
    echo ""
}

show_commands() {
    echo "=========================================="
    echo "   Useful Commands"
    echo "=========================================="
    echo ""
    echo "View services:     docker stack services $STACK_NAME"
    echo "View tasks:        docker stack ps $STACK_NAME"
    echo "View logs:         docker service logs ${STACK_NAME}_backend"
    echo "Scale service:     docker service scale ${STACK_NAME}_frontend=3"
    echo "Update service:    docker service update ${STACK_NAME}_backend"
    echo "Remove stack:      docker stack rm $STACK_NAME"
    echo "Leave swarm:       docker swarm leave --force"
    echo ""
}

case "${1:-deploy}" in
    init)
        check_swarm
        ;;
    build)
        build_images
        ;;
    deploy)
        check_swarm
        build_images
        deploy_stack
        sleep 10
        show_status
        show_urls
        show_commands
        ;;
    status)
        show_status
        ;;
    scale)
        if [ -z "$2" ] || [ -z "$3" ]; then
            echo "Usage: $0 scale <service> <replicas>"
            echo "Example: $0 scale frontend 3"
            exit 1
        fi
        docker service scale ${STACK_NAME}_$2=$3
        ;;
    logs)
        if [ -z "$2" ]; then
            echo "Usage: $0 logs <service>"
            echo "Example: $0 logs backend"
            exit 1
        fi
        docker service logs -f ${STACK_NAME}_$2
        ;;
    remove)
        echo "Removing stack..."
        docker stack rm $STACK_NAME
        echo -e "${GREEN}Stack removed${NC}"
        ;;
    *)
        echo "Usage: $0 {init|build|deploy|status|scale|logs|remove}"
        echo ""
        echo "Commands:"
        echo "  init    - Initialize Docker Swarm"
        echo "  build   - Build Docker images"
        echo "  deploy  - Full deployment (init + build + deploy)"
        echo "  status  - Show stack status"
        echo "  scale   - Scale a service (e.g., scale frontend 3)"
        echo "  logs    - View service logs (e.g., logs backend)"
        echo "  remove  - Remove the stack"
        exit 1
        ;;
esac
