# Guia de Contribuição

Obrigado por considerar contribuir com o Sistema de Monitoramento SRAG!

## 🚀 Como Contribuir

### 1. Fork o Projeto
\`\`\`bash
# Clone seu fork
git clone https://github.com/seu-usuario/srag-monitoring.git
cd srag-monitoring

# Adicione o repositório original como upstream
git remote add upstream https://github.com/original/srag-monitoring.git
\`\`\`

### 2. Crie uma Branch
\`\`\`bash
# Atualize seu fork
git checkout main
git pull upstream main

# Crie uma branch para sua feature
git checkout -b feature/nome-da-feature
\`\`\`

### 3. Faça suas Alterações

#### Code Style
- Use **TypeScript** em todo o código
- Siga o **ESLint** configurado
- Use **Prettier** para formatação
- Escreva código **limpo e legível**

#### Commits
Siga o padrão [Conventional Commits](https://www.conventionalcommits.org/):

\`\`\`bash
feat: adiciona filtro por município
fix: corrige cálculo de taxa de mortalidade
docs: atualiza README com novas instruções
style: formata código do dashboard
refactor: reorganiza estrutura de componentes
test: adiciona testes para API de métricas
chore: atualiza dependências
\`\`\`

### 4. Teste suas Alterações

#### Frontend
\`\`\`bash
cd frontend
npm run lint
npm run build
npm run test
\`\`\`

#### Backend
\`\`\`bash
cd backend
npm run lint
npm run build
npm run test
\`\`\`

### 5. Envie seu Pull Request

\`\`\`bash
# Commit suas mudanças
git add .
git commit -m "feat: adiciona nova funcionalidade"

# Push para seu fork
git push origin feature/nome-da-feature
\`\`\`

Então abra um Pull Request no GitHub.

## 📋 Checklist do Pull Request

- [ ] Código segue o style guide do projeto
- [ ] Comentários foram adicionados em código complexo
- [ ] Documentação foi atualizada (se necessário)
- [ ] Testes foram adicionados/atualizados
- [ ] Todos os testes passam
- [ ] Build está funcionando
- [ ] Commits seguem o Conventional Commits

## 🐛 Reportando Bugs

### Antes de Reportar
- Verifique se o bug já foi reportado
- Certifique-se de estar usando a versão mais recente
- Colete informações relevantes

### Template de Bug Report
\`\`\`markdown
**Descrição do Bug**
Uma descrição clara do que é o bug.

**Como Reproduzir**
1. Vá para '...'
2. Clique em '...'
3. Role até '...'
4. Veja o erro

**Comportamento Esperado**
O que você esperava que acontecesse.

**Screenshots**
Se aplicável, adicione screenshots.

**Ambiente:**
 - OS: [e.g. Ubuntu 20.04]
 - Browser: [e.g. Chrome 90]
 - Versão: [e.g. 1.0.0]
\`\`\`

## 💡 Sugerindo Features

### Template de Feature Request
\`\`\`markdown
**Sua feature resolve um problema? Descreva.**
Uma descrição clara do problema.

**Descreva a solução que você gostaria**
Uma descrição clara do que você quer que aconteça.

**Descreva alternativas que você considerou**
Uma descrição de soluções alternativas.

**Contexto adicional**
Qualquer outro contexto ou screenshots.
\`\`\`

## 🏗️ Estrutura do Projeto

\`\`\`
srag-monitoring/
├── frontend/          # Next.js application
│   ├── src/
│   │   ├── app/      # Pages (App Router)
│   │   ├── components/
│   │   └── lib/
│   └── public/
├── backend/          # NestJS application
│   ├── src/
│   │   ├── modules/
│   │   └── scripts/
│   └── prisma/
└── docs/            # Documentation
\`\`\`

## 🧪 Testes

### Frontend Testing
\`\`\`typescript
// Exemplo de teste de componente
import { render, screen } from '@testing-library/react';
import { MetricCard } from './MetricCard';

test('renders metric card with value', () => {
  render(<MetricCard title="Test" value={50} description="Test desc" />);
  expect(screen.getByText('50%')).toBeInTheDocument();
});
\`\`\`

### Backend Testing
\`\`\`typescript
// Exemplo de teste de serviço
describe('SragService', () => {
  it('should calculate metrics correctly', async () => {
    const metrics = await service.getMetrics({});
    expect(metrics.caseRate).toBeDefined();
  });
});
\`\`\`

## 📚 Recursos Úteis

- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 📞 Precisa de Ajuda?

- 📧 Email: dev@indicium.tech
- 💬 Discord: [Link do servidor]
- 📖 Docs: [Link da documentação]

## 📜 Código de Conduta

Este projeto adere ao [Contributor Covenant](https://www.contributor-covenant.org/). Ao participar, você concorda em seguir este código de conduta.

---

Obrigado por contribuir! 🎉
