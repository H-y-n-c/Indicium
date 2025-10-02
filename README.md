# Sistema de Monitoramento de Saúde - SRAG

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-18.x-green.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.x-blue.svg)

Sistema full-stack para monitoramento e visualização de dados de SRAG (Síndrome Respiratória Aguda Grave), desenvolvido para a Indicium HealthCare Inc.

## 🚀 Tecnologias Utilizadas

### Frontend
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Type safety
- **shadcn/ui** - Componentes UI acessíveis e customizáveis
- **Tailwind CSS** - Estilização utility-first
- **Recharts** - Biblioteca de gráficos
- **SWR** - Data fetching e caching

### Backend
- **NestJS** - Framework Node.js progressivo
- **TypeScript** - Type safety
- **Prisma** - ORM moderno
- **PostgreSQL** - Banco de dados relacional
- **class-validator** - Validação de dados

### Infraestrutura
- **Docker & Docker Compose** - Containerização
- **Nginx** - Reverse proxy e load balancer
- **Contabo VPS (Ubuntu 21)** - Servidor de produção

## 📊 Funcionalidades

### Dashboard de Métricas
- ✅ Taxa de aumento de casos de SRAG
- ✅ Taxa de mortalidade por SRAG
- ✅ Taxa de ocupação de UTI
- ✅ Taxa de vacinação da população

### Visualização Gráfica
- ✅ Gráfico de evolução de casos
- ✅ Filtros por período (diário, mensal, anual)
- ✅ Filtros por região (estado, município)
- ✅ Agrupamento configurável

### Design Responsivo
- ✅ Mobile-first approach
- ✅ Breakpoints: mobile, tablet, desktop
- ✅ Componentes adaptativos

## 🛠️ Instalação Local

### Pré-requisitos
- Node.js 18.x ou superior
- PostgreSQL 15.x
- npm ou yarn

