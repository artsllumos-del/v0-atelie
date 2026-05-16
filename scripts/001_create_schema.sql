-- Fase 1: Schema Principal - Ateliê Sagrado
-- Este script cria toda a estrutura de banco de dados

-- ============ ENUMS ============
CREATE TYPE user_role AS ENUM ('client', 'admin', 'colaborador', 'admin_principal');
CREATE TYPE order_status AS ENUM ('orcamento', 'confirmado', 'em_producao', 'pronto', 'enviado', 'entregue', 'cancelado');
CREATE TYPE production_status AS ENUM ('nao_iniciado', 'em_producao', 'finalizado', 'controle_qualidade');
CREATE TYPE payment_status AS ENUM ('pendente', 'parcial', 'pago', 'reembolsado');
CREATE TYPE notification_type AS ENUM ('pedido', 'orcamento', 'sistema', 'entrega', 'pagamento');

-- ============ PROFILES (Users) ============
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role user_role DEFAULT 'client',
  phone TEXT,
  cpf_cnpj TEXT UNIQUE,
  
  -- Endereço
  address_street TEXT,
  address_number TEXT,
  address_complement TEXT,
  address_neighborhood TEXT,
  address_city TEXT,
  address_state TEXT,
  address_zip TEXT,
  
  avatar_url TEXT,
  bio TEXT,
  
  -- Dados do colaborador
  position TEXT,
  salary DECIMAL(10, 2),
  hire_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Preferences
  language TEXT DEFAULT 'pt-BR',
  timezone TEXT DEFAULT 'America/Sao_Paulo',
  notifications_enabled BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by owner" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'admin_principal'));

CREATE POLICY "Profiles are updatable by owner" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'admin_principal'));

-- ============ PRODUTOS ============
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT UNIQUE,
  
  -- Categorias
  category TEXT NOT NULL, -- 'crucifixo', 'entremeio', 'conta_menor', 'conta_maior', 'acabamento', 'outro', 'embalagem'
  
  -- Estoque
  quantity_in_stock INT DEFAULT 0,
  min_quantity_alert INT DEFAULT 10,
  
  -- Preço
  cost_price DECIMAL(10, 2),
  sale_price DECIMAL(10, 2) NOT NULL,
  
  -- Imagem
  image_url TEXT,
  
  -- Metadados para composição
  material TEXT,
  color TEXT,
  size TEXT,
  
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by all" ON public.products
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Products are manageable by admin" ON public.products
  FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'admin_principal'));

-- ============ ESTOQUE (Histórico de Movimentação) ============
CREATE TABLE IF NOT EXISTS public.stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  movement_type TEXT NOT NULL, -- 'entrada', 'saida', 'ajuste', 'producao'
  quantity INT NOT NULL,
  reason TEXT,
  notes TEXT,
  
  -- Quem fez a movimentação
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Stock movements viewable by admin" ON public.stock_movements
  FOR SELECT USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'admin_principal', 'colaborador'));

CREATE POLICY "Stock movements manageable by admin" ON public.stock_movements
  FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'admin_principal'));

-- ============ CLIENTES ============
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  cpf_cnpj TEXT UNIQUE,
  
  -- Endereço
  address_street TEXT,
  address_number TEXT,
  address_complement TEXT,
  address_neighborhood TEXT,
  address_city TEXT,
  address_state TEXT,
  address_zip TEXT,
  
  -- Histórico
  total_orders INT DEFAULT 0,
  total_spent DECIMAL(12, 2) DEFAULT 0,
  last_order_date DATE,
  
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers viewable by owner and admin" ON public.customers
  FOR SELECT USING (user_id = auth.uid() OR (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'admin_principal'));

CREATE POLICY "Customers manageable by admin" ON public.customers
  FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'admin_principal'));

-- ============ ORÇAMENTOS ============
CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number TEXT UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  
  description TEXT,
  notes TEXT,
  
  -- Valores
  subtotal DECIMAL(12, 2) DEFAULT 0,
  discount DECIMAL(12, 2) DEFAULT 0,
  tax DECIMAL(12, 2) DEFAULT 0,
  total DECIMAL(12, 2) DEFAULT 0,
  
  -- Datas
  valid_until DATE,
  
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Quotes viewable by owner and admin" ON public.quotes
  FOR SELECT USING ((SELECT user_id FROM public.customers WHERE id = customer_id) = auth.uid() 
                     OR (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'admin_principal'));

