# Ateliê Sagrado v2.0 - Admin Dashboard

## Visão Geral
Sistema completo de gestão para produção artesanal de terços e produtos religiosos. Interface administrativa com controle total de estoque, precificação inteligente, gerenciamento de pedidos e análise financeira.

## Características Principais

### Módulos Implementados
1. **Dashboard** - Visão geral com KPIs principais
2. **Estoque** - Gerenciamento de matérias-primas por categoria
3. **Produtos** - Catálogo com precificação e margem
4. **Precificação** - Cálculo inteligente com análise de custos
5. **Pedidos** - Rastreamento com timeline de produção
6. **Orçamentos** - Gestão de cotações para clientes
7. **Produção** - Acompanhamento da produção
8. **Clientes** - Base de dados de clientes
9. **Financeiro** - Dashboard de receitas e despesas
10. **Configurações** - Personalizações do sistema

### Melhorias Implementadas v2.0
- ✅ Remoção completa da loja pública
- ✅ Autenticação com Supabase
- ✅ Logout funcionando
- ✅ Dialogs de formulários corrigidos
- ✅ Redesign da página de login
- ✅ Error boundaries para robustez
- ✅ Loading skeletons
- ✅ Responsividade mobile
- ✅ Toast notifications
- ✅ Formulários validados

## Arquitetura

### Stack Tecnológico
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **State**: SWR (Data fetching & caching)
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts (future)
- **Icons**: Lucide React

### Estrutura de Pastas
```
/app
  /admin          # Páginas admin principais
  /auth           # Autenticação
  /api            # Endpoints internos
/components
  /admin          # Componentes admin (dialogs, tables, forms)
  /ui             # shadcn/ui components
/lib
  /supabase       # Serviços Supabase
  /types          # TypeScript types
/public           # Assets estáticos
```

## Guia de Uso

### Credenciais de Teste
```
Email: demo@atelie.com
Senha: 123456
```

### Principais Workflows

#### 1. Adicionar Novo Produto
1. Ir para **Produtos**
2. Clicar em **Novo Produto**
3. Preencher dados (nome, descrição, preço base, tempo produção)
4. Salvar

#### 2. Gerenciar Estoque
1. Ir para **Estoque**
2. Adicionar/editar itens por categoria
3. Sistema avisa quando estoque está baixo

#### 3. Calcular Preço de Produto
1. Ir para **Precificação**
2. Selecionar produto
3. Sistema calcula automaticamente com base em:
   - Custo de materiais
   - Mão de obra (por hora)
   - Custos indiretos (embalagem, energia, etc)
   - Margem configurável

#### 4. Gerenciar Pedidos
1. Ir para **Pedidos**
2. Visualizar timeline de produção
3. Atualizar status
4. Gerar PDF/enviar para cliente

## Bugs Corrigidos

### Issue #1: Popups não abrindo
**Problema**: Dialogs de formulários não apareciam
**Causa**: Uso incorreto de handler `onOpenChange`
**Solução**: Implementar padrão controlado com `handleOpenChange(open: boolean)`

### Issue #2: Logout não funcionava
**Problema**: Botão de logout não desconectava
**Causa**: Função não implementada
**Solução**: Adicionar `supabase.auth.signOut()` no handler

### Issue #3: Precificação obsoleta
**Problema**: Preços não refletiam custos reais
**Causa**: Fórmula de cálculo desatualizada
**Solução**: Implementar novo motor de precificação com:
- Custo base atualizado
- Cálculo dinâmico de margem
- Análise de rentabilidade

### Issue #4: Login em inglês
**Problema**: Interface em inglês
**Causa**: Design padrão
**Solução**: Traduçãoicompleta, redesign com UX melhorada

## API Endpoints

### Produtos
```
GET  /api/products          # Listar produtos
POST /api/products          # Criar produto
PATCH /api/products/:id     # Atualizar
DELETE /api/products/:id    # Deletar
```

### Estoque
```
GET  /api/inventory         # Listar itens
POST /api/inventory         # Criar item
PATCH /api/inventory/:id    # Atualizar quantidade
```

### Pedidos
```
GET  /api/orders            # Listar pedidos
POST /api/orders            # Criar pedido
PATCH /api/orders/:id       # Atualizar status
```

## Variáveis de Ambiente

Criar `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=sua_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave
```

## Performance

- Next.js Image Optimization ativada
- SWR para cache inteligente
- Code splitting automático
- Lazy loading de componentes

## Segurança

- ✅ Row Level Security (RLS) no Supabase
- ✅ Validação com Zod schemas
- ✅ CSRF protection
- ✅ SQL injection prevention
- ✅ Session management segura

## Roadmap Futuro

- [ ] Mobile app
- [ ] Integração com Stripe/PagSeguro
- [ ] Email notifications
- [ ] PDF reports
- [ ] Relatórios avançados
- [ ] Multi-usuário com roles
- [ ] Backup automático
- [ ] API pública

## Suporte

Para reportar bugs ou sugestões, contactar: [suporte@atelie.com]

## Licença

Proprietary © 2026 Ateliê Sagrado
