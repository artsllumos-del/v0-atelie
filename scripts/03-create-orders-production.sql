-- Script para criar as tabelas de pedidos e produção
-- Execute este script no seu banco de dados Supabase

-- Tabela de Pedidos
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, in_production, completed, delivered, cancelled
  total_price DECIMAL(10, 2),
  deposit_paid DECIMAL(10, 2) DEFAULT 0,
  remaining_balance DECIMAL(10, 2),
  notes TEXT,
  deadline DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Itens do Pedido
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2),
  customization_details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Produção
CREATE TABLE IF NOT EXISTS production_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, completed
  assigned_to UUID REFERENCES users(id),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_client ON orders(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_deadline ON orders(deadline);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_production_tasks_order ON production_tasks(order_id);
CREATE INDEX IF NOT EXISTS idx_production_tasks_status ON production_tasks(status);

-- RLS para Orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users" ON orders
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON orders
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON orders
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON orders
  FOR DELETE USING (auth.role() = 'authenticated');

-- RLS para Order Items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for authenticated users" ON order_items
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS para Production Tasks
ALTER TABLE production_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for authenticated users" ON production_tasks
  FOR ALL USING (auth.role() = 'authenticated');
