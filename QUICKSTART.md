# 🚀 Quick Start Guide

Get the SRAG Monitoring System up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Docker & Docker Compose installed
- PostgreSQL 15+ (or use Docker)

## Option 1: Docker (Recommended) ⚡

### 1. Clone and Setup
\`\`\`bash
git clone https://github.com/seu-usuario/srag-monitoring.git
cd srag-monitoring
\`\`\`

### 2. Configure Environment
\`\`\`bash
# Copy and edit environment file
cp .env.production .env
nano .env

# Update these values:
# POSTGRES_PASSWORD=your_secure_password
# NEXT_PUBLIC_API_URL=http://localhost:3001
\`\`\`

### 3. Start Everything
\`\`\`bash
docker-compose up -d
\`\`\`

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Health: http://localhost:3001/api/health

**That's it! 🎉**

---

## Option 2: Local Development 💻

### 1. Clone Repository
\`\`\`bash
git clone https://github.com/seu-usuario/srag-monitoring.git
cd srag-monitoring
\`\`\`

### 2. Install Dependencies
\`\`\`bash
# Root
npm install

# Frontend
cd frontend && npm install

# Backend
cd ../backend && npm install
\`\`\`

### 3. Setup Database

#### Option A: Local PostgreSQL
\`\`\`bash
# Create database
createdb srag_monitoring

# Configure backend/.env
DATABASE_URL="postgresql://user:password@localhost:5432/srag_monitoring"
\`\`\`

#### Option B: Supabase (Free)
\`\`\`bash
# 1. Create account at https://supabase.com
# 2. Create new project
# 3. Get connection string from Settings > Database
# 4. Update backend/.env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
\`\`\`

### 4. Run Migrations
\`\`\`bash
cd backend
npx prisma migrate dev
npx prisma generate
\`\`\`

### 5. Seed Database
\`\`\`bash
npm run seed
\`\`\`

### 6. Start Services

**Terminal 1 - Backend:**
\`\`\`bash
cd backend
npm run start:dev
\`\`\`

**Terminal 2 - Frontend:**
\`\`\`bash
cd frontend
npm run dev
\`\`\`

### 7. Access Application
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

---

## Option 3: Contabo VPS Deployment 🌐

### 1. Prepare VPS
\`\`\`bash
# SSH into your VPS
ssh root@your-vps-ip

# Run setup script
curl -fsSL https://raw.githubusercontent.com/seu-usuario/srag-monitoring/main/setup-vps.sh | bash
\`\`\`

### 2. Deploy Application
\`\`\`bash
# On your local machine
export VPS_HOST=your-vps-ip
export VPS_USER=root
./deploy.sh
\`\`\`

### 3. Configure SSL
\`\`\`bash
# On VPS
certbot --nginx -d your-domain.com
\`\`\`

### 4. Access Application
- https://your-domain.com

---

## Verify Installation ✅

### Check Services
\`\`\`bash
# Docker
docker-compose ps

# Local
curl http://localhost:3001/api/health
\`\`\`

### Check Logs
\`\`\`bash
# Docker
docker-compose logs -f

# Local
# Check terminal outputs
\`\`\`

### Test API
\`\`\`bash
# Get metrics
curl http://localhost:3001/api/metrics

# Get cases
curl http://localhost:3001/api/cases

# Get regions
curl http://localhost:3001/api/regions
\`\`\`

---

## Common Issues 🔧

### Port Already in Use
\`\`\`bash
# Find process using port
lsof -i :3000  # or :3001

# Kill process
kill -9 <PID>
\`\`\`

### Database Connection Error
\`\`\`bash
# Check PostgreSQL is running
docker-compose ps postgres

# Check connection string in .env
cat backend/.env | grep DATABASE_URL
\`\`\`

### Frontend Can't Connect to Backend
\`\`\`bash
# Check NEXT_PUBLIC_API_URL in frontend/.env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > frontend/.env.local

# Restart frontend
\`\`\`

### Docker Build Fails
\`\`\`bash
# Clean Docker
docker system prune -a

# Rebuild
docker-compose up -d --build
\`\`\`

---

## Next Steps 📚

1. **Explore the Dashboard** - View metrics and charts
2. **Read Documentation** - Check README.md and ARCHITECTURE.md
3. **Customize** - Modify components and add features
4. **Deploy** - Follow DEPLOYMENT.md for production

---

## Need Help? 💬

- 📖 [Full Documentation](README.md)
- 🏗️ [Architecture Guide](ARCHITECTURE.md)
- 🚀 [Deployment Guide](DEPLOYMENT.md)
- 🤝 [Contributing Guide](CONTRIBUTING.md)

---

**Happy Coding! 🎉**

**🧐 Created by: Paolo Barcellos. Email: step.data.step@gmail.com**
