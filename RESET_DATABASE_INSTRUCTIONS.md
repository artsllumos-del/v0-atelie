# Instruções para Resetar o Banco de Dados

## Como Executar o Reset

### Opção 1: Via Supabase Dashboard

1. Acesse sua conta Supabase em https://app.supabase.com
2. Selecione seu projeto **v0-atelie**
3. Na barra lateral, clique em **SQL Editor**
4. Clique em **New Query**
5. Copie todo o conteúdo do arquivo `scripts/00-reset-all.sql`
6. Cole no editor SQL
7. Clique em **Run** (ou Ctrl+Enter)
8. Aguarde a execução completar

### Opção 2: Via Supabase CLI

```bash
# Se ainda não tem Supabase CLI instalado
npm install -g @supabase/cli

# Autentique
supabase login

# Execute o script
supabase db push --file scripts/00-reset-all.sql
```

## O que o Reset Faz

O script `00-reset-all.sql` realiza as seguintes operações:

### ✅ Tabelas Recriadas com Schema Correto

1. **users** - Sistema de autenticação
2. **clients** - Clientes com endereço e contato
3. **inventory** - Estoque com campos completos:
   - `supplier` (fornecedor) 
   - `weight_per_unit` (peso por unidade)
   - `calculation_method` (fixed ou weight)
   - `status` (active/inactive)
4. **products** - Produtos com precificação
5. **orders** - Pedidos dos clientes
6. **order_items** - Itens de pedido
7. **quotes** - Orçamentos
8. **quote_items** - Itens de orçamento
9. **financial_transactions** - Transações financeiras

### ✅ Dados Iniciais

O script insere **5 itens de exemplo no estoque** com fornecedores reais:
- Contas de Madeira 8mm
- Contas de Cristal
- Entremeio Prata
- Corrente Fina Ouro
- Crucifixo Madeira

Esses são apenas para referência - **todos podem ser editados ou deletados**.

### ✅ Segurança

- Row Level Security (RLS) habilitado em todas as tabelas
- Policies padrão permissivas (configure conforme necessário)
- Índices criados para performance
- Relacionamentos com foreign keys

## Depois do Reset

### 1. Verificar Dados
- Acesse `/admin/estoque` no seu navegador
- Você deve ver os 5 itens de exemplo

### 2. Testar CRUD
- **Criar**: Clique em "Novo Item" no canto superior
- **Editar**: Clique nos "..." em um item e selecione "Editar"
- **Deletar**: Clique nos "..." em um item e selecione "Deletar"

### 3. Limpar Dados de Teste (Opcional)
Se quiser começar completamente vazio, delete os itens um por um através da interface.

## Campos Restaurados

### Inventory (Estoque)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Identificador único |
| name | TEXT | Nome do item |
| description | TEXT | Descrição adicional |
| **supplier** | TEXT | **Fornecedor (RESTAURADO)** |
| category | TEXT | Categoria (contas, entremeio, etc) |
| unit_type | TEXT | Tipo de unidade (unidade, kg, metro, etc) |
| current_quantity | INTEGER | Quantidade em estoque |
| minimum_quantity | INTEGER | Quantidade mínima |
| unit_cost | DECIMAL | Custo por unidade |
| **weight_per_unit** | DECIMAL | **Peso por unidade em gramas (RESTAURADO)** |
| **calculation_method** | TEXT | **fixed ou weight (RESTAURADO)** |
| **status** | TEXT | **active ou inactive (RESTAURADO)** |
| notes | TEXT | Observações |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data de atualização |

## Troubleshooting

### Erro: "RLS is active on table X"
- Desative RLS temporariamente, execute o script, e reative se necessário
- Na maioria dos casos o script já cuida disso

### Erro: "Table already exists"
- O script faz `DROP TABLE IF EXISTS` primeiro
- Se o erro persistir, verifique se há locks no banco
- Tente executar novamente em alguns minutos

### Dados desapareceram
- Verifique que está usando a URL correta do Supabase
- Confirme que o projeto é mesmo **v0-atelie**

## Próximos Passos

1. ✅ Resetar banco de dados (este arquivo)
2. Testar CRUD (Create, Read, Update, Delete)
3. Adicionar seus próprios itens de estoque
4. Configurar fornecedores padrão
5. Ajustar categorias conforme necessário

