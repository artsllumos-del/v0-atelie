'use client'

import { createClient } from './client'
import { calcUnitCostFromPackage } from '@/lib/currency'

export type InventoryItem = {
  id: string
  name: string
  description: string
  supplier: string
  category: string
  unit_type: string
  current_quantity: number
  minimum_quantity: number
  unit_cost: number
  package_quantity: number
  package_cost: number
  freight_cost: number
  weight_per_unit: number
  calculation_method: string
  status: string
  notes: string
  image_url: string
  created_at: string
  updated_at: string
}

export async function getInventoryItems(): Promise<InventoryItem[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data || []) as InventoryItem[]
}

export async function getLowStockItems(limit = 100): Promise<InventoryItem[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .order('current_quantity', { ascending: true })
    .limit(limit)

  if (error) throw new Error(error.message)
  return ((data || []) as InventoryItem[]).filter(
    (item) => item.current_quantity <= item.minimum_quantity
  )
}

function buildInventoryPayload(item: Partial<InventoryItem>) {
  const packageCost = Number(item.package_cost) || 0
  const freightCost = Number(item.freight_cost) || 0
  const packageQty = Number(item.package_quantity) || 1
  const method = item.calculation_method || 'fixed'

  // Calcula custo unitário se método for 'package'
  let unitCost = Number(item.unit_cost) || 0
  if (method === 'package') {
    unitCost = calcUnitCostFromPackage(packageCost, freightCost, packageQty)
  }

  return {
    name: item.name || '',
    description: item.description || '',
    supplier: item.supplier || '',
    category: item.category || 'outros',
    unit_type: item.unit_type || 'unidade',
    current_quantity: Number(item.current_quantity) || 0,
    minimum_quantity: Number(item.minimum_quantity) || 10,
    unit_cost: unitCost,
    package_quantity: packageQty,
    package_cost: packageCost,
    freight_cost: freightCost,
    weight_per_unit: Number(item.weight_per_unit) || 0,
    calculation_method: method,
    status: item.status || 'active',
    notes: item.notes || '',
    image_url: item.image_url || '',
  }
}

export async function createInventoryItem(item: Partial<InventoryItem>): Promise<InventoryItem> {
  const supabase = createClient()
  const payload = buildInventoryPayload(item)

  const { data, error } = await supabase
    .from('inventory')
    .insert([payload])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as InventoryItem
}

export async function updateInventoryItem(
  id: string,
  item: Partial<InventoryItem>
): Promise<InventoryItem> {
  const supabase = createClient()
  const payload = buildInventoryPayload(item)

  const { data, error } = await supabase
    .from('inventory')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as InventoryItem
}

export async function deleteInventoryItem(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('inventory').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function updateInventoryQuantity(
  id: string,
  newQuantity: number
): Promise<InventoryItem> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('inventory')
    .update({ current_quantity: newQuantity })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as InventoryItem
}