### 1. Clone o repositório
\`\`\`bash
git clone https://github.com/H-y-n-c/Indicium.git
\`\`\`

### 2. Instale as dependências
\`\`\`bash
# Instalar dependências do monorepo
npm install

# Instalar dependências do frontend
cd frontend && npm install

# Instalar dependências do backend
cd ../backend && npm install
\`\`\`

### 3. Configure o banco de dados

#### Opção A: PostgreSQL Local
\`\`\`bash
# Crie o banco de dados
createdb srag_monitoring

# Configure o .env no backend
cd backend
cp .env.example .env
# Edite .env com suas credenciais do PostgreSQL
\`\`\`

#### Opção B: Supabase
\`\`\`bash
# 1. Crie um projeto no Supabase (https://supabase.com)
# 2. Copie a connection string
# 3. Configure no .env do backend
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres"
\`\`\`

### 4. Execute as migrações
\`\`\`bash
cd backend
npx prisma migrate dev
npx prisma generate
\`\`\`

### 5. Popule o banco com dados
\`\`\`bash
npm run seed
\`\`\`

### 6. Inicie os servidores

#### Terminal 1 - Backend
\`\`\`bash
cd backend
npm run start:dev
\`\`\`

#### Terminal 2 - Frontend
\`\`\`bash
cd frontend
npm run dev
\`\`\`

A aplicação estará disponível em:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- API Docs: http://localhost:3001/api

## 🐋 Instalação com Docker

### Desenvolvimento
\`\`\`bash
docker-compose up -d
\`\`\`

### Produção
\`\`\`bash
docker-compose -f docker-compose.yml up -d
\`\`\`

## 🚢 Deploy no Contabo VPS

### 1. Setup Inicial do VPS
\`\`\`bash
# Conecte ao VPS
ssh root@your-vps-ip

# Execute o script de setup
bash setup-vps.sh
\`\`\`

### 2. Deploy da Aplicação
\`\`\`bash
# No seu computador local
export VPS_HOST=your-vps-ip
export VPS_USER=root
bash deploy.sh
\`\`\`

### 3. Configure SSL (Let's Encrypt)
\`\`\`bash
# No VPS
certbot --nginx -d your-domain.com
\`\`\`

### 4. Configurar DNS
Aponte seu domínio para o IP do VPS:
\`\`\`
A    @    your-vps-ip
A    www  your-vps-ip
\`\`\`

## 📁 Estrutura do Projeto

\`\`\`
srag-monitoring/
├── frontend/              # Aplicação Next.js
│   ├── src/
│   │   ├── app/          # App Router pages
│   │   ├── components/   # Componentes React
│   │   │   ├── ui/       # shadcn/ui components
│   │   │   ├── MetricCard.tsx
│   │   │   ├── CasesChart.tsx
│   │   │   └── FilterPanel.tsx
│   │   └── lib/          # Utilities
│   ├── public/           # Assets estáticos
│   └── Dockerfile
├── backend/              # API NestJS
│   ├── src/
│   │   ├── modules/      # Módulos NestJS
│   │   │   ├── prisma/
│   │   │   └── srag/
│   │   └── scripts/      # Scripts utilitários
│   ├── prisma/           # Schema e migrations
│   └── Dockerfile
├── nginx/                # Configuração Nginx
├── docker-compose.yml    # Orquestração Docker
├── deploy.sh            # Script de deploy
└── README.md
\`\`\`

## 🎨 Arquitetura e Design

### Frontend Architecture
- **App Router (Next.js 14)**: Roteamento moderno com Server Components
- **Component-based**: Componentes reutilizáveis e modulares
- **Custom Hooks**: Lógica compartilhada via hooks
- **API Layer**: Abstração da comunicação com backend

### Backend Architecture
- **Modular Design**: Módulos NestJS independentes
- **Repository Pattern**: Camada de abstração do banco
- **DTO Validation**: Validação de entrada com class-validator
- **Service Layer**: Lógica de negócio isolada

### Responsividade
- **Mobile-first**: Design prioritário para mobile
- **Breakpoints**:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- **Grid System**: CSS Grid e Flexbox
- **Fluid Typography**: Tipografia escalável

## 🔌 API Endpoints

### Métricas
\`\`\`http
GET /api/metrics?period=monthly&estado=SP
\`\`\`

### Casos
\`\`\`http
GET /api/cases?groupBy=monthly&estado=RJ&municipio=Rio%20de%20Janeiro
\`\`\`

### Regiões
\`\`\`http
GET /api/regions
\`\`\`

### Health Check
\`\`\`http
GET /api/health
\`\`\`

## 🧪 Testes

\`\`\`bash
# Backend
cd backend
npm run test

# Frontend
cd frontend
npm run test
\`\`\`

## 📈 Dados

Os dados utilizados são provenientes do [OpenDataSUS](https://opendatasus.saude.gov.br/dataset/srag-2021-a-2024).

### ETL Process
1. Download de CSV do OpenDataSUS
2. Parsing e transformação
3. Validação de dados
4. Importação para PostgreSQL
5. Cálculo de métricas agregadas

## 🔒 Segurança

- ✅ Validação de entrada (DTOs)
- ✅ CORS configurado
- ✅ Rate limiting (Nginx)
- ✅ Headers de segurança
- ✅ SSL/TLS (Let's Encrypt)
- ✅ Fail2ban (proteção SSH)
- ✅ Firewall (UFW)

## 🚀 Performance

- ✅ Caching de dados (SWR)
- ✅ Compressão Gzip (Nginx)
- ✅ Database indexes
- ✅ Connection pooling
- ✅ Lazy loading de componentes
- ✅ Image optimization

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Contribuindo

Contribuições são bem-vindas! Por favor, leia o [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes.

## 📧 Contato

Desenvolvido para **Indicium HealthCare Inc.** Por Paolo Barcellos. Email = step.data.step@gmail.com. 

---

**🧐 Created by: Paolo Barcellos. Email: step.data.step@gmail.com**
