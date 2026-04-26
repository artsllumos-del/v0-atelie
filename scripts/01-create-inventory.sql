-- Script para criar a tabela de estoque/inventário
-- Execute este script no seu banco de dados Supabase

-- Tabela de Estoque
CREATE TABLE IF NOT EXISTS inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  quantity INTEGER DEFAULT 0,
  minimum_quantity INTEGER DEFAULT 10,
  unit_cost DECIMAL(10, 2),
  unit VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index para melhor performance
CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory(category);
CREATE INDEX IF NOT EXISTS idx_inventory_quantity ON inventory(quantity);

-- RLS para inventory
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users" ON inventory
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON inventory
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON inventory
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON inventory
  FOR DELETE USING (auth.role() = 'authenticated');
