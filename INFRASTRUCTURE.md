# IZZZI Infrastructure Documentation

## 📋 Overview

This document describes the infrastructure setup for the IZZZI platform - a student feedback collection system.

---

## 🐳 Docker Compose Stack

### Services Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         IZZZI Stack                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐       │
│  │  Frontend   │────▶│   Backend   │────▶│  PostgreSQL │       │
│  │  (Next.js)  │     │  (NestJS)   │     │    :5432    │       │
│  │    :3000    │     │    :4000    │     └─────────────┘       │
│  └─────────────┘     └──────┬──────┘                           │
│                             │                                   │
│                             ▼                                   │
│                      ┌─────────────┐     ┌─────────────┐       │
│                      │    Redis    │     │   MailHog   │       │
│                      │    :6379    │     │ :8025/:1025 │       │
│                      └─────────────┘     └─────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Services Details

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| **frontend** | `node:20-alpine` (custom) | 3000 | Next.js 15 web application |
| **backend** | `node:20-alpine` (custom) | 4000 | NestJS REST API |
| **postgres** | `postgres:16` | 5432 | Primary database |
| **redis** | `redis:7` | 6379 | Session storage & caching |
| **mailhog** | `mailhog/mailhog` | 8025, 1025 | Email testing (dev only) |

### Volume Mounts

| Volume | Purpose |
|--------|---------|
| `pgdata` | PostgreSQL data persistence |
| `backend_node_modules` | Backend dependencies cache |

### Environment Variables

#### Backend
```env
DATABASE_URL=postgres://izzzi:izzzi@postgres:5432/izzzi
REDIS_URL=redis://redis:6379
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
FRONTEND_URL=http://167.99.135.132
```

#### Frontend
```env
NODE_ENV=development
NEXT_PUBLIC_API_BASE_URL=http://167.99.135.132/api
```

---

## 🏗️ Terraform Infrastructure (DigitalOcean)

### Module Architecture

```
infrastructure/
├── main.tf              # Module orchestration
├── variables.tf         # Input variables
├── outputs.tf           # Output values
├── providers.tf         # Provider configuration
├── versions.tf          # Version constraints
├── deploy.sh            # Deployment script
└── modules/
    ├── networking/      # VPC configuration
    ├── droplet/         # Server provisioning
    ├── firewall/        # Security rules
    ├── dns/             # Domain management (optional)
    └── spaces/          # Object storage (optional)
```

### Modules Description

#### 1. Networking Module
- Creates a VPC (Virtual Private Cloud)
- Default CIDR: `10.0.0.0/16`
- Isolates resources in a private network

#### 2. Droplet Module
- Provisions the application server
- Default size: `s-2vcpu-4gb` (2 vCPU, 4GB RAM)
- OS: Ubuntu 24.04 LTS
- Optional: monitoring, backups, IPv6

#### 3. Firewall Module
- Configures inbound/outbound rules
- Allows: SSH (22), HTTP (80), HTTPS (443)
- Restricts database ports to VPC only

#### 4. DNS Module (Optional)
- Creates DNS records for custom domain
- A records pointing to droplet IP

#### 5. Spaces Module (Optional)
- Creates S3-compatible object storage
- For backups and static assets

### Key Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `do_token` | - | DigitalOcean API token (required) |
| `project_name` | `izzzi` | Project identifier |
| `environment` | `production` | Environment (staging/production/dev) |
| `region` | `fra1` | Datacenter region |
| `droplet_size` | `s-2vcpu-4gb` | Server size |
| `droplet_image` | `ubuntu-24-04-x64` | OS image |
| `ssh_public_key` | - | SSH key for access (required) |
| `domain_name` | `""` | Custom domain (optional) |
| `create_spaces` | `false` | Enable object storage |

### Outputs

| Output | Description |
|--------|-------------|
| `droplet_ip` | Public IP address |
| `droplet_private_ip` | Private VPC IP |
| `ssh_command` | Ready SSH command |
| `vpc_id` | VPC identifier |
| `firewall_ids` | Firewall identifiers |

---

## 🚀 Deployment

### Prerequisites

- Docker & Docker Compose installed
- Git access to repository
- Environment file (`env/.env`) configured

### Quick Deploy

```bash
# Clone repository
git clone <repository-url>
cd izzzi

# Run deployment
./infrastructure/deploy.sh
```

### Manual Deploy

```bash
# Stop existing containers
docker compose down

# Build and start
docker compose up -d --build

# Check status
docker compose ps

# View logs
docker compose logs -f
```

### Useful Commands

| Command | Description |
|---------|-------------|
| `docker compose ps` | Show container status |
| `docker compose logs -f` | Follow all logs |
| `docker compose logs backend` | Backend logs only |
| `docker compose restart` | Restart all services |
| `docker compose down` | Stop all services |
| `docker compose up -d --build` | Rebuild and start |

---

## 🌐 Access URLs

| Service | URL |
|---------|-----|
| Frontend | http://167.99.135.132 |
| Backend API | http://167.99.135.132/api |
| API Docs | http://167.99.135.132/api/docs |
| MailHog UI | http://167.99.135.132:8025 |

---

## 🔒 Security Notes

### .dockerignore
Excludes sensitive files from Docker builds:
- `node_modules` - Dependencies (rebuilt in container)
- `.env*` - Environment secrets
- `.git` - Version control
- `dist`, `build`, `.next` - Build artifacts

### Firewall Rules (UFW)
```bash
# Current rules
22/tcp   - SSH
80/tcp   - HTTP (Nginx)
443/tcp  - HTTPS
3000/tcp - Frontend (direct)
4000/tcp - Backend (direct)
```

### Nginx Reverse Proxy
- Port 80 → Frontend (:3000)
- Port 80/api → Backend (:4000)

---

## 📁 Project Structure

```
izzzi/
├── apps/
│   ├── backend/           # NestJS API
│   │   ├── Dockerfile.dev
│   │   ├── prisma/
│   │   └── src/
│   └── frontend/          # Next.js App
│       ├── Dockerfile.dev
│       └── app/
├── packages/              # Shared packages
│   ├── types/
│   └── ui/
├── infrastructure/        # Terraform IaC
├── env/
│   └── .env              # Environment variables
├── docker-compose.yml    # Docker orchestration
├── .dockerignore         # Docker build exclusions
└── package.json          # Root workspace config
```

---

## 🔧 Troubleshooting

### Container won't start
```bash
# Check logs
docker compose logs <service-name>

# Rebuild from scratch
docker compose down -v
docker compose up -d --build
```

### Database connection issues
```bash
# Check PostgreSQL is running
docker compose ps postgres

# Access database
docker compose exec postgres psql -U izzzi -d izzzi
```

### Frontend not loading styles
```bash
# Clear Next.js cache
docker compose exec frontend rm -rf .next
docker compose restart frontend
```

---

## 📝 Version Information

| Component | Version |
|-----------|---------|
| Node.js | 20 (Alpine) |
| PostgreSQL | 16 |
| Redis | 7 |
| Next.js | 15.5.9 |
| NestJS | 11.x |
| Terraform | >= 1.0 |
