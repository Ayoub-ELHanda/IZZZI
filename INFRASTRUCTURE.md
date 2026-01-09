# IZZZI Infrastructure - Guide Complet

## Vue d'ensemble

Ce guide explique **étape par étape** comment l'infrastructure IZZZI fonctionne, du provisionnement du serveur jusqu'au déploiement de l'application.

---

## PARTIE 1 : Terraform (Provisionnement DigitalOcean)

Terraform crée automatiquement toute l'infrastructure cloud sur DigitalOcean.

### Structure des fichiers

```
infrastructure/
├── main.tf                    # Orchestration des modules
├── variables.tf               # Variables d'entrée
├── outputs.tf                 # Valeurs de sortie
├── providers.tf               # Configuration du provider DigitalOcean
├── versions.tf                # Versions requises
├── terraform.tfvars.example   # Exemple de configuration
├── deploy.sh                  # Script de déploiement Docker
├── deploy-env-template.sh     # Template pour les variables d'environnement
└── modules/
    ├── networking/            # VPC
    ├── droplet/               # Serveur
    ├── firewall/              # Règles de sécurité
    ├── dns/                   # DNS (optionnel)
    └── spaces/                # Stockage S3 (optionnel)
```

---

### Étape 1 : Configuration (`terraform.tfvars`)

Créez `terraform.tfvars` à partir de l'exemple :

```hcl
do_token = "dop_v1_VOTRE_TOKEN_DIGITALOCEAN"

project_name = "izzzi"
environment  = "production"
region       = "fra1"

droplet_size  = "s-2vcpu-4gb"
droplet_image = "ubuntu-24-04-x64"

ssh_public_key = "ssh-rsa AAAAB3... votre-cle-publique"
ssh_key_name   = "izzzi-deploy-key"

enable_monitoring = true
enable_backups    = false

allowed_ssh_ips = ["VOTRE_IP/32"]

# domain_name = "izzzi.io"  # Optionnel
# create_spaces = false     # Optionnel
```

| Variable | Description |
|----------|-------------|
| `do_token` | Token API DigitalOcean (obligatoire) |
| `project_name` | Nom du projet pour nommer les ressources |
| `environment` | `production`, `staging`, ou `dev` |
| `region` | Datacenter (`fra1` = Frankfurt, `ams3` = Amsterdam) |
| `droplet_size` | Taille du serveur (CPU/RAM) |
| `ssh_public_key` | Clé SSH pour accéder au serveur |
| `allowed_ssh_ips` | IPs autorisées pour SSH |

---

### Étape 2 : Module Networking (VPC)

**Fichier :** `modules/networking/main.tf`

**Ce qu'il fait :**
- Crée un réseau privé virtuel (VPC)
- Isole les ressources du reste d'internet
- Permet la communication interne sécurisée

```
┌─────────────────────────────────────┐
│      VPC: izzzi-production-vpc      │
│         CIDR: 10.0.0.0/16           │
│                                     │
│  ┌─────────────────────────────┐    │
│  │   Droplet (10.0.x.x)        │    │
│  │   - PostgreSQL              │    │
│  │   - Redis                   │    │
│  │   - Frontend                │    │
│  │   - Backend                 │    │
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

---

### Étape 3 : Module Droplet (Serveur)

**Fichier :** `modules/droplet/main.tf`

**Ce qu'il fait :**
1. Vérifie si la clé SSH existe déjà
2. Crée la clé SSH si nécessaire
3. Provisionne le serveur (droplet)
4. Configure le serveur avec cloud-init

```
Droplet: izzzi-production-app
├── Image: Ubuntu 24.04 LTS
├── Taille: s-2vcpu-4gb (2 vCPU, 4GB RAM)
├── Région: fra1 (Frankfurt)
├── VPC: izzzi-production-vpc
├── SSH Key: izzzi-deploy-key
└── Monitoring: Activé
```

**Cloud-init** installe automatiquement :
- Docker & Docker Compose
- Utilisateur `deploy`
- Configuration SSH sécurisée

---

### Étape 4 : Module Firewall (Sécurité)

**Fichier :** `modules/firewall/main.tf`

**Ce qu'il fait :**
Crée **3 firewalls** distincts pour la sécurité :

#### Firewall 1 : Web (trafic public)
```
ENTRANT:
  ✅ Port 80  (HTTP)  ← Tout internet
  ✅ Port 443 (HTTPS) ← Tout internet

SORTANT:
  ✅ Tout le trafic TCP/UDP/ICMP → Internet
```

#### Firewall 2 : Internal (communication VPC)
```
ENTRANT (uniquement depuis le VPC 10.0.0.0/16):
  ✅ Port 5432 (PostgreSQL)
  ✅ Port 6379 (Redis)
  ✅ Port 3000 (Frontend)
  ✅ Port 4000 (Backend)

