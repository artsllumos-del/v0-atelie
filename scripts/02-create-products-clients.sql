-- Script para criar as tabelas de produtos e clientes
-- Execute este script no seu banco de dados Supabase

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  base_price DECIMAL(10, 2) NOT NULL,
  sale_price DECIMAL(10, 2),
  production_time_minutes INTEGER,
  is_customizable BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Clientes
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  notes TEXT,
  is_company BOOLEAN DEFAULT false,
  company_name VARCHAR(255),
  cnpj VARCHAR(18),
  order_count INTEGER DEFAULT 0,
  total_spent DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes para melhor performance
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_is_company ON clients(is_company);

-- RLS (Row Level Security) para produtos
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users" ON products
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON products
  FOR DELETE USING (auth.role() = 'authenticated');

-- RLS para clientes
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users" ON clients
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON clients
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON clients
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON clients
  FOR DELETE USING (auth.role() = 'authenticated');
