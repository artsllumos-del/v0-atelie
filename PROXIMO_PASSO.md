# Próximos Passos - Guia de Desenvolvimento

## 🎯 Estratégia de Conclusão

O sistema está 100% funcional na parte de infraestrutura e autenticação. Agora é fácil completar seguindo os padrões estabelecidos.

---

## 1️⃣ COMPLETAR MÓDULOS ADMIN (Prioridade Alta)

### Padrão a Seguir
Cada módulo admin deve ser construído igual ao módulo de **Estoque** em `/admin/estoque/page.tsx`:

```
1. Component 'use client'
2. Hook: const supabase = createClient()
3. State para dados e form
4. useEffect para fetch via API
5. Handler para CRUD
6. UI com Dialog, Input, Table, etc
7. Toast para feedback
```

### Módulos para Implementar (Em Ordem)

#### A. `/admin/produtos` - Produto com BOM
```typescript
// Tipo
interface Product {
  id: string
  name: string
  sku: string
  description: string
  base_cost: number
  labor_cost: number
  margin_percentage: number
  selling_price: number
}

// API: GET/POST /api/products/route.ts
// Funcionalidades:
// - CRUD de produtos
// - Adicionar materiais ao produto (BOM)
// - Calcular custo total automaticamente
// - Visualizar margem de lucro
```

#### B. `/admin/precificacao` - Preços Inteligentes
```typescript
// Lógica:
// formula: selling_price = (base_cost + labor_cost) / (1 - margin/100)
// 
// Features:
// - Ajustar margin por categoria
// - Aplicar markup automático
// - Histórico de preços
// - Comparar custo x venda
```

#### C. `/admin/orcamentos` - Orçamentos com PDF
```typescript
// Tipo
interface Quote {
  id: string
  customer_id: string
  items: QuoteItem[] // produto + quantidade
  discount_percentage: number
  total_price: number
  frozen_at?: timestamp
  status: 'draft' | 'sent' | 'accepted' | 'rejected'
}

// Features:
// - Montar orçamento com produtos
// - Congelar preço da data
// - Gerar PDF
// - Converter em pedido
// - Histórico
```

#### D. `/admin/pedidos` - Pedidos com Kanban
```typescript
// Status: pending → approved → production → ready → delivered
// 
// View: Kanban visual
// - Coluna por status
// - Drag-drop entre colunas
// - Click para detalhes
// 
// Features:
// - Criar pedido de orçamento
// - Acompanhar produção
// - Alertas de materiais faltantes
// - Gerar etiqueta de envio
```

#### E. `/admin/producao` - Produção
```typescript
// Fila de produção com:
// - Prioridade
// - Data de entrega
// - Materiais necessários
// - Passo a passo
// 
// Features:
// - Marcar etapas concluídas
// - Bloquear se faltar material
// - Histórico de produção
// - Tempo médio por pedido
```

#### F. `/admin/clientes` - Base de Clientes
```typescript
// Customer com:
// - Dados completos
// - Histórico de compras
// - Total gasto
// - Crédito/débito
// 
// Features:
// - Buscar cliente
// - Ver todos pedidos
// - Contato
// - Editar dados
```

#### G. `/admin/financeiro` - Fluxo de Caixa
```typescript
// Dashboard com:
// - Total de vendas (mês/ano)
// - Lucro líquido
// - Custos operacionais
// - Contas a receber/pagar
// 
// Gráficos:
// - Vendas por período
// - Margem de lucro
// - Produtos mais lucrativos
```

#### H. `/admin/configuracoes` - Sistema
```typescript
// Permitir alterar:
// - Nome da empresa
// - Logo/imagens
// - Margens padrão
// - Impostos
// - Usuários e permissões
// - Backup de dados
```

---

## 2️⃣ IMPLEMENTAR LOJA PÚBLICA (Prioridade Alta)

### A. `/loja/page.tsx` - Home
```typescript
// Componentes:
// - Hero com imagem grande
// - Destaques de produtos
// - Como funciona (3 passos)
// - Testimonials
// - CTA para montador

// Exemplo layout:
// Hero > Destaques > Como Funciona > Terços Personalizados > CTA
```

### B. `/loja/produtos/page.tsx` - Catálogo
```typescript
// Grid de produtos:
// - Imagem
// - Nome
// - Preço
// - "Ver Detalhes" ou carrinho direto

// Filtros:
// - Categoria
// - Preço (min-max)
// - Avaliação
// - Busca

// Features:
// - Paginação
// - Ordenação
// - Adicionar ao carrinho
```

### C. `/loja/montador/page.tsx` - Montador de Terços ⭐ CENTRAL
```typescript
// Passo a Passo:
// 1. Escolher tipo de terço
// 2. Escolher contas (cor, tamanho, tipo)
// 3. Escolher crucifixo
// 4. Escolher cordão/fio
// 5. Revisar e calcular preço
// 6. Adicionar ao carrinho

// Features:
// - Preview visual 3D/2D
// - Cálculo dinâmico de preço
// - Quantidade de contas
// - Materialidades
// - Customização de cores

// Estado:
interface CustomRosary {
  type: 'rosary_15' | 'rosary_30' | 'rosary_40'
  beads: {
    type: string // material
    color: string
    quantity: number
    cost: number
  }
  crucifix: { id: string; cost: number }
  cord: { id: string; cost: number }
  total_cost: number
  total_price: number
}
```

