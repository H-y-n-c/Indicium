#!/bin/bash

# SRAG Monitoring System - Setup Verification Script
# This script verifies that the project is correctly set up

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔍 Verifying SRAG Monitoring System Setup..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo -e "${RED}❌ Error: Not in the correct project directory${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Project directory structure"

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version must be 18 or higher (current: $(node -v))${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} Node.js version: $(node -v)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} npm version: $(npm -v)"

# Check Docker
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓${NC} Docker installed: $(docker --version)"
else
    echo -e "${YELLOW}⚠${NC} Docker not installed (optional for local dev)"
fi

# Check Docker Compose
if command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}✓${NC} Docker Compose installed: $(docker-compose --version)"
else
    echo -e "${YELLOW}⚠${NC} Docker Compose not installed (optional for local dev)"
fi

# Check frontend files
echo ""
echo "📦 Checking Frontend..."
FRONTEND_FILES=(
    "frontend/package.json"
    "frontend/tsconfig.json"
    "frontend/next.config.js"
    "frontend/tailwind.config.ts"
    "frontend/src/app/page.tsx"
    "frontend/src/components/MetricCard.tsx"
    "frontend/src/components/CasesChart.tsx"
    "frontend/src/lib/api.ts"
)

for file in "${FRONTEND_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}❌${NC} $file missing"
        exit 1
    fi
done

# Check backend files
echo ""
echo "📦 Checking Backend..."
BACKEND_FILES=(
    "backend/package.json"
    "backend/tsconfig.json"
    "backend/nest-cli.json"
    "backend/prisma/schema.prisma"
    "backend/src/main.ts"
    "backend/src/app.module.ts"
    "backend/src/modules/srag/srag.controller.ts"
    "backend/src/modules/srag/srag.service.ts"
)

for file in "${BACKEND_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}❌${NC} $file missing"
        exit 1
    fi
done

# Check Docker files
echo ""
echo "🐋 Checking Docker Configuration..."
DOCKER_FILES=(
    "docker-compose.yml"
    "frontend/Dockerfile"
    "backend/Dockerfile"
    "nginx/nginx.conf"
)

for file in "${DOCKER_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}❌${NC} $file missing"
        exit 1
    fi
done

# Check documentation
echo ""
echo "📚 Checking Documentation..."
DOC_FILES=(
    "README.md"
    "QUICKSTART.md"
    "DEPLOYMENT.md"
    "ARCHITECTURE.md"
    "PROJECT_SUMMARY.md"
)

for file in "${DOC_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}❌${NC} $file missing"
        exit 1
    fi
done

# Check environment files
echo ""
echo "🔐 Checking Environment Configuration..."
if [ -f "backend/.env.example" ]; then
    echo -e "${GREEN}✓${NC} backend/.env.example"
else
    echo -e "${RED}❌${NC} backend/.env.example missing"
fi

if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✓${NC} backend/.env (configured)"
else
    echo -e "${YELLOW}⚠${NC} backend/.env not found (copy from .env.example)"
fi

if [ -f ".env.production" ]; then
    echo -e "${GREEN}✓${NC} .env.production"
else
    echo -e "${YELLOW}⚠${NC} .env.production not found"
fi

# Final summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Setup verification complete!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Configure environment variables:"
echo "   - Copy backend/.env.example to backend/.env"
echo "   - Update DATABASE_URL in backend/.env"
echo ""
echo "2. Install dependencies:"
echo "   ${YELLOW}npm install${NC}"
echo "   ${YELLOW}cd frontend && npm install${NC}"
echo "   ${YELLOW}cd backend && npm install${NC}"
echo ""
echo "3. Setup database:"
echo "   ${YELLOW}cd backend${NC}"
echo "   ${YELLOW}npx prisma migrate dev${NC}"
echo "   ${YELLOW}npx prisma generate${NC}"
echo "   ${YELLOW}npm run seed${NC}"
echo ""
echo "4. Start development:"
echo "   ${YELLOW}# Terminal 1:${NC}"
echo "   ${YELLOW}cd backend && npm run start:dev${NC}"
echo ""
echo "   ${YELLOW}# Terminal 2:${NC}"
echo "   ${YELLOW}cd frontend && npm run dev${NC}"
echo ""
echo "   Or use Docker:"
echo "   ${YELLOW}docker-compose up -d${NC}"
echo ""
echo "📖 Read QUICKSTART.md for detailed instructions"
echo ""