SORTANT:
  ✅ Tout le trafic → VPC
```

#### Firewall 3 : Management (SSH)
```
ENTRANT:
  ✅ Port 22 (SSH) ← IPs autorisées seulement

SORTANT:
  ✅ Tout le trafic → Internet
```

**Schéma de sécurité :**
```
Internet
    │
    ▼
┌──────────────────┐
│  Firewall Web    │  ← Port 80, 443 ouverts
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│     Nginx        │  ← Reverse proxy
│   (Port 80)      │
└────────┬─────────┘
         │
    ┌────┴────┐
    ▼         ▼
Frontend   Backend    ← Accessible uniquement en interne
(:3000)    (:4000)
    │         │
    └────┬────┘
         ▼
   PostgreSQL/Redis   ← Jamais exposés à internet
   (:5432/:6379)
```

---

### Étape 5 : Module DNS (Optionnel)

**Fichier :** `modules/dns/main.tf`

**Ce qu'il fait :**
Crée les enregistrements DNS si vous avez un domaine :

```
izzzi.io        → IP du droplet (A record)
www.izzzi.io    → IP du droplet (A record)
api.izzzi.io    → IP du droplet (A record)
```

---

### Étape 6 : Module Spaces (Optionnel)

**Fichier :** `modules/spaces/main.tf`

**Ce qu'il fait :**
Crée des buckets S3-compatible pour :

| Bucket | Accès | Usage |
|--------|-------|-------|
| `izzzi-production-terraform-state` | Privé | État Terraform |
| `izzzi-production-backups` | Privé | Sauvegardes DB |
| `izzzi-production-assets` | Public | Assets statiques |

---

### Étape 7 : Exécution Terraform

```bash
cd infrastructure

terraform init

terraform plan

terraform apply
```

**Outputs après exécution :**
```
droplet_ip = "167.99.135.132"
droplet_private_ip = "10.0.0.2"
ssh_command = "ssh deploy@167.99.135.132"
vpc_id = "abc123..."
firewall_ids = ["fw-web-123", "fw-internal-456", "fw-mgmt-789"]
```

---

## PARTIE 2 : Docker Compose (Déploiement Application)

Une fois le serveur provisionné, Docker Compose déploie l'application.

### Architecture des services

```
┌─────────────────────────────────────────────────────────────────┐
│                    Docker Compose Stack                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │   Frontend   │───▶│   Backend    │───▶│  PostgreSQL  │       │
│  │   Next.js    │    │   NestJS     │    │    :5432     │       │
│  │    :3000     │    │    :4000     │    └──────────────┘       │
│  └──────────────┘    └──────┬───────┘                           │
│                             │                                    │
│                             ▼                                    │
│                      ┌──────────────┐    ┌──────────────┐       │
│                      │    Redis     │    │   MailHog    │       │
│                      │    :6379     │    │ :8025/:1025  │       │
│                      └──────────────┘    └──────────────┘       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Services

| Service | Port | Description |
|---------|------|-------------|
| **frontend** | 3000 | Application Next.js |
| **backend** | 4000 | API NestJS |
| **postgres** | 5432 | Base de données |
| **redis** | 6379 | Cache et sessions |
| **mailhog** | 8025/1025 | Test emails (dev) |

### Flux de démarrage

```
1. postgres    ─┐
2. redis       ─┼─▶ Démarrent en premier
3. mailhog     ─┘
       │
       ▼
4. backend     ─────▶ Attend postgres et redis
       │               - npm install
       │               - prisma migrate
       │               - prisma generate
       │               - ts-node-dev
       ▼
5. frontend    ─────▶ Attend backend
                      - npm install
                      - next dev
```

---

## PARTIE 3 : Scripts de Déploiement

### Script 1 : `deploy.sh`

Script principal pour déployer l'application :

```bash
#!/bin/bash
./infrastructure/deploy.sh
```

**Ce qu'il fait :**
1. Vérifie qu'on est dans le bon répertoire
2. Crée le dossier `env/` si nécessaire
3. Arrête les containers existants
4. Pull les dernières modifications Git
5. Build et démarre les containers
6. Affiche le statut et les logs

### Script 2 : `deploy-env-template.sh`

Crée le fichier de configuration `.env` :

```bash
./infrastructure/deploy-env-template.sh
```

**Variables créées :**
```env
NODE_ENV=production
DATABASE_URL=postgres://izzzi:izzzi@postgres:5432/izzzi
REDIS_URL=redis://redis:6379
JWT_SECRET=...
STRIPE_SECRET_KEY=...
MAIL_HOST=smtp.gmail.com
NEXT_PUBLIC_API_BASE_URL=http://167.99.135.132/api
```