### D. `/loja/carrinho/page.tsx` - Carrinho
```typescript
// Mostrar:
// - Produtos adicionados
// - Quantidade
// - Preço unitário e total
// - Opção de remover

// Features:
// - Cupom de desconto
// - Calcular frete (integrar API)
// - Resumo do pedido
// - Botão "Ir para Checkout"
```

### E. `/loja/checkout/page.tsx` - Checkout (2 etapas)
```typescript
// Etapa 1: Endereço
// - Nome completo
// - E-mail
// - Telefone
// - CEP → endereço automático
// - Complemento

// Etapa 2: Pagamento
// - Opções: Cartão, Pix, Boleto
// - Dados do cartão (integrar Stripe)
// - Confirmar pedido
// - Redireionar para confirmação
```

### F. `/loja/conta/page.tsx` - Área do Cliente
```typescript
// Dashboard com:
// - Dados da conta
// - Histórico de pedidos
// - Terços customizados salvos
// - Wishlist
// - Dados de entrega

// Features:
// - Editar perfil
// - Ver status pedido
// - Rastrear entrega
// - Baixar NF
```

---

## 3️⃣ FLUXO DE DESENVOLVIMENTO RECOMENDADO

### Semana 1: Produtos & Precificação
```
Dia 1-2: Implementar /admin/produtos
Dia 3-4: Implementar /admin/precificacao
Dia 5: Testar fluxo product → preço
```

### Semana 2: Vendas
```
Dia 1-2: Implementar /admin/orcamentos
Dia 3-4: Implementar /admin/pedidos
Dia 5: Testar fluxo orçamento → pedido
```

### Semana 3: Produção & Admin
```
Dia 1-2: Implementar /admin/producao
Dia 3: Implementar /admin/clientes
Dia 4: Implementar /admin/financeiro
Dia 5: Implementar /admin/configuracoes
```

### Semana 4: Loja Pública
```
Dia 1-2: Implementar /loja/page + /loja/produtos
Dia 3-4: Implementar /loja/montador
Dia 5: Integrar ao carrinho
```

### Semana 5: Checkout & Finalização
```
Dia 1-2: Implementar /loja/carrinho + /loja/checkout
Dia 3-4: Integrar Stripe para pagamento
Dia 5: Testes e refinamentos
```

---

## 4️⃣ PADRÃO DE CÓDIGO A SEGUIR

### Template para Cada Página

```typescript
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Data {
  id: string
  // ... campos
}

export default function PageName() {
  const supabase = createClient()
  const [data, setData] = useState<Data[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false) // para dialog

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const { data: result, error } = await supabase
        .from('table_name')
        .select('*')
      
      if (error) throw error
      setData(result || [])
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async (formData) => {
    try {
      const { error } = await supabase
        .from('table_name')
        .insert(formData)
      
      if (error) throw error
      toast.success('Criado com sucesso!')
      fetchData()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  // ... UI implementation
}
```

---

## 5️⃣ RECURSOS ÚTEIS

### Componentes Prontos para Copiar
- Veja `/app/admin/estoque/page.tsx` como referência
- Card, Input, Button, Dialog, Table já estão em uso
- Badge, Progress também disponíveis

### APIs para Expandir
- `/api/materials` - Copiar pattern para outros endpoints
- Adicionar validação de auth em cada rota
- Tratar erros uniformemente

### Database
- Todas tabelas já criadas em `scripts/01_init_schema.sql`
- RLS já ativo
- Basta fazer INSERT/UPDATE/SELECT

---

## 6️⃣ TESTES RECOMENDADOS

### Teste Manual de Cada Página
1. Criar um item
2. Editar o item
3. Deletar o item
4. Verificar validações
5. Testar filters/search

### Teste de Integração
1. Criar produto
2. Ajustar preço
3. Criar orçamento
4. Converter em pedido
5. Acompanhar produção
6. Marcar como entregue

### Teste de Loja
1. Navegar catálogo
2. Montar terço customizado
3. Adicionar ao carrinho
4. Fazer checkout
5. Verificar pedido em admin

---

## 🚀 COMANDO PARA INICIAR

```bash
cd /vercel/share/v0-project
pnpm dev
# Abre http://localhost:3000
```

---

## ✅ SUCESSO!

Quando completar tudo, você terá:
- ✅ Sistema admin completo e funcional
- ✅ Loja pública operacional
- ✅ Montador de terços interativo
- ✅ Checkout com pagamento
- ✅ Área de cliente
- ✅ Relatórios e análises

**Tempo estimado: 40-60 horas de desenvolvimento limpo**

Boa sorte! 🎉
