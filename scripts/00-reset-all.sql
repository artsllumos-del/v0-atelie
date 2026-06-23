-- =============================================================================
-- ATELIE SAGRADO - Schema Completo e Definitivo
-- Execute este script no Supabase SQL Editor
-- =============================================================================

-- Limpar tudo existente
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.financial_transactions CASCADE;
DROP TABLE IF EXISTS public.production_orders CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.quotes CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.stock_movements CASCADE;
DROP TABLE IF EXISTS public.inventory CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.settings CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Limpar tabelas antigas (schema antigo)
DROP TABLE IF EXISTS quote_items CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS production_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS notification_type CASCADE;

-- ============ ENUMS ============
CREATE TYPE user_role AS ENUM ('client', 'colaborador', 'admin', 'admin_principal');
CREATE TYPE order_status AS ENUM ('orcamento','confirmado','em_producao','pronto','enviado','entregue','cancelado');
CREATE TYPE production_status AS ENUM ('nao_iniciado','em_producao','finalizado','controle_qualidade');
CREATE TYPE payment_status AS ENUM ('pendente','parcial','pago','reembolsado');
CREATE TYPE notification_type AS ENUM ('pedido','orcamento','sistema','entrega','pagamento','estoque');

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT DEFAULT '',
  role user_role DEFAULT 'client',
  phone TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  address_street TEXT DEFAULT '',
  address_number TEXT DEFAULT '',
  address_complement TEXT DEFAULT '',
  address_neighborhood TEXT DEFAULT '',
  address_city TEXT DEFAULT '',
  address_state TEXT DEFAULT '',
  address_zip TEXT DEFAULT '',
  notifications_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ============ SETTINGS ============
CREATE TABLE public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings_select" ON public.settings FOR SELECT USING (true);
CREATE POLICY "settings_all_auth" ON public.settings FOR ALL USING (auth.role() = 'authenticated');

INSERT INTO public.settings (key, value) VALUES
  ('loja', '{"nome":"Ateliê Sagrado","descricao":"Terços artesanais feitos com amor, fé e dedicação.","email":"contato@ateliesagrado.com.br","telefone":"(11) 99999-9999","endereco":"São Paulo, SP","cnpj":"","instagram":"","whatsapp":""}'),
  ('sistema', '{"alertas_estoque":true,"bloquear_sem_estoque":true,"margem_minima":30,"pro_labore":2000,"despesas_fixas":500}'),
  ('precificacao', '{"margem_lucro":40,"custo_hora_trabalho":25,"tempo_medio_producao":2,"frete_percentual":10}'),
  ('notificacoes', '{"novos_pedidos":true,"estoque_critico":true,"prazos":true,"margem_baixa":true,"email":true,"sistema":true}')
ON CONFLICT (key) DO NOTHING;

-- ============ INVENTORY (Materiais/Estoque) ============
CREATE TABLE public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  supplier TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'outros',
  unit_type TEXT NOT NULL DEFAULT 'unidade',
  -- Estoque
  current_quantity NUMERIC(12,3) DEFAULT 0,
  minimum_quantity NUMERIC(12,3) DEFAULT 10,
  -- Custo unitário (calculado ou informado)
  unit_cost NUMERIC(12,6) DEFAULT 0,
  -- Custo por pacote (para calcular custo unitário automaticamente)
  package_quantity NUMERIC(12,3) DEFAULT 1,
  package_cost NUMERIC(12,2) DEFAULT 0,
  freight_cost NUMERIC(12,2) DEFAULT 0,
  -- Outros
  weight_per_unit NUMERIC(12,4) DEFAULT 0,
  calculation_method TEXT DEFAULT 'fixed',
  status TEXT DEFAULT 'active',
  notes TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inventory_all_auth" ON public.inventory FOR ALL USING (auth.role() = 'authenticated');

CREATE INDEX idx_inventory_category ON public.inventory(category);
CREATE INDEX idx_inventory_status ON public.inventory(status);

-- ============ STOCK MOVEMENTS ============
CREATE TABLE public.stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_id UUID NOT NULL REFERENCES public.inventory(id) ON DELETE CASCADE,
  movement_type TEXT NOT NULL DEFAULT 'entrada',
  quantity NUMERIC(12,3) NOT NULL,
  reason TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "movements_all_auth" ON public.stock_movements FOR ALL USING (auth.role() = 'authenticated');

