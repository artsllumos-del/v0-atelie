import { createClient } from './client'

export async function getOrders(userId?: string) {
  const supabase = createClient()
  const query = supabase.from('orders').select('*').order('created_at', { ascending: false })
  if (userId) query.eq('user_id', userId)
  const { data } = await query
  return data || []
}

export async function getOrderById(id: string) {
  const supabase = createClient()
  const { data } = await supabase.from('orders').select('*').eq('id', id).single()
  return data
}

export async function createOrder(order: any) {
  const supabase = createClient()
  const { data, error } = await supabase.from('orders').insert([order]).select().single()
  if (error) throw error
  return data
}

export async function updateOrder(id: string, updates: any) {
  const supabase = createClient()
  const { data, error } = await supabase.from('orders').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteOrder(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('orders').delete().eq('id', id)
  if (error) throw error
}

export async function getOrderItems(orderId: string) {
  const supabase = createClient()
  const { data } = await supabase.from('order_items').select('*').eq('order_id', orderId)
  return data || []
}

export async function addOrderItem(item: any) {
  const supabase = createClient()
  const { data, error } = await supabase.from('order_items').insert([item]).select().single()
  if (error) throw error
  return data
}

// Alias for addOrderItem for compatibility
export const createOrderItem = addOrderItem

export async function updateOrderItem(id: string, updates: any) {
  const supabase = createClient()
  const { data, error } = await supabase.from('order_items').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function getOrdersByStatus(status: string) {
  const supabase = createClient()
  const { data } = await supabase.from('orders').select('*').eq('status', status).order('created_at', { ascending: false })
  return data || []
}
