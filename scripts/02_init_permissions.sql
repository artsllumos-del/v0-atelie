-- Permissões base do sistema
INSERT INTO public.permissions (name, description, module, action) VALUES
-- Dashboard
('view_dashboard', 'Ver dashboard', 'dashboard', 'view'),

-- Estoque
('view_stock', 'Ver estoque', 'estoque', 'view'),
('create_material', 'Criar material', 'estoque', 'create'),
('edit_material', 'Editar material', 'estoque', 'edit'),
('delete_material', 'Deletar material', 'estoque', 'delete'),
('view_stock_history', 'Ver histórico de estoque', 'estoque', 'view_history'),

-- Produtos
('view_products', 'Ver produtos', 'produtos', 'view'),
('create_product', 'Criar produto', 'produtos', 'create'),
('edit_product', 'Editar produto', 'produtos', 'edit'),
('delete_product', 'Deletar produto', 'produtos', 'delete'),

-- Precificação
('view_pricing', 'Ver precificação', 'precificacao', 'view'),
('edit_pricing', 'Editar precificação', 'precificacao', 'edit'),

-- Orçamentos
('view_quotes', 'Ver orçamentos', 'orcamentos', 'view'),
('create_quote', 'Criar orçamento', 'orcamentos', 'create'),
('edit_quote', 'Editar orçamento', 'orcamentos', 'edit'),
('delete_quote', 'Deletar orçamento', 'orcamentos', 'delete'),
('generate_quote_pdf', 'Gerar PDF de orçamento', 'orcamentos', 'pdf'),

-- Pedidos
('view_orders', 'Ver pedidos', 'pedidos', 'view'),
('create_order', 'Criar pedido', 'pedidos', 'create'),
('edit_order', 'Editar pedido', 'pedidos', 'edit'),
('update_order_status', 'Atualizar status do pedido', 'pedidos', 'update_status'),
('view_production_panel', 'Ver painel de produção', 'pedidos', 'view_production'),

-- Produção
('view_production', 'Ver produção', 'producao', 'view'),
('update_production', 'Atualizar produção', 'producao', 'update'),

-- Clientes
('view_customers', 'Ver clientes', 'clientes', 'view'),
('create_customer', 'Criar cliente', 'clientes', 'create'),
('edit_customer', 'Editar cliente', 'clientes', 'edit'),
('delete_customer', 'Deletar cliente', 'clientes', 'delete'),

-- Financeiro
('view_financial', 'Ver financeiro', 'financeiro', 'view'),
('create_transaction', 'Criar transação', 'financeiro', 'create'),
('edit_transaction', 'Editar transação', 'financeiro', 'edit'),
('delete_transaction', 'Deletar transação', 'financeiro', 'delete'),

-- Colaboradores
('manage_users', 'Gerenciar usuários', 'usuarios', 'manage'),
('create_user', 'Criar usuário', 'usuarios', 'create'),
('edit_user', 'Editar usuário', 'usuarios', 'edit'),
('delete_user', 'Deletar usuário', 'usuarios', 'delete'),
('manage_permissions', 'Gerenciar permissões', 'usuarios', 'manage_permissions'),

-- Configurações
('view_settings', 'Ver configurações', 'configuracoes', 'view'),
('edit_settings', 'Editar configurações', 'configuracoes', 'edit'),
('edit_store_branding', 'Editar branding da loja', 'configuracoes', 'edit_branding')
ON CONFLICT (name) DO NOTHING;

-- Inserts locais para dados base (terços, componentes padrão, etc.)
-- Estes dados podem ser adicionados manualmente via painel admin ou com próximas migrações