CREATE POLICY "Quotes manageable by admin" ON public.quotes
  FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'admin_principal'));

-- ============ PEDIDOS ============
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  quote_id UUID REFERENCES public.quotes(id) ON DELETE SET NULL,
  
  -- Status
  status order_status DEFAULT 'orcamento',
  payment_status payment_status DEFAULT 'pendente',
  
  -- Descrição
  description TEXT,
  internal_notes TEXT,
  
  -- Valores
  subtotal DECIMAL(12, 2) DEFAULT 0,
  discount DECIMAL(12, 2) DEFAULT 0,
  tax DECIMAL(12, 2) DEFAULT 0,
  total DECIMAL(12, 2) DEFAULT 0,
  paid_amount DECIMAL(12, 2) DEFAULT 0,
  
  -- Datas
  order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  due_date DATE,
  completed_date TIMESTAMP WITH TIME ZONE,
  
  -- Entrega
  estimated_delivery_date DATE,
  actual_delivery_date DATE,
  
  -- Quem criou
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Orders viewable by owner and admin" ON public.orders
  FOR SELECT USING ((SELECT user_id FROM public.customers WHERE id = customer_id) = auth.uid() 
                     OR (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'admin_principal', 'colaborador'));

CREATE POLICY "Orders manageable by admin" ON public.orders
  FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'admin_principal'));

-- ============ ITENS DO PEDIDO ============
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  
  description TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  total DECIMAL(12, 2) NOT NULL,
  
  -- Customização do produto (para terços)
  customization_data JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Order items viewable by order owner and admin" ON public.order_items
  FOR SELECT USING ((SELECT (SELECT user_id FROM public.customers WHERE id = customer_id) FROM public.orders WHERE id = order_id) = auth.uid() 
                     OR (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'admin_principal', 'colaborador'));

-- ============ PRODUÇÃO ============
CREATE TABLE IF NOT EXISTS public.production_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  
  status production_status DEFAULT 'nao_iniciado',
  
  -- Responsável
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  -- Datas
  start_date TIMESTAMP WITH TIME ZONE,
  estimated_end_date DATE,
  actual_end_date TIMESTAMP WITH TIME ZONE,
  
  -- Tarefas de produção
  tasks JSONB DEFAULT '[]'::jsonb, -- Array de tarefas com checkbox
  
  -- Qualidade
  quality_notes TEXT,
  quality_checked_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  quality_checked_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.production_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Production orders viewable by admin and assigned" ON public.production_orders
  FOR SELECT USING (assigned_to = auth.uid() OR (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'admin_principal'));

CREATE POLICY "Production orders manageable by admin" ON public.production_orders
  FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'admin_principal'));

-- ============ PAGAMENTOS ============
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  
  amount DECIMAL(12, 2) NOT NULL,
  payment_method TEXT NOT NULL, -- 'dinheiro', 'cartao', 'transferencia', 'cheque'
  
  notes TEXT,
  
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  recorded_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Payments viewable by admin" ON public.payments
  FOR SELECT USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'admin_principal'));

CREATE POLICY "Payments manageable by admin" ON public.payments
  FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'admin_principal'));

-- ============ NOTIFICAÇÕES ============
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  
  -- Referência
  related_order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  related_quote_id UUID REFERENCES public.quotes(id) ON DELETE CASCADE,
  
  is_read BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Notifications viewable by owner" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Notifications updatable by owner" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

-- ============ CARRINHO ============
CREATE TABLE IF NOT EXISTS public.shopping_cart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Dados do item customizado (para terços)
  tamanho TEXT,
  crucifixo_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  entremeio_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  conta_menor_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  conta_maior_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  acabamento_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  outros_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  embalagem_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  
  quantity INT DEFAULT 1,
  unit_price DECIMAL(10, 2),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.shopping_cart ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cart viewable by owner" ON public.shopping_cart
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Cart manageable by owner" ON public.shopping_cart
  FOR ALL USING (user_id = auth.uid());

-- ============ TRIGGER: Auto-create profile on user signup ============
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
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============ ÍNDICES ============
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_date ON public.orders(order_date);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON public.stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_shopping_cart_user_id ON public.shopping_cart(user_id);
CREATE INDEX IF NOT EXISTS idx_production_orders_assigned_to ON public.production_orders(assigned_to);