-- ============ PRODUCTS ============
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  sku TEXT UNIQUE,
  category TEXT NOT NULL DEFAULT 'outro',
  quantity_in_stock INTEGER DEFAULT 0,
  min_quantity_alert INTEGER DEFAULT 5,
  cost_price NUMERIC(12,2) DEFAULT 0,
  sale_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  image_url TEXT DEFAULT '',
  material TEXT DEFAULT '',
  color TEXT DEFAULT '',
  size TEXT DEFAULT '',
  production_time_hours NUMERIC(5,2) DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  materials JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_select" ON public.products FOR SELECT USING (true);
CREATE POLICY "products_all_auth" ON public.products FOR ALL USING (auth.role() = 'authenticated');

-- ============ CUSTOMERS ============
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  cpf_cnpj TEXT DEFAULT '',
  type TEXT DEFAULT 'pessoa_fisica',
  address_street TEXT DEFAULT '',
  address_number TEXT DEFAULT '',
  address_complement TEXT DEFAULT '',
  address_neighborhood TEXT DEFAULT '',
  address_city TEXT DEFAULT '',
  address_state TEXT DEFAULT '',
  address_zip TEXT DEFAULT '',
  total_orders INTEGER DEFAULT 0,
  total_spent NUMERIC(12,2) DEFAULT 0,
  notes TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "customers_all_auth" ON public.customers FOR ALL USING (auth.role() = 'authenticated');

CREATE INDEX idx_customers_email ON public.customers(email);
CREATE INDEX idx_customers_active ON public.customers(is_active);

-- ============ QUOTES ============
CREATE TABLE public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number TEXT UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'rascunho',
  description TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  subtotal NUMERIC(12,2) DEFAULT 0,
  discount NUMERIC(12,2) DEFAULT 0,
  total NUMERIC(12,2) DEFAULT 0,
  valid_until DATE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quotes_all_auth" ON public.quotes FOR ALL USING (auth.role() = 'authenticated');

-- ============ ORDERS ============
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  quote_id UUID REFERENCES public.quotes(id) ON DELETE SET NULL,
  status order_status DEFAULT 'orcamento',
  payment_status payment_status DEFAULT 'pendente',
  description TEXT DEFAULT '',
  internal_notes TEXT DEFAULT '',
  subtotal NUMERIC(12,2) DEFAULT 0,
  discount NUMERIC(12,2) DEFAULT 0,
  total NUMERIC(12,2) DEFAULT 0,
  paid_amount NUMERIC(12,2) DEFAULT 0,
  order_date TIMESTAMPTZ DEFAULT NOW(),
  due_date DATE,
  estimated_delivery_date DATE,
  actual_delivery_date DATE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders_all_auth" ON public.orders FOR ALL USING (auth.role() = 'authenticated');

CREATE INDEX idx_orders_customer ON public.orders(customer_id);
CREATE INDEX idx_orders_status ON public.orders(status);

-- ============ ORDER ITEMS ============
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  description TEXT NOT NULL DEFAULT '',
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  customization_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "order_items_all_auth" ON public.order_items FOR ALL USING (auth.role() = 'authenticated');

-- ============ PRODUCTION ORDERS ============
CREATE TABLE public.production_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status production_status DEFAULT 'nao_iniciado',
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  start_date TIMESTAMPTZ,
  estimated_end_date DATE,
  actual_end_date TIMESTAMPTZ,
  tasks JSONB DEFAULT '[]',
  quality_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.production_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "production_all_auth" ON public.production_orders FOR ALL USING (auth.role() = 'authenticated');

-- ============ FINANCIAL TRANSACTIONS ============
CREATE TABLE public.financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('receita','despesa')),
  category TEXT NOT NULL DEFAULT 'outros',
  description TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  payment_method TEXT DEFAULT 'outros',
  notes TEXT DEFAULT '',
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "financial_all_auth" ON public.financial_transactions FOR ALL USING (auth.role() = 'authenticated');

CREATE INDEX idx_financial_date ON public.financial_transactions(date);
CREATE INDEX idx_financial_type ON public.financial_transactions(type);

-- ============ NOTIFICATIONS ============
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL DEFAULT 'sistema',
  title TEXT NOT NULL,
  message TEXT DEFAULT '',
  related_order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_own" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "notifications_insert_auth" ON public.notifications FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(is_read);

-- ============ TRIGGER: updated_at ============
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER inventory_updated_at BEFORE UPDATE ON public.inventory FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER quotes_updated_at BEFORE UPDATE ON public.quotes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER production_updated_at BEFORE UPDATE ON public.production_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============ TRIGGER: Auto profile on signup ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'client')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