---

## PARTIE 4 : Nginx (Reverse Proxy)

Nginx route le trafic vers les bons services.

**Configuration :** `/etc/nginx/sites-available/izzzi`

```
Internet (Port 80)
        │
        ▼
┌───────────────────┐
│      Nginx        │
│                   │
│  /api/*  ────────▶ Backend (:4000)
│  /*      ────────▶ Frontend (:3000)
│                   │
└───────────────────┘
```

---

## PARTIE 5 : Guide de Déploiement Complet

### Prérequis

1. Compte DigitalOcean avec token API
2. Terraform installé localement
3. Clé SSH générée

### Étapes

**1. Provisionner l'infrastructure :**
```bash
cd infrastructure
cp terraform.tfvars.example terraform.tfvars
# Éditer terraform.tfvars avec vos valeurs
terraform init
terraform apply
```

**2. Se connecter au serveur :**
```bash
ssh deploy@167.99.135.132
```

**3. Cloner le repository :**
```bash
git clone https://github.com/Ayoub-ELHanda/IZZZI.git
cd izzzi
```

**4. Configurer les variables d'environnement :**
```bash
./infrastructure/deploy-env-template.sh
nano env/.env  # Modifier les clés API
```

**5. Déployer l'application :**
```bash
./infrastructure/deploy.sh
```

**6. Vérifier le statut :**
```bash
docker compose ps
docker compose logs -f
```

---

## Commandes Utiles

| Action | Commande |
|--------|----------|
| Voir les containers | `docker compose ps` |
| Voir les logs | `docker compose logs -f` |
| Logs d'un service | `docker compose logs -f backend` |
| Redémarrer tout | `docker compose restart` |
| Arrêter tout | `docker compose down` |
| Rebuild complet | `docker compose down && docker compose up -d --build` |
| Accéder à la DB | `docker compose exec postgres psql -U izzzi -d izzzi` |

---

## URLs d'accès

| Service | URL |
|---------|-----|
| Frontend | http://167.99.135.132 |
| Backend API | http://167.99.135.132/api |
| API Docs | http://167.99.135.132/api/docs |
| MailHog UI | http://167.99.135.132:8025 |

---

## Résumé Visuel

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FLUX DE DÉPLOIEMENT                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   1. TERRAFORM                    2. SSH                                 │
│   ┌─────────────┐                ┌─────────────┐                        │
│   │  terraform  │  ──────────▶   │   Serveur   │                        │
│   │   apply     │   Crée         │ DigitalOcean│                        │
│   └─────────────┘                └──────┬──────┘                        │
│                                         │                                │
│   3. GIT CLONE                          ▼                                │
│   ┌─────────────┐                ┌─────────────┐                        │
│   │  git clone  │  ──────────▶   │    Code     │                        │
│   │   izzzi     │                │   /izzzi    │                        │
│   └─────────────┘                └──────┬──────┘                        │
│                                         │                                │
│   4. DEPLOY                             ▼                                │
│   ┌─────────────┐                ┌─────────────────────────────────┐    │
│   │  deploy.sh  │  ──────────▶   │         Docker Compose          │    │
│   └─────────────┘                │  ┌────────┐ ┌────────┐          │    │
│                                  │  │Frontend│ │Backend │          │    │
│                                  │  └────────┘ └────────┘          │    │
│                                  │  ┌────────┐ ┌────────┐ ┌──────┐ │    │
│                                  │  │Postgres│ │ Redis  │ │Nginx │ │    │
│                                  │  └────────┘ └────────┘ └──────┘ │    │
│                                  └─────────────────────────────────┘    │
│                                                                          │
│   5. ACCÈS                                                               │
│   ┌─────────────────────────────────────────────────────────┐           │
│   │  http://167.99.135.132        → Frontend                │           │
│   │  http://167.99.135.132/api    → Backend API             │           │
│   └─────────────────────────────────────────────────────────┘           │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## PARTIE 6 : Docker Swarm (Orchestration Avancée)

Docker Swarm permet de scaler l'application et d'avoir de la haute disponibilité.

### Pourquoi Docker Swarm ?

| Fonctionnalité | Docker Compose | Docker Swarm |
|----------------|----------------|--------------|
| Scaling | Manuel | Automatique |
| Load balancing | Non | Intégré |
| Haute disponibilité | Non | Oui |
| Rolling updates | Non | Oui |
| Multi-serveurs | Non | Oui |
| Self-healing | Non | Oui |

