#!/bin/bash

# SRAG Health Monitoring System - Deployment Script for Contabo VPS

set -e

echo "🚀 Starting deployment to Contabo VPS..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
VPS_USER="${VPS_USER:-root}"
VPS_HOST="${VPS_HOST:-your-vps-ip}"
VPS_PORT="${VPS_PORT:-22}"
DEPLOY_PATH="${DEPLOY_PATH:-/opt/srag-monitoring}"

echo -e "${YELLOW}📦 Building Docker images...${NC}"
docker-compose build

echo -e "${YELLOW}📤 Copying files to VPS...${NC}"
ssh -p $VPS_PORT $VPS_USER@$VPS_HOST "mkdir -p $DEPLOY_PATH"

rsync -avz --progress \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude '.next' \
  --exclude 'dist' \
  -e "ssh -p $VPS_PORT" \
  ./ $VPS_USER@$VPS_HOST:$DEPLOY_PATH/

echo -e "${YELLOW}🔧 Setting up environment on VPS...${NC}"
ssh -p $VPS_PORT $VPS_USER@$VPS_HOST << 'ENDSSH'
cd /opt/srag-monitoring

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    systemctl start docker
    systemctl enable docker
fi

# Install Docker Compose if not present
if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# Load environment variables
if [ -f .env.production ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
fi

# Stop existing containers
docker-compose down

# Start services
docker-compose up -d

# Wait for services to be healthy
echo "Waiting for services to start..."
sleep 10

# Check if services are running
docker-compose ps

echo "✅ Deployment completed!"
ENDSSH

echo -e "${GREEN}✨ Deployment successful!${NC}"
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "1. Update DNS records to point to your VPS IP"
echo "2. Configure SSL certificates (see docs/SSL_SETUP.md)"
echo "3. Update .env.production with your domain"
echo "4. Run database migrations: ssh $VPS_USER@$VPS_HOST 'cd $DEPLOY_PATH && docker-compose exec backend npx prisma migrate deploy'"
