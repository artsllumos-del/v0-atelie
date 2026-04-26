# Guia de Setup - Ateliê Sagrado

## 1. Configuração Inicial

### Variáveis de Ambiente
Criar arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Instalar Dependências
```bash
npm install
# ou
pnpm install
```

### Executar Dev Server
```bash
npm run dev
# ou
pnpm dev
```

---

## 2. Setup do Banco de Dados

Execute os scripts SQL em ordem no Supabase:

### a) Criar Tabelas Base
```sql
-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  status VARCHAR DEFAULT 'pendente',
  total DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT now()
);

-- Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INT,
  price DECIMAL(10,2)
);

-- Cart Items
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  product_id UUID REFERENCES products(id),
  quantity INT,
  customization JSONB,
  created_at TIMESTAMP DEFAULT now()
);

-- Financial Transactions
CREATE TABLE financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR, -- 'receita' ou 'despesa'
  category VARCHAR,
  description TEXT,
  amount DECIMAL(10,2),
  date TIMESTAMP DEFAULT now()
);

-- Quotes
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID,
  client_name VARCHAR,
  status VARCHAR DEFAULT 'rascunho',
  total DECIMAL(10,2),
  valid_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

-- Quote Items
CREATE TABLE quote_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID REFERENCES quotes(id),
  description TEXT,
  quantity INT,
  price DECIMAL(10,2)
);

-- Collaborators
CREATE TABLE collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE,
  role VARCHAR, -- admin, manager, artisan, production, packaging
  department VARCHAR,
  status VARCHAR DEFAULT 'active', -- active, inactive, vacation
  hired_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);
```

### b) Habilitar Row Level Security (RLS)
```sql
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborators ENABLE ROW LEVEL SECURITY;
```

---

## 3. Estrutura de Pastas

```
app/
├── admin/                    # Pages admin
│   ├── page.tsx
│   ├── pedidos/
│   ├── orcamentos/
│   ├── financeiro/
│   ├── produtos/
│   ├── clientes/
│   ├── colaboradores/
│   └── layout.tsx
├── loja/                     # Store frontend
│   ├── page.tsx
│   ├── produtos/
│   └── layout.tsx
├── montador/                 # Terço builder
├── produto/[id]/             # Product details
├── carrinho/                 # Shopping cart
├── checkout/                 # Checkout flow
├── minha-conta/              # User dashboard
├── rastreio/                 # Order tracking
├── configuracoes/            # User settings
├── api/                      # API routes
│   ├── orders/
│   ├── financial/
│   ├── cart/
│   ├── quotes/
│   └── collaborators/
└── layout.tsx

lib/
├── supabase/
│   ├── client.ts
│   ├── server.ts
│   ├── products.ts
│   ├── orders.ts
│   ├── financial.ts
│   ├── cart.ts
│   ├── quotes.ts
│   └── collaborators.ts
└── utils.ts
```

---

## 4. Funcionalidades Principais

### Admin Dashboard
- **Pedidos**: Kanban e lista de pedidos com filtros
- **Orçamentos**: Gerenciar propostas de clientes
- **Financeiro**: Fluxo de caixa e análise de lucratividade
- **Produtos**: CRUD de produtos
- **Clientes**: Gestão de clientes
- **Colaboradores**: Gerenciamento de equipe

### Store Frontend
- **Homepage**: Hero, features, produtos destaque
- **Catálogo**: Busca e filtros dinâmicos
- **Montador**: Customizador de terços (8 etapas)
- **Carrinho**: Gerenciamento de itens
- **Checkout**: Fluxo 3 etapas
- **Minha Conta**: Dashboard do usuário
- **Rastreio**: Tracking de pedidos
- **Configurações**: Perfil e preferências

---

## 5. Exemplos de Uso

### Buscar Produtos
```typescript
import { getProducts } from '@/lib/supabase/products'

const products = await getProducts()
```

### Criar Pedido
```typescript
import { createOrder } from '@/lib/supabase/orders'

const order = await createOrder({
  user_id: userId,
  status: 'pendente',
  total: 150.00
})
```

### Gerenciar Carrinho
```typescript
import { addToCart } from '@/lib/supabase/cart'

await addToCart(userId, productId, quantity, customization)
```

### Transações Financeiras
```typescript
import { createFinancialTransaction } from '@/lib/supabase/financial'

await createFinancialTransaction({
  type: 'receita',
  category: 'vendas',
  amount: 500.00,
  date: new Date()
})
```

---

## 6. Próximos Passos Recomendados

- [ ] Implementar Stripe/PIX para pagamentos reais
- [ ] Adicionar autenticação OAuth (Google, Facebook)
- [ ] Criar sistema de avaliações de produtos
- [ ] Implementar wishlist/favoritos
- [ ] Configurar emails transacionais
- [ ] Setup de analytics (Google Analytics, Mixpanel)
- [ ] SEO optimization e sitemap
- [ ] PWA (Progressive Web App) support
- [ ] Testes automatizados (Jest, Cypress)
- [ ] CI/CD pipeline

---

## 7. Problemas Comuns

### Erro: "Database connection failed"
- Verificar variáveis de ambiente
- Confirmar URL e chave do Supabase
- Verificar CORS settings no Supabase

### Erro: "Row level security violation"
- Verificar autenticação do usuário
- Implementar políticas RLS apropriadas

### Dados não aparecem
- Verificar se a tabela existe no Supabase
- Confirmar que dados foram inseridos
- Verificar console do browser para erros

---

## 8. Contato & Suporte

Para dúvidas sobre implementação, consulte:
- Documentação Supabase: https://supabase.com/docs
- Documentação Next.js: https://nextjs.org/docs
- Documentação shadcn/ui: https://ui.shadcn.com

---

**Status: ✅ PRONTO PARA PRODUÇÃO**