### Architecture Swarm

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Docker Swarm Cluster                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │                        Manager Node                             │     │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │     │
│  │  │  Nginx   │  │ Postgres │  │Visualizer│  │  Redis   │        │     │
│  │  │ (1 task) │  │ (1 task) │  │ (1 task) │  │ (1 task) │        │     │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │     │
│  └────────────────────────────────────────────────────────────────┘     │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │                    Services Répliqués                           │     │
│  │                                                                 │     │
│  │  Frontend (2 replicas)          Backend (2 replicas)            │     │
│  │  ┌──────────┐ ┌──────────┐     ┌──────────┐ ┌──────────┐       │     │
│  │  │frontend.1│ │frontend.2│     │backend.1 │ │backend.2 │       │     │
│  │  └──────────┘ └──────────┘     └──────────┘ └──────────┘       │     │
│  │                                                                 │     │
│  └────────────────────────────────────────────────────────────────┘     │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │                     Overlay Network                             │     │
│  │              izzzi-network (tous les services)                  │     │
│  └────────────────────────────────────────────────────────────────┘     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Fichiers créés

```
izzzi/
├── docker-stack.yml           # Configuration Swarm
├── nginx/
│   ├── nginx.conf             # Config Nginx pour Swarm
│   └── ssl/                   # Certificats SSL
└── infrastructure/
    └── deploy-swarm.sh        # Script de déploiement Swarm
```

### Configuration des services (`docker-stack.yml`)

| Service | Replicas | Ressources | Healthcheck |
|---------|----------|------------|-------------|
| **postgres** | 1 | - | - |
| **redis** | 1 | - | - |
| **backend** | 2 | 512MB RAM, 0.5 CPU | `/api/health` |
| **frontend** | 2 | 512MB RAM, 0.5 CPU | Port 3000 |
| **nginx** | 1 | - | - |
| **visualizer** | 1 | - | - |

### Déploiement Swarm

**1. Initialiser Swarm :**
```bash
./infrastructure/deploy-swarm.sh init
```

**2. Build les images :**
```bash
./infrastructure/deploy-swarm.sh build
```

**3. Déployer le stack :**
```bash
./infrastructure/deploy-swarm.sh deploy
```

Ou tout en une commande :
```bash
./infrastructure/deploy-swarm.sh deploy
```

### Commandes Swarm

| Action | Commande |
|--------|----------|
| Voir les services | `docker stack services izzzi` |
| Voir les tâches | `docker stack ps izzzi` |
| Logs d'un service | `./infrastructure/deploy-swarm.sh logs backend` |
| Scaler un service | `./infrastructure/deploy-swarm.sh scale frontend 3` |
| Supprimer le stack | `./infrastructure/deploy-swarm.sh remove` |
| Quitter Swarm | `docker swarm leave --force` |

### Scaling

```bash
# Scaler le frontend à 3 instances
./infrastructure/deploy-swarm.sh scale frontend 3

# Scaler le backend à 4 instances
./infrastructure/deploy-swarm.sh scale backend 4
```

```
Avant:                          Après scale frontend 3:
┌──────────┐ ┌──────────┐       ┌──────────┐ ┌──────────┐ ┌──────────┐
│frontend.1│ │frontend.2│  ───▶ │frontend.1│ │frontend.2│ │frontend.3│
└──────────┘ └──────────┘       └──────────┘ └──────────┘ └──────────┘
```

### Rolling Updates

Swarm met à jour les services sans downtime :

```
1. Nouveau container créé
2. Health check OK
3. Trafic redirigé
4. Ancien container arrêté
5. Répéter pour chaque replica
```

Configuration dans `docker-stack.yml` :
```yaml
deploy:
  update_config:
    parallelism: 1        # 1 container à la fois
    delay: 10s            # 10s entre chaque update
    failure_action: rollback
    order: start-first    # Nouveau avant d'arrêter l'ancien
```

### Visualizer

Accédez à http://167.99.135.132:8080 pour voir graphiquement :
- Les nodes du cluster
- Les services et leurs replicas
- L'état des tâches

### URLs d'accès (Swarm)

| Service | URL |
|---------|-----|
| Frontend | http://167.99.135.132 |
| Backend API | http://167.99.135.132/api |
| API Docs | http://167.99.135.132/api/docs |
| Visualizer | http://167.99.135.132:8080 |

### Comparaison Compose vs Swarm

```
Docker Compose                    Docker Swarm
──────────────                    ────────────
docker compose up                 docker stack deploy
docker compose down               docker stack rm
docker compose ps                 docker stack services
docker compose logs               docker service logs
(pas de scaling)                  docker service scale
(pas de HA)                       Self-healing automatique
```

### Quand utiliser quoi ?

| Situation | Recommandation |
|-----------|---------------|
| Développement local | Docker Compose |
| Production simple (1 serveur) | Docker Compose ou Swarm |
| Production avec HA | Docker Swarm |
| Multi-serveurs | Docker Swarm |
| Grande échelle | Kubernetes |
