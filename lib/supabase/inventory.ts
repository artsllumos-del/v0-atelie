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
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .lte('quantity', 'minimum_quantity')
    .order('quantity', { ascending: true })
    .limit(threshold)

  if (error) throw error
  return data || []
}

export async function createInventoryItem(item: any) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('inventory')
    .insert([{
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      minimum_quantity: item.minimum_quantity,
      unit_cost: item.unit_cost,
      unit: item.unit,
      created_at: new Date().toISOString(),
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
      category: item.category,
      quantity: item.quantity,
      minimum_quantity: item.minimum_quantity,
      unit_cost: item.unit_cost,
      unit: item.unit,
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
      quantity: newQuantity,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()

  if (error) throw error
  return data?.[0]
}
