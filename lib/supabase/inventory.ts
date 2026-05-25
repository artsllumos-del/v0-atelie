'use client'

// Funções para gerenciar estoque no Supabase
import { createClient } from './client'

export async function getInventoryItems() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getLowStockItems(threshold: number = 5) {
  const supabase = createClient()
  
  // Primeiro, pega todos os itens onde quantidade <= minimo
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .order('current_quantity', { ascending: true })
    .limit(threshold)

  if (error) throw error
  
  // Filtra client-side para garantir que pega itens com baixo estoque
  const filtered = (data || []).filter(item => 
    (item.current_quantity || 0) <= (item.minimum_quantity || 10)
  )
  
  return filtered
}

export async function createInventoryItem(item: any) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('inventory')
    .insert([{
      name: item.name,
      description: item.description || '',
      supplier: item.supplier,
      category: item.category,
      unit_type: item.unit_type,
      current_quantity: item.current_quantity || 0,
      minimum_quantity: item.minimum_quantity || 10,
      unit_cost: item.unit_cost || 0,
      weight_per_unit: item.weight_per_unit || 0,
      calculation_method: item.calculation_method || 'fixed',
      status: item.status || 'active',
      notes: item.notes || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }])
    .select()

  if (error) throw error
  return data?.[0]
}

export async function updateInventoryItem(id: string, item: any) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('inventory')
    .update({
      name: item.name,
      description: item.description || '',
      supplier: item.supplier,
      category: item.category,
      unit_type: item.unit_type,
      current_quantity: item.current_quantity || 0,
      minimum_quantity: item.minimum_quantity || 10,
      unit_cost: item.unit_cost || 0,
      weight_per_unit: item.weight_per_unit || 0,
      calculation_method: item.calculation_method || 'fixed',
      status: item.status || 'active',
      notes: item.notes || '',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()

  if (error) throw error
  return data?.[0]
}

export async function deleteInventoryItem(id: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('inventory')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function updateInventoryQuantity(id: string, newQuantity: number) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('inventory')
    .update({
      current_quantity: newQuantity,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()

  if (error) throw error
  return data?.[0]
}
