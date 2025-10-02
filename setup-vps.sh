#!/bin/bash

# Initial VPS Setup Script for Contabo VPS (Ubuntu 20.04/22.04)

set -e

echo "🔧 Setting up Contabo VPS for SRAG Monitoring System..."

# Update system
echo "📦 Updating system packages..."
apt-get update
apt-get upgrade -y

# Install essential packages
echo "📦 Installing essential packages..."
apt-get install -y \
    curl \
    wget \
    git \
    vim \
    htop \
    ufw \
    fail2ban \
    certbot \
    python3-certbot-nginx

# Install Docker
echo "🐋 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
systemctl start docker
systemctl enable docker

# Install Docker Compose
echo "🐋 Installing Docker Compose..."
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Configure firewall
echo "🔥 Configuring firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Configure fail2ban
echo "🛡️ Configuring fail2ban..."
systemctl start fail2ban
systemctl enable fail2ban

# Create deployment directory
echo "📁 Creating deployment directory..."
mkdir -p /opt/srag-monitoring
chown -R $USER:$USER /opt/srag-monitoring

# Setup swap (if not exists)
if [ ! -f /swapfile ]; then
    echo "💾 Setting up swap..."
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' | tee -a /etc/fstab
fi

echo "✅ VPS setup completed!"
echo ""
echo "📝 Next steps:"
echo "1. Clone your repository to /opt/srag-monitoring"
echo "2. Copy .env.production and update with your settings"
echo "3. Run: cd /opt/srag-monitoring && docker-compose up -d"
echo "4. Setup SSL: certbot --nginx -d your-domain.com"
