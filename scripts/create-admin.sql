-- Criar extensão uuid
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  role VARCHAR(50) NOT NULL DEFAULT 'cliente',
  avatar_url TEXT,
  phone VARCHAR(20),
  document VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de materiais
CREATE TABLE IF NOT EXISTS public.materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE,
  unit_type VARCHAR(50) NOT NULL,
  quantity_in_package DECIMAL(10, 2) NOT NULL,
  cost_per_package DECIMAL(10, 2) NOT NULL,
  cost_per_unit DECIMAL(10, 2) GENERATED ALWAYS AS (cost_per_package / NULLIF(quantity_in_package, 0)) STORED,
  minimum_quantity DECIMAL(10, 2),
  current_quantity DECIMAL(10, 2) DEFAULT 0,
  weight_grams DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  base_cost DECIMAL(10, 2) NOT NULL,
  labor_cost DECIMAL(10, 2) DEFAULT 0,
  markup_percentage DECIMAL(5, 2) DEFAULT 30,
  selling_price DECIMAL(10, 2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de clientes
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(2),
  zip_code VARCHAR(10),
  document VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de pedidos
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.customers(id),
  status VARCHAR(50) DEFAULT 'draft',
  total_amount DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de orçamentos
CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.customers(id),
  status VARCHAR(50) DEFAULT 'draft',
  total_amount DECIMAL(10, 2) NOT NULL,
  valid_until TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON public.users FOR SELECT USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin_principal', 'admin')
);

CREATE POLICY "Authenticated users can view materials" ON public.materials FOR SELECT USING (
  auth.role() = 'authenticated' AND (SELECT is_active FROM public.users WHERE id = auth.uid())
);
CREATE POLICY "Admins can manage materials" ON public.materials FOR ALL USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin_principal', 'admin')
);

CREATE POLICY "Customers view own data" ON public.customers FOR SELECT USING (
  user_id = auth.uid() OR (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin_principal', 'admin')
);

CREATE POLICY "Customers view own orders" ON public.orders FOR SELECT USING (
  customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()) OR 
  (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin_principal', 'admin')
);

CREATE POLICY "Customers view own quotes" ON public.quotes FOR SELECT USING (
  customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()) OR 
  (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin_principal', 'admin')
);
