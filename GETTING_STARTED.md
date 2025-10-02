# 🚀 Getting Started - SRAG Health Monitoring System

Welcome! This guide will help you get the SRAG Monitoring System running on your machine.

## 📋 What You'll Need

- **Node.js** 18 or higher ([Download](https://nodejs.org))
- **Git** ([Download](https://git-scm.com))
- **PostgreSQL** 15+ OR **Docker** ([Download](https://docker.com))
- **Code Editor** (VS Code recommended)

## ⚡ Quick Start (3 Steps)

### Step 1: Get the Code
```bash
git clone https://github.com/your-username/srag-monitoring.git
cd srag-monitoring
```

### Step 2: Choose Your Setup

#### Option A: Docker (Easiest) 🐋
```bash
# Start everything with one command
docker-compose up -d

# Wait ~30 seconds, then visit:
# http://localhost:3000
```

#### Option B: Local Development 💻
```bash
# Install dependencies
npm install
cd frontend && npm install
cd ../backend && npm install

# Setup database (see below)
cd backend
cp .env.example .env
# Edit .env with your database URL

# Run migrations
npx prisma migrate dev
npx prisma generate
npm run seed

# Start backend (Terminal 1)
npm run start:dev

# Start frontend (Terminal 2)
cd ../frontend
npm run dev

# Visit: http://localhost:3000
```

### Step 3: Explore! 🎉

**Your dashboard is ready at:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/api/health

---

## 🗄️ Database Setup Options

### Option 1: Docker PostgreSQL (Included)
Already configured in `docker-compose.yml` - nothing to do! ✅

### Option 2: Local PostgreSQL
```bash
# Create database
createdb srag_monitoring

# Update backend/.env
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/srag_monitoring"
```

### Option 3: Supabase (Free Cloud)
```bash
# 1. Create account at https://supabase.com
# 2. Create new project
# 3. Go to Settings > Database
# 4. Copy Connection String
# 5. Update backend/.env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
```

---

## 📂 Project Structure Overview

```
srag-monitoring/
│
├── frontend/           # Next.js App (Port 3000)
│   ├── src/
│   │   ├── app/       # Dashboard page
│   │   ├── components/# UI components
│   │   └── lib/       # API client
│   └── package.json
│
├── backend/           # NestJS API (Port 3001)
│   ├── src/
│   │   ├── modules/   # Business logic
│   │   └── scripts/   # Database seeding
│   ├── prisma/        # Database schema
│   └── package.json
│
├── nginx/             # Reverse proxy config
├── docker-compose.yml # Docker orchestration
└── README.md         # Full documentation
```

---

## 🎯 What's Included

### Dashboard Features
✅ **4 Key Metrics**
- Taxa de Aumento de Casos
- Taxa de Mortalidade
- Taxa de Ocupação UTI
- Taxa de Vacinação

✅ **Interactive Chart**
- Filter by period (daily/monthly/yearly)
- Filter by region (state/city)
- Real-time data updates

✅ **Responsive Design**
- Works on mobile, tablet, desktop
- Touch-friendly controls
- Optimized performance

---

## 🔧 Common Commands

### Development
```bash
# Frontend dev server
cd frontend && npm run dev

# Backend dev server
cd backend && npm run start:dev

# Run both with Docker
docker-compose up -d

# View logs
docker-compose logs -f
```

### Database
```bash
# Run migrations
cd backend && npx prisma migrate dev

# Seed database
npm run seed

# Open Prisma Studio
npx prisma studio
```

### Build
```bash
# Build frontend
cd frontend && npm run build

# Build backend
cd backend && npm run build

# Build Docker images
docker-compose build
```

---

## 🐛 Troubleshooting

### "Port already in use"
```bash
# Find what's using the port
lsof -i :3000  # or :3001

# Kill the process
kill -9 <PID>
```

### "Database connection failed"
```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Check your DATABASE_URL
cat backend/.env | grep DATABASE_URL

# Test connection
cd backend && npx prisma db push
```

### "Module not found"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Frontend can't reach backend
```bash
# Check backend is running
curl http://localhost:3001/api/health

# Update frontend/.env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > frontend/.env.local

# Restart frontend
```

---

## 📚 Next Steps

### 1. Explore the Code
- Read `ARCHITECTURE.md` for design decisions
- Check `frontend/src/app/page.tsx` for dashboard code
- Review `backend/src/modules/srag/` for API logic

### 2. Customize
- Modify components in `frontend/src/components/`
- Add new API endpoints in `backend/src/modules/`
- Update styling in `frontend/src/app/globals.css`

### 3. Deploy
- Read `DEPLOYMENT.md` for production setup
- Configure your Contabo VPS
- Setup SSL certificates
- Deploy with `./deploy.sh`

### 4. Contribute
- Read `CONTRIBUTING.md` for guidelines
- Fork the repository
- Create a feature branch
- Submit a Pull Request

---

## 📖 Documentation

| Document | What's Inside |
|----------|---------------|
| **README.md** | Complete project overview |
| **QUICKSTART.md** | 5-minute setup guide |
| **ARCHITECTURE.md** | Technical architecture details |
| **DEPLOYMENT.md** | Production deployment guide |
| **CONTRIBUTING.md** | How to contribute |
| **PROJECT_SUMMARY.md** | Executive summary |

---

## 🆘 Need Help?

### Documentation
- 📖 Check the `/docs` folder
- 🔍 Search existing GitHub issues
- 📚 Read the inline code comments

### Community
- 💬 GitHub Discussions
- 📧 Email: dev@indicium.tech
- 🐛 Report bugs in GitHub Issues

### Quick Links
- [Full API Documentation](README.md#api-endpoints)
- [Database Schema](backend/prisma/schema.prisma)
- [Component Library](frontend/src/components/)
- [Deployment Guide](DEPLOYMENT.md)

---

## ✅ Verify Your Setup

Run the verification script:
```bash
chmod +x verify-setup.sh
./verify-setup.sh
```

This will check:
- ✓ Node.js version
- ✓ Project structure
- ✓ Required files
- ✓ Docker setup
- ✓ Environment config

---

## 🎉 You're All Set!

Your SRAG Monitoring System is ready to use!

**What to do next:**
1. ✅ Explore the dashboard at http://localhost:3000
2. ✅ Test the API at http://localhost:3001/api
3. ✅ Read the architecture docs
4. ✅ Start building!

---

**Happy coding! 🚀**

**🧐 Created by: Paolo Barcellos. Email: step.data.step@gmail.com**
