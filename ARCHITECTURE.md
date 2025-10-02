# Arquitetura do Sistema

## Visão Geral

O Sistema de Monitoramento SRAG é uma aplicação full-stack construída com arquitetura de microserviços containerizada, seguindo as melhores práticas de desenvolvimento moderno.

## Diagrama de Arquitetura

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                         CONTABO VPS                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    NGINX (Port 80/443)                  │ │
│  │              Reverse Proxy & Load Balancer              │ │
│  └────────────────────────────────────────────────────────┘ │
│           │                                 │                 │
│           ├─────────────────────────────────┤                │
│           │                                 │                 │
│  ┌────────▼─────────┐              ┌───────▼──────────┐     │
│  │    Frontend      │              │     Backend      │     │
│  │   (Next.js 14)   │◄────────────►│    (NestJS)      │     │
│  │   Port: 3000     │              │   Port: 3001     │     │
│  └──────────────────┘              └──────────────────┘     │
│                                              │                │
│                                              │                │
│                                     ┌────────▼─────────┐     │
│                                     │   PostgreSQL     │     │
│                                     │   Port: 5432     │     │
│                                     └──────────────────┘     │
│                                                               │
└───────────────────────────────────────────────────────────────┘
\`\`\`

## Stack Tecnológico

### Frontend Layer

**Framework:** Next.js 14 (App Router)
- **Justificativa:**
  - Server-side rendering para SEO
  - Roteamento file-based
  - API routes integradas
  - Performance otimizada

**UI Framework:** shadcn/ui + Tailwind CSS
- **Justificativa:**
  - Componentes acessíveis (a11y)
  - Customização completa
  - Type-safe
  - Zero runtime overhead (Tailwind)

**State Management:** React Hooks + SWR
- **Justificativa:**
  - Caching automático
  - Revalidação inteligente
  - Optimistic UI
  - Simples e performático

**Charting:** Recharts
- **Justificativa:**
  - React-native
  - Responsivo
  - Customizável
  - Performance

### Backend Layer

**Framework:** NestJS
- **Justificativa:**
  - Arquitetura modular
  - Dependency Injection
  - TypeScript first-class
  - Testável

**ORM:** Prisma
- **Justificativa:**
  - Type-safe database access
  - Migrations automáticas
  - Excelente DX (Developer Experience)
  - Performance otimizada

**Database:** PostgreSQL
- **Justificativa:**
  - ACID compliance
  - Índices performáticos
  - JSON support
  - Maduro e confiável

### Infrastructure Layer

**Containerização:** Docker + Docker Compose
- **Justificativa:**
  - Ambiente consistente
  - Fácil deploy
  - Isolamento de serviços
  - Escalabilidade

**Reverse Proxy:** Nginx
- **Justificativa:**
  - Performance
  - SSL termination
  - Load balancing
  - Rate limiting

## Padrões de Arquitetura

### 1. Frontend Architecture

#### Component Pattern
\`\`\`
components/
├── ui/                 # Componentes base (shadcn/ui)
│   ├── card.tsx
│   ├── select.tsx
│   └── tabs.tsx
├── MetricCard.tsx      # Componentes de negócio
├── CasesChart.tsx
└── FilterPanel.tsx
\`\`\`

**Princípios:**
- Single Responsibility
- Composição sobre herança
- Props drilling mínimo
- Reutilização máxima

#### Data Fetching Pattern
\`\`\`typescript
// API Layer abstraction
export const api = {
  getMetrics: () => fetch(...),
  getCases: () => fetch(...),
};

// Component usage
const { data, error } = useSWR('/api/metrics', api.getMetrics);
\`\`\`

**Benefícios:**
- Separation of concerns
- Fácil mocking para testes
- Cache centralizado
- Error handling consistente

### 2. Backend Architecture

#### Modular Structure
\`\`\`
modules/
├── prisma/            # Database module
│   ├── prisma.module.ts
│   └── prisma.service.ts
└── srag/              # Business module
    ├── srag.module.ts
    ├── srag.controller.ts
    ├── srag.service.ts
    └── dto/
        └── srag.dto.ts
\`\`\`

**Padrões Aplicados:**
- **Controller Layer:** Roteamento e validação
- **Service Layer:** Lógica de negócio
- **Repository Layer:** Acesso a dados (Prisma)
- **DTO Pattern:** Data Transfer Objects

#### Dependency Injection
\`\`\`typescript
@Injectable()
export class SragService {
  constructor(private prisma: PrismaService) {}
}
\`\`\`

**Benefícios:**
- Testabilidade
- Loose coupling
- Manutenibilidade

### 3. Database Architecture

#### Schema Design
\`\`\`prisma
model SragCase {
  id              String    @id @default(uuid())
  dataNotificacao DateTime
  estado          String
  // ...

  @@index([dataNotificacao])
  @@index([estado])
}
\`\`\`

**Estratégias:**
- Índices em colunas frequentemente consultadas
- Normalização adequada
- UUIDs para IDs
- Timestamps automáticos

#### Query Optimization
- Uso de índices
- Eager/Lazy loading apropriado
- Paginação de resultados
- Agregações no banco

## Responsividade

### Mobile-First Approach

**Breakpoints:**
\`\`\`css
/* Mobile: 0-767px (padrão) */
.grid { grid-template-columns: 1fr; }

/* Tablet: 768px+ */
@media (min-width: 768px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(4, 1fr); }
}
\`\`\`

**Estratégias:**
1. **Fluid Layouts:** Grid e Flexbox
2. **Responsive Typography:** clamp() e rem units
3. **Adaptive Components:** Conditional rendering
4. **Touch-Friendly:** Tamanhos adequados para mobile

### Component Responsiveness

\`\`\`tsx
// Mobile: Stack vertical
// Desktop: Grid horizontal
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <MetricCard />
  <MetricCard />
  <MetricCard />
  <MetricCard />
</div>
\`\`\`

## Segurança

### 1. Input Validation
- **Frontend:** Type checking (TypeScript)
- **Backend:** class-validator DTOs
- **Database:** Prisma type safety

### 2. Authentication & Authorization
- Preparado para JWT
- Role-based access control
- Secure cookie handling

### 3. Network Security
- HTTPS/SSL (Let's Encrypt)
- CORS configurado
- Rate limiting (Nginx)
- Firewall (UFW)

### 4. Infrastructure Security
- Docker container isolation
- Fail2ban (brute force protection)
- Non-root containers
- Secret management (.env)

## Performance

### 1. Frontend Optimizations
- **Code Splitting:** Next.js automático
- **Image Optimization:** next/image
- **Static Generation:** Páginas estáticas quando possível
- **Client-side Caching:** SWR

### 2. Backend Optimizations
- **Database Indexing:** Consultas otimizadas
- **Connection Pooling:** Prisma
- **Response Caching:** Headers HTTP
- **Lazy Loading:** Dados sob demanda

### 3. Network Optimizations
- **Gzip Compression:** Nginx
- **HTTP/2:** Nginx
- **CDN Ready:** Assets estáticos
- **Minimal Payloads:** JSON otimizado

## Escalabilidade

### Horizontal Scaling
\`\`\`yaml
# docker-compose com réplicas
services:
  backend:
    deploy:
      replicas: 3
\`\`\`

### Vertical Scaling
- Ajuste de recursos Docker
- Database tuning (PostgreSQL)
- Cache layer (Redis - futuro)

### Database Scaling
- Read replicas
- Connection pooling
- Query optimization
- Partitioning (quando necessário)

## Observabilidade

### Logging
\`\`\`typescript
// Structured logging
logger.log({
  level: 'info',
  message: 'Request processed',
  metadata: { userId, action }
});
\`\`\`

### Monitoring
- Docker stats
- Health check endpoints
- Error tracking (preparado)
- Performance metrics

### Debugging
- Source maps habilitados
- Detailed error messages (dev)
- Request tracing

## Deployment Strategy

### CI/CD Pipeline (Futuro)
1. **Build:** Docker images
2. **Test:** Unit + Integration
3. **Deploy:** Automated push to VPS
4. **Verify:** Health checks

### Blue-Green Deployment
1. Deploy nova versão
2. Teste em ambiente staging
3. Switch de tráfego
4. Rollback se necessário

### Database Migrations
\`\`\`bash
# Zero-downtime migrations
npx prisma migrate deploy
\`\`\`

## Decisões Técnicas

### Por que Next.js ao invés de React puro?
- SSR/SSG para performance
- File-based routing
- API routes integradas
- Otimizações automáticas

### Por que NestJS ao invés de Express?
- Arquitetura opinativa
- TypeScript nativo
- DI container
- Testabilidade

### Por que PostgreSQL ao invés de MongoDB?
- Dados relacionais (SRAG)
- ACID compliance
- Índices performáticos
- Queries complexas

### Por que Prisma ao invés de TypeORM?
- Melhor DX
- Type safety superior
- Performance
- Migrations modernas

## Futuras Melhorias

1. **Cache Layer:** Redis para métricas
2. **Real-time:** WebSockets para updates
3. **Analytics:** Dashboard administrativo
4. **ML Integration:** Predições de surtos
5. **Multi-tenant:** Suporte a múltiplas organizações
6. **API Versioning:** /v1, /v2
7. **GraphQL:** Alternative to REST
8. **Microservices:** Separação adicional

---

**Conclusão:** Esta arquitetura foi projetada para ser escalável, manutenível e performática, seguindo as melhores práticas da indústria.
